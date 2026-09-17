import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import net from "net";
import multer from "multer";
import { Collection, MongoClient } from "mongodb";
import { createServer as createViteServer } from "vite";
import {
  initialProfile,
  initialVideos,
  initialBlogs,
  servicesData,
  educationData,
  skillsCategories
} from "./src/data/initialData";

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "physiotherapy_portal";
const DB_FILE = path.join(process.cwd(), "data", "database.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const VIDEO_UPLOADS = path.join(UPLOADS_DIR, "videos");
const BLOG_UPLOADS = path.join(UPLOADS_DIR, "blogs");

async function findAvailablePort(startPort: number): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    const isFree = await new Promise<boolean>((resolve) => {
      const tester = net.createServer();

      tester.once("error", () => resolve(false));
      tester.once("listening", () => {
        tester.close(() => resolve(true));
      });

      tester.listen(port, "0.0.0.0");
    });

    if (isFree) {
      return port;
    }
  }

  return startPort;
}

// Ensure directories exist
[path.join(process.cwd(), "data"), UPLOADS_DIR, VIDEO_UPLOADS, BLOG_UPLOADS].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Database state management
interface DatabaseSchema {
  profile: typeof initialProfile;
  videos: typeof initialVideos;
  blogs: typeof initialBlogs;
  services: typeof servicesData;
  education: typeof educationData;
  skills: typeof skillsCategories;
  messages: Array<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    preferredDate?: string;
    service?: string;
    createdAt: string;
    status: 'new' | 'reviewed' | 'contacted';
  }>;
}

type StoredDatabase = DatabaseSchema & { key: string };

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      profile: initialProfile,
      videos: initialVideos,
      blogs: initialBlogs,
      services: servicesData,
      education: educationData,
      skills: skillsCategories,
      messages: [
        {
          id: "msg-1",
          fullName: "Hamza Malik",
          email: "hamza.m@gmail.com",
          phone: "03001234567",
          subject: "Sports Injury Consultation - Ankle Sprain",
          message: "Suffered a grade 2 inversion ankle sprain during weekend football match in F-8. Need manual assessment and rehabilitation exercises.",
          preferredDate: "2026-09-18",
          service: "Sports Injury Rehabilitation",
          createdAt: new Date().toISOString(),
          status: "new"
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse database.json, resetting to fallback", err);
    return {
      profile: initialProfile,
      videos: initialVideos,
      blogs: initialBlogs,
      services: servicesData,
      education: educationData,
      skills: skillsCategories,
      messages: []
    };
  }
}

function saveDatabase(data: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  if (mongoCollection) {
    void mongoCollection.replaceOne({ key: "primary" }, { ...data, key: "primary" }, { upsert: true })
      .catch(err => console.error("Failed to save database to MongoDB:", err));
  }
}

let db = loadDatabase();
let mongoClient: MongoClient | null = null;
let mongoCollection: Collection<StoredDatabase> | null = null;

async function initializeDatabase() {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not configured; using data/database.json.");
    return;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    mongoCollection = mongoClient.db(MONGODB_DB_NAME).collection<StoredDatabase>("site_state");
    const stored = await mongoCollection.findOne({ key: "primary" });

    if (stored) {
      const { key: _key, ...database } = stored;
      db = database;
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    } else {
      await mongoCollection.insertOne({ ...db, key: "primary" });
    }

    console.log(`MongoDB connected: ${MONGODB_DB_NAME}`);
  } catch (err) {
    console.error("MongoDB connection failed; using data/database.json:", err);
    mongoClient = null;
    mongoCollection = null;
  }
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploaded media files
app.use("/uploads", express.static(UPLOADS_DIR));

// Multer storage configurations
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, VIDEO_UPLOADS),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `video_${Date.now()}_${safeName}`);
  }
});
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max for video
});

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, BLOG_UPLOADS),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `img_${Date.now()}_${safeName}`);
  }
});
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Authentication verification helper
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (ADMIN_TOKEN && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized access" });
}

// ------------------- API ROUTES -------------------

// Admin Auth
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  if (ADMIN_PASSWORD && ADMIN_TOKEN && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: {
        name: "Dr. Kifayat Khan",
        role: "admin",
        email: db.profile.email
      }
    });
  }
  return res.status(401).json({ error: "Invalid admin password" });
});

app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (ADMIN_TOKEN && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return res.json({ authenticated: true, user: { name: "Dr. Kifayat Khan", role: "admin" } });
  }
  return res.status(401).json({ authenticated: false });
});

// Profile
app.get("/api/profile", (_req, res) => {
  res.json(db.profile);
});

app.put("/api/profile", requireAuth, (req, res) => {
  db.profile = { ...db.profile, ...req.body };
  saveDatabase(db);
  res.json(db.profile);
});

// Services, Education, Skills
app.get("/api/services", (_req, res) => {
  res.json(db.services);
});

app.get("/api/education", (_req, res) => {
  res.json(db.education);
});

app.get("/api/skills", (_req, res) => {
  res.json(db.skills);
});

// Videos API
app.get("/api/videos", (_req, res) => {
  res.json(db.videos);
});

app.post("/api/videos", requireAuth, (req, res) => {
  const { title, description, videoUrl, thumbnailUrl, duration, category } = req.body;
  if (!title || !videoUrl) {
    return res.status(400).json({ error: "Title and Video URL are required." });
  }
  const newVideo = {
    id: `vid-${Date.now()}`,
    title: title.trim(),
    description: description ? description.trim() : "",
    videoUrl: videoUrl.trim(),
    thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    duration: duration || "Custom",
    category: category || "Clinical Care",
    createdAt: new Date().toISOString().split("T")[0],
    isUploaded: false
  };
  db.videos.unshift(newVideo);
  saveDatabase(db);
  res.status(201).json(newVideo);
});

