# Dr. Kifayat Khan — Clinical Physiotherapist Portfolio & Clinic Portal

A full-stack portfolio and content-management site for Dr. Kifayat Khan's physiotherapy
clinic in Islamabad, Pakistan. Built with React, TypeScript, Tailwind CSS, and an
Express API backend with a lightweight JSON file database.

## Features

- Public site: Hero, About, Education, Services, Skills, Videos, Blog, and Contact
  sections, with a light/dark theme toggle
- Appointment booking form that saves consultation requests to the backend
- Admin dashboard (password-protected) for managing videos, blog posts, patient
  inquiries, and clinic profile details
- Responsive layout for desktop, tablet, and mobile, including the admin dashboard

## Prerequisites

- Node.js 18+

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the example environment file and set your own admin password:
   ```
   cp .env.example .env
   ```
   Then edit `.env` and set `ADMIN_PASSWORD` to a strong password of your choice.
3. Run the app in development mode:
   ```
   npm run dev
   ```
   The site will be available at http://localhost:3000

## Production Build

```
npm run build
npm start
```

## Deployment

This project is ready for standard Node hosting environments such as Render, Railway, Heroku, or a VPS. It also includes a Vercel serverless API entrypoint in `api/index.ts`.

Required environment variables:

- `PORT` — the port your hosting platform assigns
- `ADMIN_PASSWORD` — admin login password for the dashboard
- `ADMIN_TOKEN` — server-side auth token used by the API
- `MONGODB_URI` — optional MongoDB connection string
- `MONGODB_DB_NAME` — optional database name, defaults to `physiotherapy_portal`

Example:

```bash
PORT=3000
ADMIN_PASSWORD=your_secure_password
ADMIN_TOKEN=your_secure_token
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/physiotherapy_portal?retryWrites=true&w=majority
MONGODB_DB_NAME=physiotherapy_portal
```

If MongoDB is not reachable, the app gracefully falls back to the local JSON database in the `data/` folder.

### Suggested deployment commands

```bash
npm install
npm run build
npm start
```

### Vercel deployment

Import the repository into Vercel and set these environment variables in the Vercel project settings for **Production**, **Preview**, and **Development**:

- `ADMIN_PASSWORD` — the password used in the admin login form
- `ADMIN_TOKEN` — a long random token, different from the password
- `MONGODB_URI` and `MONGODB_DB_NAME` — recommended for persistent content storage

Redeploy after adding or changing environment variables. The local `.env` file is not uploaded to Vercel.

## Project Structure

- `src/components` — public site sections and modals
- `src/components/admin` — admin dashboard and login modal
- `src/context` — React context providers (auth, theme)
- `src/data` — default/fallback content used before the API responds
- `server.ts` — Express API and static file server
- `data/database.json` — local JSON database (created automatically on first run)

## Admin Access

Open the site, click the lock icon in the navbar (or footer), and log in with the
password set in `ADMIN_PASSWORD`. From the dashboard you can manage videos, blog
posts, patient inquiries, and the public clinic profile.
