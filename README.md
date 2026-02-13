📌 Smart Bookmark App

A modern bookmark management web application built with Next.js (App Router) and Supabase, featuring Google OAuth authentication, Row Level Security (RLS), and real-time updates.

Users can securely save, view, and delete their personal bookmarks with instant UI updates.

🚀 Features

🔐 Google Authentication (OAuth)

🧑‍💻 User-specific bookmarks using Supabase RLS

⚡ Real-time updates (no refresh required)

➕ Add bookmarks (title + URL)

🗑️ Delete bookmarks instantly

🧱 Protected dashboard routes

📱 Responsive UI with Tailwind CSS

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 16 (App Router), React, TypeScript
Backend	Supabase (PostgreSQL, Auth, Realtime)
Auth	Google OAuth
Styling	Tailwind CSS
Deployment	Vercel

📂 Project Structure
smart-bookmark-app/
├── app/
│   ├── page.tsx              # Login page
│   ├── dashboard/
│   │   └── page.tsx          # Protected dashboard
├── components/
│   └── BookmarkList.tsx      # Bookmark list + realtime updates
├── lib/
│   └── supabaseClient.ts     # Supabase client setup
├── public/
├── .env.local
├── README.md
└── package.json

🔐 Authentication Flow

User signs in using Google

Supabase creates an authenticated session

User is redirected to /dashboard

All bookmarks are:

Owned by the logged-in user

Protected using Row Level Security (RLS)

🗄️ Database Schema
bookmarks table
id          uuid (primary key)
title       text
url         text
user_id     uuid (auth.users.id)
created_at  timestamp

Row Level Security (RLS)
-- Read own bookmarks
CREATE POLICY "Users can read own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- Insert own bookmarks
CREATE POLICY "Users can insert own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Delete own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON bookmarks FOR DELETE
USING (auth.uid() = user_id);

⚙️ Environment Variables

Create a .env.local file in the root:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

⚠️ Never commit .env.local to GitHub

▶️ Getting Started (Local Setup)
# Install dependencies
npm install

# Run development server
npm run dev

Open 👉 http://localhost:3000

☁️ Deployment (Vercel)

Push code to GitHub

Import repo into Vercel

Add environment variables in Vercel settings

👨‍💻 Author

Venkata Chaithanya Reddy Vangala

GitHub: https://github.com/CheyReddy

LinkedIn: https://www.linkedin.com/in/chaithanya-reddy/

<img width="1918" height="1092" alt="login_page" src="https://github.com/user-attachments/assets/f3577070-ca12-4bf0-b5eb-ea181b923882" />

<img width="1916" height="1081" alt="dashboard" src="https://github.com/user-attachments/assets/a5da1ec2-4470-4e63-a922-3f875337b504" />
