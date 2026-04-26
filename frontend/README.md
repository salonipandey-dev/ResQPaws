# 🐾 ResQPaws — AI-powered Animal Rescue Platform

A premium, production-ready Next.js 14 frontend for an AI-powered animal rescue network.

Apple x Stripe x Modern NGO Startup aesthetic — warm cream + orange accents, dark mode, framer-motion animations, shadcn/ui.

## 🚀 Quick start

```bash
# 1. Install
yarn install
# or  npm install / pnpm install

# 2. Copy env
cp .env.example .env.local

# 3. Run dev server
yarn dev
# → http://localhost:3000

# 4. Production build
yarn build && yarn start
```

## 🧰 Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (new-york style)
- **Framer Motion** for animations
- **Lucide React** icons
- **next-themes** (dark/light mode)
- **React Hook Form + Zod** for forms
- **Axios** for HTTP
- **Zustand** for state
- **Recharts** for analytics
- **Sonner** for toasts

## 🗂️ Folder structure

```
src/
│── app/                       # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx               # Home (Hero, Features, Stats, ...)
│   ├── globals.css
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx
│   ├── dashboard/             # User console
│   │   ├── layout.tsx, page.tsx
│   │   ├── report/, track/, rewards/, profile/
│   ├── ngo/                   # NGO console
│   │   ├── layout.tsx, page.tsx
│   │   ├── cases/, map/, history/
│   ├── admin/                 # Admin console
│   │   ├── layout.tsx, page.tsx
│   │   ├── users/, reports/, analytics/, settings/
│   └── api/[[...path]]/route.ts
│
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── layout/                # Navbar, Footer, FloatingActions, ThemeToggle, Logo
│   ├── home/                  # Hero, Features, Stats, HowItWorks, Testimonials, CTA, Partners
│   └── dashboard/             # AppShell sidebar
│
├── features/
│   ├── chatbot/Chatbot.tsx
│   ├── emergency/EmergencyModal.tsx
│   ├── auth/, report/, tracking/
│
├── services/api.ts           # axios client
├── hooks/                    # custom hooks
├── lib/                      # utils (cn)
├── utils/                    # misc helpers
└── types/                    # shared TS types
```

## ✨ Routes

**Public** — `/`, `/about`, `/contact`, `/login`

**User** — `/dashboard`, `/dashboard/report`, `/dashboard/track`, `/dashboard/rewards`, `/dashboard/profile`

**NGO** — `/ngo`, `/ngo/cases`, `/ngo/map`, `/ngo/history`

**Admin** — `/admin`, `/admin/users`, `/admin/reports`, `/admin/analytics`, `/admin/settings`

## 🎨 Theme

Design tokens in `src/app/globals.css`. Cream background + vivid orange primary, with full dark mode palette. Toggle with `<ThemeToggle />` (uses `next-themes`).

## 💡 Floating actions

`<FloatingActions />` is mounted on every public/dashboard page — shows the 🚨 Emergency button (opens modal with 4 quick actions) and 💬 AI Assistant chatbot (slide-in panel). On mobile, both collapse into a single FAB.

## 📝 Notes

- Chatbot replies are mocked with smart keyword matching. Wire up your LLM in `src/features/chatbot/Chatbot.tsx` (`mockReply`).
- API stubs live in `src/app/api/[[...path]]/route.ts`.
- shadcn UI components ship as `.jsx` for compatibility — they work seamlessly inside TypeScript files.

---

Made with care for every paw 🐾
