<div align="center">

# SwiftLink

**Production-ready secure sharing platform** — shorten links, share encrypted notes, track analytics.

<p align="center">
  <a href="https://github.com/yourusername/swiftlink">
    <img
      src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&duration=3000&pause=1000&color=7C3AED&center=true&vCenter=true&width=500&lines=SwiftLink;Secure+Sharing+Platform;Shorten+Links+%7C+Share+Secrets"
      alt=""
    />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens" alt="JWT" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
</p>

[Overview](#overview) · [Features](#features) · [Architecture](#architecture) · [Getting Started](#getting-started) · [API](#api-overview) · [Deploy](#deployment)

</div>

## Overview

SwiftLink is a full-stack secure sharing platform: an authenticated **URL shortener** with QR codes and click analytics, plus **Secure Notes** with client-side encryption and zero-knowledge storage.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens" alt="JWT" />
</p>

| Product | Description |
|:--------|:------------|
| **URL Shortener** | Custom aliases, QR codes, expiration, enable/disable, public redirects, per-link analytics |
| **Secure Notes** | AES-256-GCM encryption in-browser, anonymous access, configurable expiry, auto-save |

Docs: [`backend/README.md`](backend/README.md) · [`frontend/README.md`](frontend/README.md)

> Screenshots and a walkthrough video will be added after deployment.

## Features

<details>
<summary><strong>URL Shortener</strong></summary>

| Capability | Details |
|:-----------|:--------|
| Short codes | Auto-generated 6-character codes or custom aliases |
| Link control | Titles, expiration, enable/disable toggles |
| QR codes | 300×300 PNG generation |
| Redirects | Public `/r/{code}` with async click telemetry |
| Analytics | Dashboard stats, timelines, browser/OS/device breakdown |

</details>

<details>
<summary><strong>Secure Notes</strong></summary>

| Capability | Details |
|:-----------|:--------|
| Encryption | Client-side AES-256-GCM (PBKDF2 key derivation) |
| Privacy | Zero-knowledge — secret codes never stored on server |
| Access | Anonymous — no account required |
| Expiration | 30 minutes to 30 days, scheduled cleanup |
| Editing | Auto-save while editing existing notes |

</details>

<details>
<summary><strong>Platform</strong></summary>

JWT authentication · BCrypt passwords · dark/light theme · responsive UI · Flyway migrations · Docker Compose · Render + Vercel deploy configs

</details>

## Architecture

**System overview**

```mermaid
flowchart TB
    subgraph Client["Browser — React SPA"]
        UI[Pages & Components]
        Auth[AuthContext + JWT]
        Crypto[Web Crypto API]
    end
    subgraph Frontend["Vercel / Nginx"]
        Static[Static Assets]
    end
    subgraph Backend["Spring Boot — Render"]
        Controllers[REST Controllers]
        Security[JWT + Spring Security]
        Services[Business Services]
        Flyway[Flyway Migrations]
    end
    subgraph Database["PostgreSQL"]
        Users[(users)]
        URLs[(short_urls)]
        Analytics[(click_analytics)]
        Notes[(secure_notes)]
    end
    UI --> Static
    UI -->|Bearer Token| Controllers
    Crypto -->|Hash + ciphertext| Controllers
    Controllers --> Security --> Services --> Flyway --> Database
    Controllers -->|302| Client
```

<details>
<summary><strong>URL Shortener flow</strong></summary>

```mermaid
sequenceDiagram
    actor User
    participant UI as React Dashboard
    participant API as Spring Boot API
    participant DB as PostgreSQL
    actor Visitor
    User->>UI: Paste long URL
    UI->>API: POST /api/urls
    API->>DB: Save record
    API-->>UI: shortUrl + QR
    Visitor->>API: GET /r/{code}
    API->>DB: Log analytics
    API-->>Visitor: 302 redirect
```

</details>

<details>
<summary><strong>Secure Notes flow</strong></summary>

```mermaid
sequenceDiagram
    actor User
    participant Browser as React + Web Crypto
    participant API as Spring Boot API
    participant DB as PostgreSQL
    User->>Browser: Enter secret code
    Browser->>Browser: SHA-256 hash
    Browser->>API: POST /api/notes/open
    API->>DB: Lookup by hash
    API-->>Browser: Ciphertext
    Browser->>Browser: Decrypt locally
    Browser-->>User: Plaintext
    Note over Browser: Secret code never sent to server
```

</details>

<details>
<summary><strong>Project structure</strong></summary>

```mermaid
flowchart TB
    Root["URL Shortner/"] --> BE["backend/"]
    Root --> FE["frontend/"]
    Root --> DC["docker-compose.yml"]
    BE --> BCtrl["controller/"]
    BE --> BSvc["service/"]
    BE --> BSec["security/"]
    BE --> BFly["db/migration/"]
    FE --> FPages["pages/"]
    FE --> FComp["components/"]
    FE --> FSvc["services/"]
```

```text
URL Shortner/
├── backend/          # Spring Boot API
├── frontend/         # React + Vite SPA
├── docker-compose.yml
└── render.yaml
```

</details>

## Tech Stack

| Layer | Stack | Role |
|:------|:------|:-----|
| Backend | <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" height="20" /> <img src="https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?logo=springboot&logoColor=white" height="20" /> | REST API, security, scheduling |
| Frontend | <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" height="20" /> <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" height="20" /> | SPA, HMR, responsive UI |
| Database | <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" height="20" /> | Persistent storage |
| Auth | <img src="https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens" height="20" /> | Stateless authentication |
| Infra | <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" height="20" /> <img src="https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white" height="20" /> <img src="https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white" height="20" /> | Containers & cloud deploy |
| Data | Flyway · JPA · Recharts · Tailwind CSS 4 | Migrations, ORM, charts, styling |

## Getting Started

**Prerequisites:** Java 17+ · Maven 3.8+ · Node.js 20+ · PostgreSQL 15+ (or Docker)

```bash
git clone https://github.com/yourusername/swiftlink.git
cd swiftlink
docker-compose up --build
```

| Service | URL |
|:--------|:----|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

<details>
<summary><strong>Manual setup & environment variables</strong></summary>

```bash
# Backend
cd backend && cp .env.example .env && mvn spring-boot:run

# Frontend (separate terminal)
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

| Variable | Service | Description |
|:---------|:--------|:------------|
| `DATABASE_URL` | Backend | PostgreSQL JDBC string |
| `JWT_SECRET` | Backend | Base64 HMAC key (256+ bits) |
| `FRONTEND_URL` | Backend | CORS origin |
| `APP_URL` | Backend | Public API base for short links |
| `VITE_API_BASE_URL` | Frontend | Backend URL (build-time) |

Templates: [`backend/.env.example`](backend/.env.example) · [`frontend/.env.example`](frontend/.env.example)

</details>

<details>
<summary><strong>Docker commands</strong></summary>

| Container | Image | Port |
|:----------|:------|:-----|
| `swiftlink_db` | postgres:15-alpine | 5432 |
| `swiftlink_backend` | eclipse-temurin:17-jre-alpine | 8080 |
| `swiftlink_frontend` | nginx:alpine | 80 |

```bash
docker-compose up --build -d
docker-compose logs -f backend
docker-compose down
```

</details>

## Deployment

<details>
<summary><strong><img src="https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=white" height="18" /> Backend on Render</strong></summary>

1. Connect repo → **Web Service** → Docker → `backend/Dockerfile`
2. Set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `APP_URL`
3. Deploy — Flyway runs migrations on startup

Blueprint: [`render.yaml`](render.yaml)

</details>

<details>
<summary><strong><img src="https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel&logoColor=white" height="18" /> Frontend on Vercel</strong></summary>

1. Import repo → Framework: **Vite** → Root: `frontend`
2. Set `VITE_API_BASE_URL` to your Render backend URL
3. Deploy — SPA routing via [`vercel.json`](frontend/vercel.json)

</details>

## API Overview

<details>
<summary><strong>Authentication <code>/api/auth</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `POST` | `/api/auth/register` | — | Register user |
| `POST` | `/api/auth/login` | — | Login, receive JWT |
| `PUT` | `/api/auth/profile` | JWT | Update profile |

</details>

<details>
<summary><strong>URLs <code>/api/urls</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `POST` | `/api/urls` | JWT | Create short URL |
| `GET` | `/api/urls` | JWT | List URLs |
| `GET` | `/api/urls/{id}` | JWT | Get details |
| `PUT` | `/api/urls/{id}` | JWT | Update URL |
| `PUT` | `/api/urls/{id}/toggle` | JWT | Enable/disable |
| `DELETE` | `/api/urls/{id}` | JWT | Delete URL |
| `GET` | `/api/urls/{id}/qrcode` | JWT | QR PNG |

</details>

<details>
<summary><strong>Analytics <code>/api/analytics</code> · Public <code>/r</code> · Notes <code>/api/notes</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/analytics/dashboard` | JWT | Dashboard stats |
| `GET` | `/api/analytics/clicks-by-day` | JWT | Click timeline |
| `GET` | `/api/analytics/top-urls` | JWT | Top 5 URLs |
| `GET` | `/api/analytics/urls/{id}` | JWT | Per-URL analytics |
| `GET` | `/r/{code}` | — | Public redirect |
| `POST` | `/api/notes` | — | Create/update note |
| `POST` | `/api/notes/open` | — | Open note by hash |
| `DELETE` | `/api/notes/{noteHash}` | — | Delete note |

</details>

Full reference: [`backend/README.md`](backend/README.md)

## Database

<details>
<summary><strong>Schema diagram</strong></summary>

```mermaid
erDiagram
    users ||--o{ short_urls : owns
    short_urls ||--o{ click_analytics : tracks
    users { bigint id PK varchar username UK varchar email UK }
    short_urls { bigint id PK varchar short_code UK text long_url bigint user_id FK }
    click_analytics { bigint id PK bigint short_url_id FK timestamp clicked_at }
    secure_notes { bigint id PK varchar note_hash UK text encrypted_content timestamp expires_at }
```

| Migration | Description |
|:----------|:------------|
| `V1__init.sql` | Users, short URLs, click analytics |
| `V2__secure_notes.sql` | Initial secure notes |
| `V3__secure_notes_redesign.sql` | Anonymous hash-based notes |

</details>

## Security & Highlights

| Security | Highlights |
|:---------|:-----------|
| BCrypt password hashing | Dual-product: URL shortener + secure notes |
| Stateless JWT (24h) | Zero-knowledge client-side encryption |
| CORS allowlist | Docker + Render + Vercel configs |
| AES-256-GCM secure notes | Real-time click analytics |
| Parameterized JPA queries | Flyway schema versioning |
| React XSS auto-escaping | Clean layered architecture |

## Contributing

Fork → branch → commit → pull request. Test with Docker Compose. Do not commit secrets.

<details>
<summary><strong>Roadmap</strong></summary>

Custom domains · team workspaces · webhooks · GeoIP heatmaps · link passwords · bulk CSV import · OAuth2 · rate limiting · admin dashboard · PWA

</details>

## License

MIT — see [LICENSE](LICENSE).

## Author

**Your Name** · [@yourusername](https://github.com/yourusername) · [LinkedIn](https://linkedin.com/in/yourprofile) · [Portfolio](https://yoursite.com)

---

<div align="center">

**SwiftLink** — Shorten smart. Share secure.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens" alt="JWT" />
</p>

</div>
