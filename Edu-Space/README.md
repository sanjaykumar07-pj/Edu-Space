# 🚀 Edu-Space: Gamified Learning Hub

Edu-Space is a modern, gamified educational platform built to make learning interactive and fun for students, while providing powerful management and analytical tools for teachers and administrators.

Built with a stunning UI and robust backend integration, the platform tracks everything from attendance and quiz scores to project submissions, wrapping it all into an immersive XP-based leveling system.

---

## ✨ Features by Role

### 👨‍🎓 Student Dashboard
- **Gamified Progression**: Earn XP by attending classes, submitting projects, and completing quizzes.
- **Dynamic Leveling System**: Watch your level rank up (from Novice to Grandmaster) with a live progress bar.
- **Activity Heatmap**: A GitHub-style contribution grid that lights up instantly when you are active.
- **Badges & Streaks**: Visualize your continuous engagement and achievements.
- **Upcoming Events**: Stay on top of schedules and live sessions.

### 👩‍🏫 Teacher Dashboard
- **Class Management**: Create and manage multiple classes seamlessly.
- **Project Approvals**: Review and approve student projects, automatically granting them XP.
- **Attendance Logging**: Log student attendance through various methods (Face ID, Bluetooth, Manual).
- **Live Quizzes & Leaderboards**: Host live quizzes and view how students are performing.
- **Student Analytics**: Track engagement and academic progress of individual students.

### 👑 Admin Dashboard
- **Live Platform Metrics**: Get a real-time overview of total registered students, teachers, and active classes.
- **Global Attendance**: View the true platform-wide attendance percentage based on live backend data.
- **Engagement Graph**: A beautifully animated `Recharts` area chart that tracks daily student activity and logins dynamically.
- **Platform XP Tracker**: See the grand total of XP awarded across the entire school/platform this semester.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (React), App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Google Material Symbols
- **Charts**: [Recharts](https://recharts.org/)
- **Backend & Database**: [Zoho Catalyst](https://catalyst.zoho.com/) (ZCQL Serverless Database)
- **Deployment**: Zoho AppSail (Node.js 22 Runtime)

---

## 🚀 Getting Started Locally

First, ensure you have Node.js 18+ installed on your machine.

1. Clone the repository and navigate into the `Edu-Space` directory:
   ```bash
   cd Edu-Space
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📦 Deployment Instructions (Zoho AppSail)

Edu-Space is fully configured for deployment on Zoho Catalyst's AppSail using Next.js. 

When deploying from GitHub to AppSail, ensure you use the following settings:
- **Framework**: `Next.js` (or `Node.js` 22+)
- **Root Path**: `./Edu-Space` *(Crucial: This points the deployment engine to the correct subfolder containing package.json)*
- **Build Path**: `.next`
- **Install Command**: `npm install`
- **Build Command**: `npm run build`

*Note: Do not deploy as a "Static" app, as Edu-Space utilizes secure server-side `/api/` routes to communicate with the Zoho Catalyst database!*
