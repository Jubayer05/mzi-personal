# MZI Personal Website

A full-stack personal website built with Next.js (App Router) featuring an admin dashboard to manage profile, publications, research work, resources (courses/chapters), and media uploads. Includes user authentication with email verification and password reset flows.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: Tailwind CSS, Ant Design (provider)
- **DB**: MongoDB (Mongoose)
- **Email**: Nodemailer (SMTP)
- **Auth**: Custom email/password with verification tokens
- **Deployment**: Vercel-friendly

## Features

- **Public**

  - Home, Profile, Publications, Research, Resources, Contact
  - Resource browsing by semester → course → chapter

- **Auth**

  - Register, Login
  - Email verification (`/verify-email?token=...`)
  - Forgot & Reset password (`/reset-password?token=...`)

- **Dashboard**
  - Manage publications, research work, resources
  - Upload PDFs/images
  - Profile and social links settings

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (Atlas or local)
- SMTP credentials (e.g., Gmail SMTP or any provider)
- PNPM/Yarn/NPM

### Environment Variables

Create `.env.local` in the project root:

```bash
# Database
MONGODB_URI="your-mongodb-connection-string"

# App URL (used in email links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SMTP (email delivery)
SMTP_HOST="smtp.gmail.com"           # or your SMTP host
SMTP_PORT="587"                      # 465 for SSL, 587 for TLS
SMTP_SECURE="false"                  # "true" if using 465
SMTP_USER="your@email.com"
SMTP_PASS="your-smtp-password-or-app-password"
SMTP_FROM="Your Name <no-reply@yourdomain.com>"
```

### Install & Run

```bash
# install deps
pnpm install
# or: npm install / yarn

# dev
pnpm dev
# open http://localhost:3000

# production build
pnpm build
pnpm start
```

If you see stale route/type errors after moving files, clear caches:

```bash
# from project root
rm -rf .next .turbo
pnpm dev
```

## Project Structure
