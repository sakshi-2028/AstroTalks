<div align="center">

# 🔮 AstroTalks

### *Whisper your questions to the cosmos. Receive ancient wisdom, one star at a time.*

[![CI/CD Pipeline](https://github.com/sakshi-2028/AstroTalks/actions/workflows/deploy.yml/badge.svg)](https://github.com/sakshi-2028/AstroTalks/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live-astrotalks--app.duckdns.org-blue?style=flat&logo=googlechrome&logoColor=white)](https://astrotalks-app.duckdns.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Caddy](https://img.shields.io/badge/Caddy-2-1F88C0?logo=caddy&logoColor=white)](https://caddyserver.com/)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/ec2/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/)

**🌐 Live Demo → [astrotalks-app.duckdns.org](https://astrotalks-app.duckdns.org)**

</div>

---

## 🌟 Overview

**AstroTalks** is a production-grade full-stack AI astrology chat application. Users register with their date of birth, and the app derives their **Sun Sign** and **Nakshatra**, then connects them with **Jyotish Guruji** — an AI persona modelled on a professional Indian Vedic astrologer.

The entire stack is **containerized**, deployed on **AWS EC2** with **automatic HTTPS** via Caddy, and continuously delivered through a **6-stage GitHub Actions pipeline**.

---

## 🏛️ Architecture

```
                            ┌──────────────────────┐
                            │      Browser         │
                            │   (User on phone     │
                            │    or laptop)        │
                            └──────────┬───────────┘
                                       │ HTTPS
                                       ▼
                  ┌────────────────────────────────────────┐
                  │         🌐 DuckDNS DNS                  │
                  │  astrotalks-app.duckdns.org → EC2 IP    │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
        ┌────────────────────────────────────────────────────┐
        │          ☁️ AWS EC2 (Mumbai, t2.micro)              │
        │ ┌────────────────────────────────────────────────┐ │
        │ │         🐳 Docker Compose Network              │ │
        │ │                                                │ │
        │ │  ┌──────────────┐                              │ │
        │ │  │  Caddy 2     │  ← Auto HTTPS                │ │
        │ │  │  (Reverse    │  ← Let's Encrypt SSL         │ │
        │ │  │   Proxy)     │  ← Ports 80, 443             │ │
        │ │  └──────┬───────┘                              │ │
        │ │         │                                      │ │
        │ │    ┌────┴──────┐                               │ │
        │ │    │ /api/*    │  others                       │ │
        │ │    ▼           ▼                               │ │
        │ │  ┌──────┐   ┌──────────┐                       │ │
        │ │  │Backend│  │ Frontend │                       │ │
        │ │  │Express│  │ Nginx    │                       │ │
        │ │  │Node 22│  │ React 18 │                       │ │
        │ │  └──┬───┘   └──────────┘                       │ │
        │ └─────┼──────────────────────────────────────────┘ │
        └───────┼────────────────────────────────────────────┘
                │
                ▼ TLS
   ┌───────────────────────────┐         ┌────────────────────┐
   │   🗄️ MongoDB Atlas        │         │   🤖 OpenAI API    │
   │   (Free M0 Cluster)       │         │   (GPT model)      │
   └───────────────────────────┘         └────────────────────┘
```

---

## ✨ Features

- 🎨 **Animated star-field landing** with cosmic UI
- 📅 **DOB-based personalization** — auto-derives Sun Sign + Nakshatra
- 🤖 **Vedic AI persona** — strong system prompt for spiritual, calm tone
- 💬 **Persistent chat history** — stored in MongoDB, browseable from sidebar
- 📱 **Fully responsive** — works on mobile and desktop
- 🔒 **Production-grade security** — server-side API keys, CORS protection
- ⚡ **Real-time typing indicator** — animated dots while AI responds
- 🛡️ **Error handling** — dismissable inline error banners

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite 5 | SPA with HMR + fast builds |
| **Styling** | CSS Modules + custom properties | Scoped theming |
| **Backend** | Node 22 + Express 4 | REST API + AI orchestration |
| **Database** | MongoDB 6 (Atlas) | User + session persistence |
| **AI** | OpenAI API | LLM-powered astrologer |
| **Reverse Proxy** | Caddy 2 | Auto HTTPS + routing |
| **Containers** | Docker + Docker Compose | Reproducible deploys |
| **CI/CD** | GitHub Actions | 6-stage automated pipeline |
| **Hosting** | AWS EC2 (Ubuntu 22.04) | Linux VM in Mumbai |
| **DNS** | DuckDNS | Free dynamic subdomain |
| **SSL** | Let's Encrypt (via Caddy) | Auto cert + renewal |

---

## 🚀 CI/CD Pipeline

The pipeline runs on every push to `main` and PR. **6 sequential stages** ensure code quality before reaching production.

```
┌──────────────────────────────────────────────────────────┐
│  🔍 Code Quality      → Lint + secret scan + integrity   │
│  ↓                                                        │
│  🏗️  Build Frontend   → Vite production build + artifact │
│  ↓                                                        │
│  🐳 Docker Validation → Build & cache Docker images      │
│  ↓                                                        │
│  🔒 Security Scan     → Trivy CVE scanner (HIGH/CRIT)    │
│  ↓                                                        │
│  🚀 Deploy to EC2     → SSH → git pull → compose up      │
│  ↓                                                        │
│  ✅ Health Check      → Verify HTTPS + API + SSL cert    │
└──────────────────────────────────────────────────────────┘
```

**Key features:**
- ⚡ **Concurrency control** — cancels in-flight runs on new push
- 📦 **GitHub Actions cache** — Docker layer + npm caching
- 🔒 **Branch protection** — deploys only from `main`
- 📊 **Build artifacts** — uploaded for 7 days
- 🩺 **Post-deploy health checks** — fails the run if site is down
- 📈 **Rich job summaries** — beautiful deploy reports in GitHub UI

---

## 📦 Project Structure

```
AstroTalks/
├── .github/workflows/
│   └── deploy.yml              # 6-stage CI/CD pipeline
├── server/                     # Express backend
│   ├── routes/
│   │   ├── sessions.js         # Chat session CRUD + AI calls
│   │   └── users.js            # User registration
│   ├── models/                 # Mongoose schemas
│   ├── middleware/             # Error handlers
│   ├── systemPrompt.js         # AI persona (server-side)
│   ├── index.js                # Express entry
│   └── Dockerfile              # Backend container
├── src/                        # React frontend
│   ├── components/
│   │   ├── Chat/               # Chat UI components
│   │   └── Landing/            # Landing page
│   ├── hooks/useChat.js        # Chat state + API
│   ├── services/api.js         # Frontend fetch wrapper
│   └── styles/global.css
├── public/favicon.svg
├── Caddyfile                   # Reverse proxy + auto-HTTPS
├── Dockerfile                  # Frontend (Nginx) container
├── docker-compose.yml          # Production stack
├── docker-compose.local.yml    # Local development stack
└── vite.config.js
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop
- Docker Compose v2
- MongoDB Atlas account (free)
- OpenAI API key
- AWS account (for production deployment)

### Local Development (Docker)

```bash
# 1. Clone
git clone https://github.com/sakshi-2028/AstroTalks.git
cd AstroTalks

# 2. Create .env in project root
cat > .env << EOF
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/astroTalks
OPENAI_API_KEY=sk-proj-...
PORT=5000
EOF

# 3. Run with Docker Compose
docker compose -f docker-compose.local.yml up --build
```

Open **http://localhost:8080** 🎉

### Local Development (without Docker)

```bash
# Frontend
npm install
npm run dev

# Backend (separate terminal)
cd server && npm install && npm start
```

---

## 🌐 Production Deployment

The production environment is fully automated. To deploy:

1. **Push to `main`** branch → CI/CD pipeline triggers automatically
2. Pipeline runs 6 stages → on success, SSHs into EC2
3. EC2 pulls latest code → `docker compose up -d --build`
4. Health checks verify the deployment
5. ✅ Live at https://astrotalks-app.duckdns.org

**No manual steps required.** Just push to main.

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `EC2_HOST` | EC2 instance public IPv4 address |
| `EC2_SSH_KEY` | SSH private key (PEM format) |

### Server-side Environment (`.env` on EC2)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `OPENAI_API_KEY` | OpenAI API key (server-side only) |
| `PORT` | Backend port (5000) |

---

## 🔐 Security

- ✅ **No secrets in code** — all keys in `.env` (gitignored)
- ✅ **Server-side AI calls** — API keys never exposed to browser
- ✅ **HTTPS enforced** — Caddy redirects HTTP → HTTPS
- ✅ **CORS protected** — only allowed origins reach backend
- ✅ **Trivy scanning** — every PR scanned for CVEs
- ✅ **MongoDB TLS** — encrypted in-transit to Atlas
- ✅ **Hardcoded secret detection** — pre-deploy CI check

---

## 📊 Monitoring & Operations

```bash
# View live container logs (on EC2)
docker compose logs -f

# Container health
docker compose ps

# Manual restart
docker compose restart

# Rolling update
git pull && docker compose up -d --build
```

---

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first to discuss.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request — CI will validate automatically

---

## 📝 License

MIT © 2026 — Free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ for the cosmos**

[Live Demo](https://astrotalks-app.duckdns.org) • [Report Bug](https://github.com/sakshi-2028/AstroTalks/issues) • [Request Feature](https://github.com/sakshi-2028/AstroTalks/issues)

</div>
