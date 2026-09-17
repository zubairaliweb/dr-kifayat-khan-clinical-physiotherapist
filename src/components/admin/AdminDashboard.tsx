import React, { useState, useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  Inbox, 
  Settings, 
  LogOut, 
  Plus, 
  UploadCloud, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Film,
  Phone,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VideoItem, BlogPost, ContactMessage, ClinicProfile } from '../../types';

interface AdminDashboardProps {
  onRefreshData: () => void;
  profile: ClinicProfile;
  onUpdateProfile: (newProfile: ClinicProfile) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onRefreshData,
  profile,
  onUpdateProfile
}) => {
  const { token, logout, isAdminOpen, setIsAdminOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'blogs' | 'messages' | 'profile'>('overview');

  // Data lists
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Video Form state
  const [videoMode, setVideoMode] = useState<'list' | 'add_url' | 'upload_file' | 'edit'>('list');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCategory, setVideoCategory] = useState('Rehabilitation');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // Blog Form state
  const [blogMode, setBlogMode] = useState<'list' | 'create' | 'edit'>('list');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Sports Medicine');
  const [blogCoverImage, setBlogCoverImage] = useState('');
  const [blogTags, setBlogTags] = useState('Physiotherapy, Health');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);

  // Profile Form state
  const [editProfile, setEditProfile] = useState<ClinicProfile>(profile);

  // In-app deletion dialog state (replaces window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'video' | 'blog' | 'message';
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setEditProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (isAdminOpen && token) {
      loadAllAdminData();
    }
  }, [isAdminOpen, token]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [vRes, bRes, mRes] = await Promise.all([
        fetch('/api/videos'),
        fetch('/api/blogs'),
        fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (vRes.ok) setVideos(await vRes.json());
      if (bRes.ok) setBlogs(await bRes.json());
      if (mRes.ok) setMessages(await mRes.json());
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotice = (type: 'success' | 'error', text: string) => {
    setActionNotice({ type, text });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // ---------------- VIDEO ACTIONS ----------------
  const handleAddVideoUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl) {
      showNotice('error', 'Video title and URL are required.');
      return;
    }

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: videoTitle,
          description: videoDesc,
          videoUrl: videoUrl,
          category: videoCategory,
          thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop'
        })
      });

      if (res.ok) {
        showNotice('success', 'Video added to gallery successfully!');
        resetVideoForm();
        loadAllAdminData();
        onRefreshData();
      } else {
        showNotice('error', 'Failed to save video.');
      }
    } catch {
      showNotice('error', 'Network error adding video.');
    }
  };

  const handleUploadVideoFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      showNotice('error', 'Please select an MP4 or WebM video file from your computer.');
      return;
    }

    setUploadProgress(true);
    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('title', videoTitle || videoFile.name);
    formData.append('description', videoDesc);
    formData.append('category', videoCategory);

    try {
      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        showNotice('success', 'Video file uploaded and stored on server successfully!');
        resetVideoForm();
        loadAllAdminData();
        onRefreshData();
      } else {
        showNotice('error', 'Failed to upload video file.');
      }
    } catch {
      showNotice('error', 'Error uploading video to server.');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleEditVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideoId) return;

    try {
      const res = await fetch(`/api/videos/${editingVideoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: videoTitle,
          description: videoDesc,
          category: videoCategory
        })
      });

      if (res.ok) {
        showNotice('success', 'Video information updated.');
        resetVideoForm();
        loadAllAdminData();
        onRefreshData();
      } else {
        showNotice('error', 'Failed to update video.');
      }
    } catch {
      showNotice('error', 'Error updating video.');
    }
  };

  const requestDeleteVideo = (id: string, title?: string) => {
    const v = videos.find(item => item.id === id);
    setDeleteTarget({
      type: 'video',
      id,
      title: title || v?.title || 'Video'
    });
  };

  const requestDeleteBlog = (id: string, title?: string) => {
    const b = blogs.find(item => item.id === id);
    setDeleteTarget({
      type: 'blog',
      id,
      title: title || b?.title || 'Blog Post'
    });
  };

  const requestDeleteMessage = (id: string, name?: string) => {
    const m = messages.find(item => item.id === id);
    setDeleteTarget({
      type: 'message',
      id,
      title: name ? `Inquiry from ${name}` : (m ? `Inquiry from ${m.fullName}` : 'Inquiry')
    });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setDeleteTarget(null);

    if (type === 'video') {
      try {
        const res = await fetch(`/api/videos/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          showNotice('success', 'Video deleted from database and file storage.');
          loadAllAdminData();
          onRefreshData();
        } else {
          showNotice('error', 'Could not delete video.');
        }
      } catch {
        showNotice('error', 'Error deleting video.');
      }
    } else if (type === 'blog') {
      try {
        const res = await fetch(`/api/blogs/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          showNotice('success', 'Blog post deleted.');
          loadAllAdminData();
          onRefreshData();
        } else {
          showNotice('error', 'Could not delete blog post.');
        }
      } catch {
        showNotice('error', 'Network error deleting blog.');
      }
    } else if (type === 'message') {
      try {
        const res = await fetch(`/api/appointments/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setMessages(prev => prev.filter(m => m.id !== id));
          showNotice('success', 'Inquiry removed.');
          loadAllAdminData();
        } else {
          showNotice('error', 'Could not delete inquiry.');
        }
      } catch {
        showNotice('error', 'Error deleting message.');
      }
    }
  };

  const handleDeleteVideo = async (id: string) => {
    requestDeleteVideo(id);
  };

  const startEditVideo = (v: VideoItem) => {
    setEditingVideoId(v.id);
    setVideoTitle(v.title);
    setVideoDesc(v.description);
    setVideoCategory(v.category);
    setVideoMode('edit');
  };

  const resetVideoForm = () => {
    setVideoTitle('');
    setVideoDesc('');
    setVideoUrl('');
    setVideoFile(null);
    setEditingVideoId(null);
    setVideoMode('list');
  };

  // ---------------- BLOG ACTIONS ----------------
  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBlogImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/blogs/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setBlogCoverImage(data.imageUrl);
        showNotice('success', 'Blog cover image uploaded successfully!');
      } else {
        showNotice('error', 'Failed to upload cover image.');
      }
    } catch {
      showNotice('error', 'Network error uploading cover image.');
    } finally {
      setUploadingBlogImage(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      showNotice('error', 'Blog title and content are required.');
      return;
    }

    const payload = {
      title: blogTitle,
      summary: blogSummary || blogTitle,
      content: blogContent,
      category: blogCategory,
      coverImage: blogCoverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
      tags: blogTags.split(',').map(t => t.trim()),
      readTime: blogReadTime || '5 min read'
    };

    try {
      const url = editingBlogId ? `/api/blogs/${editingBlogId}` : '/api/blogs';
      const method = editingBlogId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotice('success', editingBlogId ? 'Article updated successfully!' : 'New article published!');
        resetBlogForm();
        loadAllAdminData();
        onRefreshData();
      } else {
        showNotice('error', 'Failed to save blog post.');
      }
    } catch {
      showNotice('error', 'Network error saving article.');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    requestDeleteBlog(id);
  };

  const startEditBlog = (b: BlogPost) => {
    setEditingBlogId(b.id);
    setBlogTitle(b.title);
    setBlogSummary(b.summary);
    setBlogContent(b.content);
    setBlogCategory(b.category);
    setBlogCoverImage(b.coverImage);
    setBlogTags(b.tags.join(', '));
    setBlogReadTime(b.readTime);
    setBlogMode('edit');
  };

  const resetBlogForm = () => {
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
    setBlogCategory('Sports Medicine');
    setBlogCoverImage('');
    setBlogTags('Physiotherapy, Health');
    setBlogReadTime('5 min read');
    setEditingBlogId(null);
    setBlogMode('list');
  };

  // ---------------- MESSAGE ACTIONS ----------------
  const handleUpdateMessageStatus = async (id: string, status: 'reviewed' | 'contacted') => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        showNotice('success', `Inquiry status updated to ${status}`);
        loadAllAdminData();
      }
    } catch {
      showNotice('error', 'Failed to update message.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    requestDeleteMessage(id);
  };

  // ---------------- PROFILE ACTIONS ----------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editProfile)
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdateProfile(updated);
        showNotice('success', 'Clinic profile and contact information updated successfully!');
      } else {
        showNotice('error', 'Failed to update profile.');
      }
    } catch {
      showNotice('error', 'Network error saving profile.');
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl max-w-6xl w-full h-[95vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top bar */}
        <div className="p-3 sm:p-4 sm:px-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">Dr. Kifayat Khan Admin</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/80 text-cyan-300 border border-blue-700">
                  Doctor's Dashboard
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">Mall of Islamabad Clinic Content Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={loadAllAdminData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs flex items-center gap-1 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={logout}
              title="Logout"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notice banner */}
        {actionNotice && (
          <div className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
            actionNotice.type === 'success' 
              ? 'bg-emerald-950 border-b border-emerald-800 text-emerald-300' 
              : 'bg-rose-950 border-b border-rose-800 text-rose-300'
          }`}>
            {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{actionNotice.text}</span>
          </div>
        )}

        {/* Dashboard Shell with Sidebar and Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Tabs Sidebar */}
          <div className="w-full md:w-60 bg-slate-50/70 dark:bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`shrink-0 md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 hover:dark:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 hover:dark:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4" />
                <span>Videos</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-cyan-400">
                {videos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left whitespace-nowrap ${
                activeTab === 'blogs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 hover:dark:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Blog Articles</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-cyan-400">
                {blogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 hover:dark:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>Inquiries & Visits</span>
              </div>
              {messages.filter(m => m.status === 'new').length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold">
                  {messages.filter(m => m.status === 'new').length} New
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`shrink-0 md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 hover:dark:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Clinic Profile</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-100/60 dark:bg-slate-900/60">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Patient Inquiries</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{messages.length}</div>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      {messages.filter(m => m.status === 'new').length} pending review
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Uploaded Videos</span>
                    <div className="text-2xl font-extrabold text-cyan-400">{videos.length}</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Rehabilitation guides</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Published Blogs</span>
                    <div className="text-2xl font-extrabold text-sky-400">{blogs.length}</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Articles live on portal</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Clinical Services</span>
                    <div className="text-2xl font-extrabold text-indigo-400">11</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Mall of Islamabad</span>
                  </div>
                </div>

                {/* Recent Patient Inquiries Preview */}
                <div className="rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300/80 dark:border-slate-700/80 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-cyan-400" />
                      <span>Recent Consultation Inquiries</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      View All ({messages.length})
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">No patient messages received yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {messages.slice(0, 3).map((msg) => (
                        <div key={msg.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">{msg.fullName}</span>
                              <span className="text-slate-500 dark:text-slate-400">• {msg.phone}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                msg.status === 'new' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}>
                                {msg.status}
                              </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{msg.message}</p>
                          </div>
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] shrink-0 ml-2"
                          >
                            WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Quick Video Management
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload clinical exercises or guidance clips directly to server disk storage.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('videos');
                        setVideoMode('upload_file');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Video File (.mp4)</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Quick Article Publisher
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Write evidence-based blogs on sports recovery, ergonomics, and spinal care.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('blogs');
                        setBlogMode('create');
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write New Blog Post</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* VIDEOS TAB */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                
                {/* Videos Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Video Gallery & Upload Management</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage Dr. Kifayat Khan's rehabilitation demonstration library.</p>
                  </div>

                  {videoMode === 'list' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setVideoMode('upload_file')}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload Video File</span>
                      </button>
                      <button
                        onClick={() => setVideoMode('add_url')}
                        className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Video Link</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={resetVideoForm}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Back to Video List
                    </button>
                  )}
                </div>

                {/* Upload Video File Form */}
                {videoMode === 'upload_file' && (
                  <form onSubmit={handleUploadVideoFile} className="p-6 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 max-w-2xl">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-cyan-400" />
                      <span>Upload Video File to Server Storage</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Select Video File (.mp4, .webm, .mov) <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        required
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-700 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Video Title <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. Shoulder Impingement & Rotator Cuff Mobility"
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={videoCategory}
                          onChange={(e) => setVideoCategory(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="Spine Health">Spine Health</option>
                          <option value="Sports Rehab">Sports Rehab</option>
                          <option value="Ergonomics">Ergonomics</option>
                          <option value="Clinical Care">Clinical Care</option>
                          <option value="Rehabilitation">Rehabilitation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Clinical Description / Patient Instructions
                      </label>
                      <textarea
                        rows={3}
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        placeholder="Explain the exercise, sets, reps, and target muscle groups..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white resize-y"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={uploadProgress}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                      >
                        {uploadProgress ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Uploading video file to server...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>Start Upload</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetVideoForm}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Add Video URL Form */}
                {videoMode === 'add_url' && (
                  <form onSubmit={handleAddVideoUrl} className="p-6 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 max-w-2xl">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add Video via URL (YouTube, Vimeo, Cloud Storage)</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Video Stream URL <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://commondatastorage.googleapis.com/... or https://youtube.com/..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Video Title <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. Acute Lumbar Herniation Decompression"
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Spine Health">Spine Health</option>
                        <option value="Sports Rehab">Sports Rehab</option>
                        <option value="Ergonomics">Ergonomics</option>
                        <option value="Clinical Care">Clinical Care</option>
                        <option value="Rehabilitation">Rehabilitation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        placeholder="Describe key clinical points..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Video to Gallery</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetVideoForm}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Edit Video Form */}
                {videoMode === 'edit' && (
                  <form onSubmit={handleEditVideo} className="p-6 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 max-w-2xl">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-cyan-400" />
                      <span>Edit Video Details</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Video Title <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Spine Health">Spine Health</option>
                        <option value="Sports Rehab">Sports Rehab</option>
                        <option value="Ergonomics">Ergonomics</option>
                        <option value="Clinical Care">Clinical Care</option>
                        <option value="Rehabilitation">Rehabilitation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Update Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetVideoForm}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Video Table List */}
                {videoMode === 'list' && (
                  <div className="space-y-3">
                    {videos.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40 text-center text-slate-500 dark:text-slate-400 text-xs">
                        No videos available. Click "Upload Video File" or "Add Video Link" above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videos.map((v) => (
                          <div key={v.id} className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex flex-col justify-between space-y-3">
                            <div className="flex gap-3">
                              <div className="w-20 h-14 rounded-lg bg-slate-50 dark:bg-slate-950 overflow-hidden relative shrink-0">
                                <img
                                  src={v.thumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop'}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-50/40 dark:bg-slate-950/40 flex items-center justify-center">
                                  <Film className="w-4 h-4 text-cyan-400" />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-cyan-300">
                                    {v.category}
                                  </span>
                                  {v.isUploaded && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                      File
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">{v.title}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{v.description}</p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-300/60 dark:border-slate-700/60 flex items-center justify-between">
                              <span className="text-[10px] text-slate-600 dark:text-slate-500 font-mono truncate max-w-[160px]">
                                {v.videoUrl}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEditVideo(v)}
                                  className="p-1.5 rounded-lg bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 hover:dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                  title="Edit Video Info"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(v.id)}
                                  className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300"
                                  title="Delete Video from DB and Storage"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                
                {/* Blog Header & Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Articles & Blog Publishing</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Write, edit, and publish clinical articles for patients.</p>
                  </div>

                  {blogMode === 'list' ? (
                    <button
                      onClick={() => setBlogMode('create')}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write New Article</span>
                    </button>
                  ) : (
                    <button
                      onClick={resetBlogForm}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Back to Article List
                    </button>
                  )}
                </div>

                {/* Create or Edit Blog Form */}
                {(blogMode === 'create' || blogMode === 'edit') && (
                  <form onSubmit={handleSaveBlog} className="p-6 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 max-w-3xl">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>{blogMode === 'edit' ? 'Edit Article' : 'Compose New Article'}</span>
                    </h4>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Article Title <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder="e.g. Modern Management of Sports Knee Trauma"
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Category & Read Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="Sports Medicine">Sports Medicine</option>
                          <option value="Spine Health">Spine Health</option>
                          <option value="Ergonomics">Ergonomics</option>
                          <option value="Physiotherapy">Physiotherapy</option>
                          <option value="Rehabilitation">Rehabilitation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Estimated Read Time
                        </label>
                        <input
                          type="text"
                          value={blogReadTime}
                          onChange={(e) => setBlogReadTime(e.target.value)}
                          placeholder="e.g. 5 min read"
                          className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Cover Image URL & File Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Cover Image (URL or Upload from Computer)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                          type="text"
                          value={blogCoverImage}
                          onChange={(e) => setBlogCoverImage(e.target.value)}
                          placeholder="Image URL or upload below..."
                          className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white flex-1"
                        />
                        <label className="px-4 py-2 rounded-xl bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 hover:dark:bg-slate-600 text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4" />
                          <span>{uploadingBlogImage ? "Uploading..." : "Upload Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBlogImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Brief Executive Summary
                      </label>
                      <textarea
                        rows={2}
                        value={blogSummary}
                        onChange={(e) => setBlogSummary(e.target.value)}
                        placeholder="2-3 sentence overview that appears on the card..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Content (Markdown / Formatted text) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Article Content (Markdown format: ## Headings, 1. Lists, etc.) <span className="text-cyan-400">*</span>
                      </label>
                      <textarea
                        rows={10}
                        required
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        placeholder="## Introduction&#10;&#10;Write detailed evidence-based clinical explanations here..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono leading-relaxed"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={blogTags}
                        onChange={(e) => setBlogTags(e.target.value)}
                        placeholder="Sports, ACL, Spine, Islamabad, Recovery"
                        className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{blogMode === 'edit' ? 'Update Article' : 'Publish Article'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetBlogForm}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Blog Posts List */}
                {blogMode === 'list' && (
                  <div className="space-y-3">
                    {blogs.map((b) => (
                      <div key={b.id} className="p-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={b.coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop'}
                            alt=""
                            className="w-16 h-12 rounded-lg object-cover shrink-0 bg-slate-50 dark:bg-slate-950"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                                {b.category}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">{b.publishedAt}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{b.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{b.summary}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => startEditBlog(b)}
                            className="p-1.5 rounded-lg bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 hover:dark:bg-slate-600 text-slate-800 dark:text-slate-200"
                            title="Edit Blog"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(b.id)}
                            className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Patient Consultation Inquiries</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Review appointment requests submitted through the public website.</p>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold">
                    {messages.length} Total Submissions
                  </span>
                </div>

                {messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs bg-slate-200/40 dark:bg-slate-800/40 rounded-2xl">
                    No consultation inquiries yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className="p-5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-600/50 flex items-center justify-center text-cyan-300 font-bold text-xs">
                              {m.fullName.charAt(0)}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{m.fullName}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">Phone: <strong className="text-slate-900 dark:text-white">{m.phone}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              m.status === 'new' 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                                : m.status === 'contacted'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                            }`}>
                              Status: {m.status}
                            </span>
                            <span className="text-[11px] text-slate-600 dark:text-slate-500">
                              {new Date(m.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-medium">
                            <span>Service: <strong className="text-cyan-300">{m.service || m.subject}</strong></span>
                            {m.preferredDate && <span>Preferred Date: <strong className="text-slate-900 dark:text-white">{m.preferredDate}</strong></span>}
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed italic">
                            "{m.message}"
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(m.fullName)},%20this%20is%20Dr.%20Kifayat%20Khan's%20clinic%20regarding%20your%20consultation%20inquiry.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                            >
                              <span>Reply on WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${m.phone}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 hover:dark:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call {m.phone}</span>
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            {m.status !== 'contacted' && (
                              <button
                                onClick={() => handleUpdateMessageStatus(m.id, 'contacted')}
                                className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold border border-blue-700"
                              >
                                Mark Contacted
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* CLINIC PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-3xl">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Clinic Profile & Contact Settings</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update Dr. Kifayat Khan's clinic address, hours, phone, and professional statement.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editProfile.fullName}
                      onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={editProfile.title}
                      onChange={(e) => setEditProfile({ ...editProfile, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editProfile.phone}
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={editProfile.whatsapp}
                      onChange={(e) => setEditProfile({ ...editProfile, whatsapp: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Statement</label>
                  <input
                    type="text"
                    value={editProfile.statement}
                    onChange={(e) => setEditProfile({ ...editProfile, statement: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Timings</label>
                  <input
                    type="text"
                    value={editProfile.timings}
                    onChange={(e) => setEditProfile({ ...editProfile, timings: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">About Biography</label>
                  <textarea
                    rows={4}
                    value={editProfile.aboutBio}
                    onChange={(e) => setEditProfile({ ...editProfile, aboutBio: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Professional Social Media Profiles & Links
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={editProfile.socialLinks?.linkedin || ''}
                        onChange={(e) => setEditProfile({ 
                          ...editProfile, 
                          socialLinks: { ...editProfile.socialLinks, linkedin: e.target.value } 
                        })}
                        placeholder="https://www.linkedin.com/in/..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Facebook Page URL</label>
                      <input
                        type="url"
                        value={editProfile.socialLinks?.facebook || ''}
                        onChange={(e) => setEditProfile({ 
                          ...editProfile, 
                          socialLinks: { ...editProfile.socialLinks, facebook: e.target.value } 
                        })}
                        placeholder="https://www.facebook.com/..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">TikTok Profile URL</label>
                      <input
                        type="url"
                        value={editProfile.socialLinks?.tiktok || ''}
                        onChange={(e) => setEditProfile({ 
                          ...editProfile, 
                          socialLinks: { ...editProfile.socialLinks, tiktok: e.target.value } 
                        })}
                        placeholder="https://www.tiktok.com/@..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Chat URL</label>
                      <input
                        type="url"
                        value={editProfile.socialLinks?.whatsapp || ''}
                        onChange={(e) => setEditProfile({ 
                          ...editProfile, 
                          socialLinks: { ...editProfile.socialLinks, whatsapp: e.target.value } 
                        })}
                        placeholder="https://wa.me/..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Clinic Settings</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* Safe In-App Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Confirm Deletion</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              Are you sure you want to permanently delete:
              <div className="mt-1 font-semibold text-slate-900 dark:text-white truncate">"{deleteTarget.title}"</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-900/40 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
