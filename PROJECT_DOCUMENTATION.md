# NewsWalla - Social Media Scheduler
## Complete Project Documentation

**Developed by:** Bergman Coding AB, Sweden
**Live URL:** https://jktv.live/newswalla
**Server:** 94.72.110.114
**Technology Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Express 5 + SQLite

---

## 1. Architecture Overview

### Monorepo Structure
```
newswalla/
├── packages/shared/        # Shared types and utilities
├── apps/
│   ├── api/               # Express 5 backend (TypeScript)
│   │   ├── src/
│   │   │   ├── config/    # Database, environment config
│   │   │   ├── db/
│   │   │   │   └── migrations/   # SQL migration files
│   │   │   ├── middleware/        # Auth, admin middleware
│   │   │   ├── routes/           # API route handlers
│   │   │   ├── services/         # Business logic
│   │   │   └── utils/            # JWT, helpers
│   │   └── data/                 # SQLite database files
│   └── web/               # React 19 frontend (Vite + Tailwind)
│       └── src/
│           ├── api/       # Axios client
│           ├── components/ # Reusable components (Sidebar, ChatBot)
│           ├── i18n/      # Translations (10 languages) + Themes
│           ├── pages/     # All page components
│           └── stores/    # Zustand state management
```

### Technology Details
- **Frontend:** React 19, Vite 6, Tailwind CSS 3, Zustand, React Router 6, Lucide Icons, react-hot-toast
- **Backend:** Express 5, TypeScript, Zod validation, JWT auth, bcryptjs
- **Database:** SQLite (better-sqlite3) with WAL mode
- **Process Manager:** PM2 with npx tsx
- **Web Server:** Nginx reverse proxy with snippet include
- **Deployment Path:** /opt/newswalla/

---

## 2. Features

### 2.1 User Authentication
- JWT-based authentication (7-day token expiry)
- Registration with auto-admin (first user becomes admin)
- Login/Register pages
- Password hashing with bcryptjs
- Profile management (name, email, timezone, language, theme)

### 2.2 Multi-Platform Social Media Management
Supported platforms:
- Facebook Pages (multiple)
- Facebook Groups (multiple)
- Facebook Personal Profiles (multiple)
- Instagram (multiple accounts)
- YouTube Channels (multiple)
- LinkedIn (multiple accounts)
- TikTok (multiple accounts)
- Pinterest (multiple accounts)

### 2.3 Post Scheduling
- Compose posts with rich text
- Select multiple platforms for cross-posting
- Schedule for future date/time
- Publish immediately option
- Video upload with auto-delete after posting
- Post status tracking (draft, scheduled, published, pending_approval)

### 2.4 AI Content Generation
- OpenAI (GPT) integration for caption generation
- Anthropic (Claude) integration for content ideas
- Smart hashtag suggestions
- Platform-optimized content rewriting
- API keys configurable in Admin > Settings

### 2.5 Editor/Admin Approval Workflow
- Two-level team system: Admin and Editor roles
- Editors create posts -> status becomes "pending_approval"
- Admins receive notifications and can approve or reject
- Rejection includes comment/feedback to editor
- Full audit trail (who submitted, who approved, when)
- Real-time notification system with unread count

### 2.6 Content Calendar
- Visual calendar view (day/week/month)
- Drag-and-drop rescheduling
- Color-coded by platform
- Quick post creation from calendar

### 2.7 Unified Inbox
- Centralized comment/message management
- Reply from one dashboard
- Platform-specific formatting

### 2.8 Analytics Dashboard
- Engagement tracking
- Reach and impressions
- Growth metrics
- Per-platform breakdown
- Engagement rate calculation

### 2.9 Team Management
- Add/remove team members
- Role assignment (Admin/Editor)
- Active/inactive toggle
- Password reset by admin

### 2.10 Multi-Language Support (10 Languages)
- English, Urdu (Nastaliq font), Hindi, Punjabi, Swedish
- Pahari, Gujarati, Kashmiri, Persian, Arabic
- Full RTL support for Arabic script languages
- Google Fonts Noto Nastaliq Urdu for Urdu
- Admin-editable language list (add/remove/enable/disable)

### 2.11 Custom Themes (8 Themes)
- Blue (default), Indigo, Purple, Rose, Emerald, Amber, Slate, Teal
- CSS variable-based system
- Per-user theme selection
- Global theme setting by admin

### 2.12 Subscription System
- Free Plan: $0/month (5 posts, 2 accounts, single user)
- Pro Plan: $5/month (unlimited everything, AI, 1 user)
- Team Plan: $10/month (5 team members, approval workflows)
- Stripe integration (publishable key, secret key, price IDs)
- Admin-configurable limits (max users, post limits, pricing)
- Registration open/close toggle

### 2.13 Contact Support
- Public contact form (name, email, subject, message)
- Subject categories: General, Account, Platform, Scheduling, Billing, Bug, Feature
- Admin view for all incoming support messages
- Submission confirmation page

### 2.14 FAQ Chatbot
- Floating chatbot widget on all pages
- Knowledge base indexed from FAQ and tutorials
- Keyword-matching AI for instant answers
- Covers: platforms, pricing, features, scheduling, setup, approval workflow
- Fallback suggestion to contact support

