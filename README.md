# Nightlife

Nightlife is a full-stack photography-focused social platform that enables users to share visual content, interact with photographers, discover content, and manage learning and progress features. Built as a portfolio software-engineering project, it pairs a React client with a Spring Boot REST API and MySQL persistence, with media uploaded through Cloudinary.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0.2-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Portfolio%20Project-lightgrey?style=flat-square)

---

## Overview

Nightlife centers on night-photography style sharing: members register, maintain profiles, and publish posts with captions, locations, and Cloudinary-hosted media. Other members discover work through Explore and search, then engage with likes, comments, saves, and follows—all persisted through the API and MySQL.

Beyond the core feed, the platform includes stories and reels for short-form media, in-app activity notifications (likes, comments, follows), and learning surfaces for structured plans (topics and resources) plus personal progress notes. The application is designed for local full-stack development and demonstration; it is not presented as a hosted production SaaS.

---

## Key Features

### Authentication & Security

- Email/password registration and login
- JWT issued after authentication and sent on API requests
- Protected `/api/**` routes via Spring Security
- Ownership checks on mutating operations (posts, comments, notifications, reels, learning plans)
- Public user responses use a DTO that omits sensitive fields such as `savedPost`
- Configuration and secrets loaded from environment variables (not hard-coded)

### Photography & Content

- Create, edit, and delete posts with captions and location
- Image and video upload via unsigned Cloudinary presets; API stores returned URLs
- Like / unlike posts
- Comments: create, edit, delete, and like
- Save / unsave posts (Saved visible on the owner’s profile)
- Follow / unfollow users
- Stories: create and view by user
- Reels: upload and watch (play / mute)

### Discovery & Social

- Explore grid for broader content discovery
- User search
- Profile views with posts and (for the owner) Saved
- Activity notifications with unread handling, mark-read, delete, and post deep links (`/p/:postId`)
- Responsive layout (desktop sidebar and mobile navigation)

### Learning Features

- Learning plans with topics and resources (“Craft” in the UI)
- Learning progress notes
- Owner-scoped access for plan details

**Honest scope notes:** Google OAuth has a working local code path (backend OAuth2 client + frontend callback) but is not production-configured. Stories and reels are thinner than posts (for example, reels lack likes/comments in the UI). There is no hosted live demo.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Redux + Thunk, React Router 6, Axios, Chakra UI, Ant Design, Tailwind CSS, Formik / Yup |
| **Backend** | Java 17, Spring Boot 3.0.2, Spring Security, JWT (jjwt), Spring Data JPA, Bean Validation, Maven Wrapper |
| **Database / media** | MySQL 8, Cloudinary (browser unsigned upload) |
| **Testing** | JUnit 5, Spring Boot Test, MockMvc / Mockito (backend) |

| Local service | Default |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:5454` |
| MySQL (XAMPP in this project) | `localhost:3308`, database `nightlife` |

---

## Architecture

```
React client (:3000)
        │  REST + JWT
        ▼
Spring Boot API (:5454)
        │  Spring Data JPA
        ▼