// Video File Upload endpoint
app.post("/api/videos/upload", requireAuth, uploadVideo.single("videoFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file provided." });
  }
  const { title, description, category, duration } = req.body;
  const relativePath = `/uploads/videos/${req.file.filename}`;
  const newVideo = {
    id: `vid-${Date.now()}`,
    title: (title || req.file.originalname).trim(),
    description: (description || "Physiotherapy clinical demonstration by Dr. Kifayat Khan").trim(),
    videoUrl: relativePath,
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    duration: duration || "Video",
    category: category || "Rehabilitation",
    createdAt: new Date().toISOString().split("T")[0],
    isUploaded: true
  };
  db.videos.unshift(newVideo);
  saveDatabase(db);
  res.status(201).json(newVideo);
});

// Video Update
app.put("/api/videos/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const index = db.videos.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Video not found." });
  }
  db.videos[index] = { ...db.videos[index], ...req.body };
  saveDatabase(db);
  res.json(db.videos[index]);
});

// Video Delete
app.delete("/api/videos/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const video = db.videos.find(v => v.id === id);
  if (!video) {
    return res.status(404).json({ error: "Video not found." });
  }
  // If file was uploaded to local disk, delete it
  if (video.videoUrl && video.videoUrl.startsWith("/uploads/")) {
    const fullPath = path.join(process.cwd(), video.videoUrl);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error("Could not remove video file:", err);
      }
    }
  }
  db.videos = db.videos.filter(v => v.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: "Video deleted successfully" });
});

// Blogs API
app.get("/api/blogs", (req, res) => {
  let list = [...db.blogs];
  const { category, search } = req.query;
  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(b => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q)));
  }
  res.json(list);
});

app.get("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const blog = db.blogs.find(b => b.id === id || b.slug === id);
  if (!blog) {
    return res.status(404).json({ error: "Blog post not found" });
  }
  res.json(blog);
});

// Blog Image Upload
app.post("/api/blogs/upload-image", requireAuth, uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }
  res.json({ imageUrl: `/uploads/blogs/${req.file.filename}` });
});

app.post("/api/blogs", requireAuth, (req, res) => {
  const { title, summary, content, category, coverImage, tags, readTime } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newBlog = {
    id: `blog-${Date.now()}`,
    title: title.trim(),
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    summary: summary ? summary.trim() : title.trim(),
    content: content.trim(),
    category: category || "Physiotherapy",
    author: "Dr. Kifayat Khan",
    authorRole: "Clinical Physiotherapist",
    coverImage: coverImage || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    publishedAt: new Date().toISOString().split("T")[0],
    readTime: readTime || "4 min read",
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t: string) => t.trim()) : ["Physiotherapy", "Health"]),
    featured: Boolean(req.body.featured)
  };
  db.blogs.unshift(newBlog);
  saveDatabase(db);
  res.status(201).json(newBlog);
});

app.put("/api/blogs/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const index = db.blogs.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Blog post not found." });
  }
  db.blogs[index] = { ...db.blogs[index], ...req.body };
  saveDatabase(db);
  res.json(db.blogs[index]);
});

app.delete("/api/blogs/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const blog = db.blogs.find(b => b.id === id);
  if (!blog) {
    return res.status(404).json({ error: "Blog post not found." });
  }
  db.blogs = db.blogs.filter(b => b.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: "Blog post deleted successfully" });
});

// Contact & Appointment Submissions
app.post("/api/contact", (req, res) => {
  const { fullName, email, phone, subject, message, preferredDate, service } = req.body;
  if (!fullName || !phone || !message) {
    return res.status(400).json({ error: "Name, phone number, and message are required." });
  }
  const newMsg = {
    id: `msg-${Date.now()}`,
    fullName: fullName.trim(),
    email: email ? email.trim() : "",
    phone: phone.trim(),
    subject: subject ? subject.trim() : "Appointment Request",
    message: message.trim(),
    preferredDate: preferredDate || "",
    service: service || "General Physiotherapy Consultation",
    createdAt: new Date().toISOString(),
    status: 'new' as const
  };
  db.messages.unshift(newMsg);
  saveDatabase(db);
  res.status(201).json({
    success: true,
    message: "Thank you, Dr. Kifayat Khan has received your consultation inquiry.",
    data: newMsg
  });
});

app.get("/api/appointments", requireAuth, (_req, res) => {
  res.json(db.messages);
});

app.put("/api/appointments/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const msg = db.messages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: "Message not found" });
  }
  if (req.body.status) {
    msg.status = req.body.status;
  }
  saveDatabase(db);
  res.json(msg);
});

app.delete("/api/appointments/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.messages = db.messages.filter(m => m.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: "Message deleted." });
});

// ------------------- VITE SERVER INTEGRATION -------------------
async function startServer() {
  await initializeDatabase();

  const selectedPort = await findAvailablePort(Number(process.env.PORT || 3000));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(selectedPort, "0.0.0.0", () => {
    console.log(`Dr. Kifayat Khan Portfolio Server running on port ${selectedPort}`);
  });
}

startServer().catch(err => {
  console.error("Unable to start server:", err);
  process.exit(1);
});