### 2.15 Landing Page
- Hero section with platform badges
- Stats bar (6+ platforms, 10 languages, 8 themes, $5 Pro)
- 12 feature cards
- 8 platform cards with color bars
- 3-step how-it-works section
- 16-row competitor comparison table (vs Buffer, Hootsuite, Later)
- 3-tier pricing section (Free/Pro/Team)
- AI content generation showcase
- Editor/Admin approval workflow feature section
- 4 testimonials
- 7 FAQ items with accordion
- 8 tutorial screenshots section
- Trust badges (SSL, GDPR, Languages, AI)
- CTA section
- Footer with links + "Developed by Bergman Coding AB, Sweden"

---

## 3. Admin Panel

Access: Login as admin, sidebar shows ADMIN section.

### Admin Pages:
1. **Approvals** (/admin/approvals) - Approve/reject editor posts, pending/all tabs
2. **User Management** (/admin/users) - Add, edit, delete users, reset passwords, assign roles
3. **Color Theme** (/admin/theme) - Set global theme from 8 options
4. **Languages** (/admin/languages) - Add, edit, enable/disable languages, change direction/font
5. **Subscription** (/admin/subscription) - Plan overview, Stripe config, subscription settings (max users, limits, pricing, registration toggle)
6. **Support Messages** (/admin/messages) - View all contact form submissions

---

## 4. API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user
- PUT /api/auth/me - Update profile

### Posts
- GET /api/posts - List user posts
- POST /api/posts - Create post (editors: auto pending_approval)
- PUT /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post

### Calendar
- GET /api/calendar - Get scheduled posts for date range

### Accounts
- GET /api/accounts - List connected accounts
- POST /api/accounts - Add account
- PUT /api/accounts/:id - Toggle account
- DELETE /api/accounts/:id - Remove account

### Analytics
- GET /api/analytics - Get analytics data

### Inbox
- GET /api/inbox - Get messages/comments

### AI
- POST /api/ai/generate - Generate AI content

### Teams
- GET /api/teams - List team members

### Media
- POST /api/media/upload - Upload media files

### Settings (Admin only)
- GET /api/settings/api-keys - Get masked API keys
- PUT /api/settings/api-keys - Update API keys

### Approvals
- GET /api/approvals - All approvals
- GET /api/approvals/pending - Pending approvals (admin)
- POST /api/approvals/:id/approve - Approve post
- POST /api/approvals/:id/reject - Reject post
- GET /api/approvals/notifications - Get notifications
- POST /api/approvals/notifications/read-all - Mark all read
- POST /api/approvals/notifications/:id/read - Mark one read

### Admin
- GET/POST/PUT/DELETE /api/admin/users - User CRUD
- PUT /api/admin/users/:id/reset-password - Reset password
- GET/PUT /api/admin/theme - Theme settings
- GET/PUT /api/admin/languages - Language management
- GET /api/admin/contact-messages - View support messages
- GET/PUT /api/admin/subscription-settings - Subscription config

### Contact (Public)
- POST /api/contact - Submit contact form

---

## 5. Database Schema

### Tables:
- **users** - id, email, password_hash, full_name, avatar_url, timezone, plan, role (admin/user), language, theme, is_active, subscription_status, created_at, updated_at
- **settings** - key, value, updated_at (key-value store for API keys, theme, config)
- **posts** - id, user_id, content_global, platform_overrides, media_urls, scheduled_at, status, publish_now, created_at, updated_at
- **accounts** - id, user_id, platform, platform_user_id, display_name, access_token, refresh_token, is_active, created_at
- **notifications** - id, user_id, type, title, message, data, is_read, created_at
- **approval_requests** - id, post_id, requested_by, status, comment, reviewed_by, reviewed_at, created_at
- **contact_messages** - id, name, email, subject, message, status, created_at

---

## 6. Deployment

### Server Setup
- **Server:** 94.72.110.114 (Linux)
- **PM2 Process:** newswalla-api (port 3060)
- **Nginx:** Reverse proxy via /etc/nginx/snippets/newswalla.conf
- **Database:** /opt/newswalla/data/newswalla.db
- **Frontend Build:** /opt/newswalla/apps/web/dist/

### Deployment Commands
```bash
# Build frontend
cd /opt/newswalla
npm run build --workspace=apps/web

# Restart API
pm2 restart newswalla-api

# Run migrations
sqlite3 data/newswalla.db < apps/api/src/db/migrations/001_init.sql
sqlite3 data/newswalla.db < apps/api/src/db/migrations/002_admin_roles_themes_i18n.sql
sqlite3 data/newswalla.db < apps/api/src/db/migrations/003_approval_notifications.sql
sqlite3 data/newswalla.db < apps/api/src/db/migrations/004_contact_messages.sql
```

### Nginx Configuration
```nginx
location /newswalla/api/ {
    proxy_pass http://127.0.0.1:3060/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
}

location /newswalla/ {
    alias /opt/newswalla/apps/web/dist/;
    try_files $uri $uri/ /newswalla/index.html;
}
```

---

## 7. GitHub Repository
https://github.com/anirudhatalmale6-alt/newswalla

---

## 8. Default Admin Credentials
- Email: admin@newswalla.com / Password: admin123
- First registered user automatically becomes admin

---

## 9. Environment Variables
The API reads configuration from SQLite settings table. No .env file required.
All API keys are stored encrypted in the settings table via the admin panel.

---

## 10. Future Roadmap
- OAuth2 integration for social platforms (Facebook Graph API, YouTube Data API, etc.)
- Stripe checkout integration for automated billing
- Email notifications (SMTP configuration)
- Webhook support for post publishing events
- Mobile-responsive admin dashboard improvements
- Real-time WebSocket notifications
- Content templates and post recycling
- Bulk scheduling from CSV/Excel
- White-label support

---

*Document generated: April 2026*
*Version: 1.0*