MySQL (nightlife)
```

Media is handled separately: the browser uploads files to Cloudinary using unsigned presets; the API persists only the resulting URLs on posts, stories, reels, and avatars.

---

## Security & Engineering Practices

- JWT-based API authentication after login
- Route protection and session cleanup on `401` in the client
- Server-side ownership / authorization checks returning `403` where appropriate
- `PublicUserDto` on public user endpoints to avoid leaking private collections such as saved posts
- Environment-based secrets (`JWT_SECRET`, DB credentials, OAuth client values, Cloudinary config)
- `.env` files gitignored; `.env.example` files document names and placeholders only
- Input validation (e.g. signup) and centralized exception handling
- Automated backend tests for critical auth and ownership behaviors

---

## Testing

Backend suite (isolated; does not require a live MySQL instance for the active tests):

```powershell
cd NIGHTLIFE
.\mvnw.cmd test
```

Covered behaviors:

| Area | What is verified |
|---|---|
| Signup validation | Invalid registration input is rejected |
| Login | Invalid credentials return **401** |
| Comment ownership | Non-owners cannot mutate comments (**403**) |
| Learning-plan ownership | Non-owners cannot access another user’s plan by id (**403**) |
| Public user privacy | Public user JSON does not expose `savedPost` |

The Spring context-load smoke test (`CookingHubApplicationTests`) is **`@Disabled`** because it requires a live MySQL instance on `localhost:3308`. That skip is infrastructure-related, not an application-logic failure.

There is no meaningful frontend automated test suite. Compile check:

```powershell
cd NIGHTLIFE
.\mvnw.cmd -DskipTests compile
```

---

## Project Structure

```
NightPhotography/
├── client/                  # React frontend (Create React App)
├── NIGHTLIFE/               # Spring Boot backend (Maven)
├── docs/                    # Project documentation
├── .gitignore
└── README.md
```

- **`client/`** — UI, Redux store, routing, Cloudinary upload helpers, and API calls to the backend.
- **`NIGHTLIFE/`** — REST controllers, services, JPA models, security filters, optional local demo seeding, and tests.
- **`docs/`** — Supporting documentation (including screenshot notes).

---

## Local Development

Prerequisites: **Node.js**, **Java 17+**, **MySQL** (this project uses XAMPP MySQL on port **3308**), and a Cloudinary cloud with unsigned upload presets for local media uploads.

### 1. Database

Create a MySQL database named `nightlife` and ensure the server is reachable at the host/port you configure (default `localhost:3308`).

### 2. Backend

```powershell
cd NIGHTLIFE
copy .env.example .env
# Set JWT_SECRET (32+ characters), DB_PASSWORD, and other values in .env — never commit .env
.\mvnw.cmd spring-boot:run
```

API: [http://localhost:5454](http://localhost:5454)

### 3. Frontend

```powershell
cd client
copy .env.example .env
# Set REACT_APP_API_URL and Cloudinary variables — never commit .env
npm install
npm start
```

App: [http://localhost:3000](http://localhost:3000)

Do not run `npm run build` while `npm start` is already using the webpack dev server.

---

## Environment Variables

Copy from the `.env.example` files. Real values stay in **local** `.env` files (gitignored).

### Frontend (`client/.env`)

| Variable | Example / notes |
|---|---|
| `REACT_APP_API_URL` | `http://localhost:5454` |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | *(local only — required for uploads)* |
| `REACT_APP_CLOUDINARY_PRESET_IMAGE` | *(unsigned preset name)* |
| `REACT_APP_CLOUDINARY_PRESET_VIDEO` | *(unsigned preset name)* |

Google sign-in uses the backend OAuth2 authorization URL (`/oauth2/authorization/google`); configure Google credentials on the **backend**, not as frontend secrets.

### Backend (`NIGHTLIFE/.env`)

| Variable | Example / notes |
|---|---|
| `JWT_SECRET` | *(required, local only — 32+ characters)* |
| `JWT_EXPIRATION` | `86400000` |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3308` |
| `DB_NAME` | `nightlife` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | *(local only)* |
| `SERVER_PORT` | `5454` |
| `FRONTEND_URL` | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | *(optional, local OAuth)* |
| `GOOGLE_CLIENT_SECRET` | *(optional, local OAuth)* |
| `NIGHTLIFE_DEMO_DATA` | `false` (default) |
| `NIGHTLIFE_DEMO_REFRESH_MEDIA` | `false` (default) |

Never commit JWT secrets, database passwords, OAuth client secrets, or Cloudinary API secrets. Unsigned upload presets are public upload names, not API keys.

---

## Development Demo Data

Optional **local development** seeding is available and **disabled by default**.

| Flag | Default | Purpose |
|---|---|---|
| `NIGHTLIFE_DEMO_DATA` / `nightlife.demo-data.enabled` | `false` | Seed fictional `@nightlife.demo` users and sample content once |
| `NIGHTLIFE_DEMO_REFRESH_MEDIA` / `nightlife.demo-data.refresh-media` | `false` | Refresh curated media URLs for existing demo accounts only |

Enable once from PowerShell if needed:

```powershell
cd NIGHTLIFE
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--nightlife.demo-data.enabled=true"
```

After `Demo seed complete` appears in the logs, turn the flag off again. The seeder is idempotent if `neonaria@nightlife.demo` already exists.

**Development-only demo credential — never use in production.**

| Field | Value |
|---|---|
| Accounts | `*@nightlife.demo` (e.g. `neonaria@nightlife.demo`) |
| Password | `DemoNight1!` |

Normal local use does not require seeding; create your own accounts instead.

---

## API

The Spring Boot backend exposes REST endpoints for:

- Authentication / session-related flows (including sign-in JWT issuance and optional Google OAuth callback support)
- Users (profile, search, follow)
- Posts (CRUD, like, save)
- Comments
- Notifications
- Stories and reels
- Learning plans and learning progress

Most `/api/**` routes require a valid JWT. Exact paths live under `NIGHTLIFE/src/main/java/com/zos/controller/`.

---

## Author

### Chathuni Nimesha

- Portfolio: [https://chathuni-nimesha.github.io/](https://chathuni-nimesha.github.io/)
