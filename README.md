# Nightlife

Full-stack web app for night photographers: publish frames, follow other members, and interact through likes, comments, saves, and activity — all persisted in MySQL. This is a **portfolio project**, not a static photography site and not a hosted production product.

Members sign in, upload media to Cloudinary, and the Spring Boot API stores URLs plus the social graph. The feed is real user data, not mock posts.

---

## Purpose

Give night photographers a focused community to share work and get feedback from other signed-in users. Every post, like, comment, save, and follow is written to the database and visible to other members.

---

## Key features

Implemented in the current codebase:

- Email/password registration and login; JWT on API requests
- Profile management (edit profile, bio, avatar upload)
- Post create / edit / delete with Cloudinary image upload, caption, and location
- Home following feed and Explore grid
- User search
- Like / unlike posts
- Comments: create, edit, delete, like/unlike
- Save / unsave; Saved tab on the owner’s profile only
- Follow / unfollow
- Activity notifications (like, comment, follow) with unread badge, mark-read, delete, and `/p/:postId` deep links
- Stories: create and view by user
- Reels: upload and watch (play / mute)
- Craft: learning plans with topics and resources
- Progress notes
- Responsive layout (desktop sidebar, mobile navigation)
- Protected routes and 401 handling that clears a stale session

**Partially implemented (honest):**

- Google OAuth **code path** exists (backend + frontend). It is **not** production-configured; local Google credentials are required to try it.
- Stories: create/view work; following-story aggregation is thin (no dedicated following-stories API).
- Reels: create and viewer only — no reel likes/comments; reel delete exists on the API but not in the UI; profile has no per-user reels grid.
- Website can be saved on the profile form; it is not shown on the public profile card.

**Not included:** chat/DMs, AI captions, ads, recommendations, or a live production deployment.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux + Thunk, React Router 6, Tailwind CSS, Chakra UI, Ant Design, Formik + Yup |
| Backend | Java 17, Spring Boot 3.0.2, Spring Security, Spring Data JPA, jjwt, Maven Wrapper |
| Database | MySQL 8 — database name `nightlife` |
| Authentication | BCrypt passwords, `GET /signin` (HTTP Basic → JWT), optional Google OAuth2 client |
| Media | Unsigned Cloudinary upload in the browser; API stores returned URLs |

**Local ports**

| Layer | URL / port |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:5454` |
| MySQL (XAMPP in this project) | `localhost:3308` |
| Database name | `nightlife` |

---

## Architecture

```
Browser (React, :3000)
    |  JWT in Authorization header
    v
Spring Boot API (:5454)
    |  JPA
    v
MySQL  nightlife @ :3308

Browser
    |  unsigned upload
    v
Cloudinary  -->  URLs stored on posts / stories / reels / avatars
```

The API does not store binary files.

---

## Project structure

```
NightPhotography/
├── README.md
├── .gitignore
├── client/                      React (Create React App)
│   ├── public/
│   ├── src/
│   │   ├── Config/              API URL, auth, Cloudinary, media
│   │   ├── Redux/               posts, comments, users, stories, reels,
│   │   │                        notifications, craft, progress
│   │   ├── Pages/               Home, Explore, Profile, Auth, Reels, Story,
│   │   │                        Craft, Progress, About
│   │   ├── Components/          posts, comments, navigation, notifications
│   │   └── styles/
│   └── .env.example
├── NIGHTLIFE/                   Spring Boot API
│   ├── pom.xml
│   ├── .mvn/wrapper/
│   ├── .env.example
│   └── src/
│       ├── main/java/com/zos/
│       │   ├── config/          Security, JWT filters, CORS, OAuth handler
│       │   ├── controller/      REST endpoints
│       │   ├── services/        Business rules and ownership
│       │   ├── model/           JPA entities
│       │   ├── repository/
│       │   ├── dto/
│       │   ├── security/
│       │   └── exception/
│       ├── main/resources/      application.properties (env placeholders)
│       └── test/java/           Isolated MockMvc / Mockito tests
└── docs/screenshots/            Portfolio UI screenshots
```

Routing: `client/src/Pages/Router/Routers.jsx`.  
API base URL: `REACT_APP_API_URL` (local default `http://localhost:5454`).

---

## Authentication and security

**What exists**

- Passwords hashed with BCrypt; password is not serialized on user JSON
- Login via `GET /signin` (HTTP Basic) issues a JWT (`jwt.expiration`, default 24 hours)
- Most `/api/**` routes require authentication
- Owner checks: post edit/delete, comment edit/delete (**403**), notification read/delete (**403**), reel delete, Craft writes, learning-plan GET by id (**403** for non-owners)
- Public user responses (`GET /api/users/username/{username}`, search, batch, popular) use `PublicUserDto` and **do not** include `savedPost`
- `GET /api/users/req` still returns the **current user’s** `savedPost` so Profile → Saved works
- Frontend `handleUnauthorized` clears a stale token and returns to `/login`
- Secrets belong in local `.env` files (`JWT_SECRET` is required at runtime)

**Limitations**

- HTTP Basic is the email/password login mechanism
- CSRF is disabled (JWT API)
- Google OAuth is optional and not production-hardened (JWT may appear in the redirect URL hash)
- Public profile JSON can still include email/mobile
- No rate limiting
- Hibernate `ddl-auto=update` (no Flyway/Liquibase)
- Spring Boot **3.0.2** as in this repo (not the latest)

Never commit real JWT secrets, database passwords, OAuth client secrets, or Cloudinary API secrets. Unsigned Cloudinary **presets** are public upload names, not API keys.

---

## Database

MySQL **`nightlife`** on **`localhost:3308`**.

Entities: users, posts (media URL collections), comments, notifications, stories, reels, learning plans (plan → topics → resources), progress notes. Followers and likes are stored as embedded user snapshots.

---

## Media storage

The client uploads images and video with unsigned Cloudinary presets (`REACT_APP_CLOUDINARY_*` in `client/.env`). There are no hardcoded Cloudinary fallbacks in source. The backend stores the returned URLs.

---

## API overview

| Method | Path | Role |
|---|---|---|
| `POST` | `/signup` | Register |
| `GET` | `/signin` | Login (Basic → JWT header) |
| `GET` | `/oauth-user` | OAuth session → JWT |
| `GET` | `/api` | Health / welcome |

Authenticated groups (JWT):

| Base path | Purpose |
|---|---|
| `/api/users` | Current user, profiles, follow, search, account edit |
| `/api/posts` | CRUD, following feed, like, save |
| `/api/comments` | Create, like, edit, delete, list by post |
| `/api/notifications` | List, unread, mark read, delete |
| `/api/stories` | Create, list by user |
| `/api/reels` | Create, list, delete |
| `/api/learning_plan` | Craft plans, topics, resources |
| `/api/progress` | Progress notes |

OAuth browser start (if Google credentials are configured): `{API}/oauth2/authorization/google`.

---

## Local setup

### Prerequisites

- Node.js 18+ (CRA 5)
- JDK 17
- XAMPP MySQL on **3308** (not 3306)
- Database `nightlife` created
- Cloudinary unsigned upload presets (to publish media)
- Optional: Google OAuth client for the Google button

### 1. MySQL

1. Start MySQL in XAMPP on port **3308**.
2. Create database `nightlife`.
3. Default example user is `root` with an empty password — override in `.env` if yours differs.

### 2. Backend

```bash
cd NIGHTLIFE
copy .env.example .env
```

Set at least `JWT_SECRET` (32+ characters) in `NIGHTLIFE/.env`. Then:

```bash
.\mvnw.cmd spring-boot:run
```

API: [http://localhost:5454](http://localhost:5454)

### 3. Frontend

```bash
cd client
copy .env.example .env
npm install
npm start
```

App: [http://localhost:3000](http://localhost:3000)

Put Cloudinary values only in the local `.env`, not in git.

Do not run `npm run build` while `npm start` is already using webpack.

### Optional: local demo dataset (development only)

**Not required for normal use.** Sign up with your own accounts for day-to-day development. Demo seeding is an **opt-in local development** helper for portfolio screenshots and local walkthroughs. It never runs unless you explicitly enable it.

Defaults (both **false**):

| Flag / env | Default | Purpose |
|---|---|---|
| `nightlife.demo-data.enabled` / `NIGHTLIFE_DEMO_DATA` | `false` | Seed fictional `@nightlife.demo` users and posts once |
| `nightlife.demo-data.refresh-media` / `NIGHTLIFE_DEMO_REFRESH_MEDIA` | `false` | Refresh curated media URLs for existing demo accounts only |

To seed **once** on a local machine (MySQL running, API otherwise able to start):

```bash
cd NIGHTLIFE
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--nightlife.demo-data.enabled=true"
```

Or set `NIGHTLIFE_DEMO_DATA=true` in your **local** process environment (same place as `JWT_SECRET`), then start the API. After `Demo seed complete` appears in the logs, turn the flag back off so later restarts do not re-run the seeder.

The seeder is **idempotent**: if `neonaria@nightlife.demo` already exists, it skips.

**Local demo credentials only** (not production accounts):

| Field | Value |
|---|---|
| Email pattern | `*@nightlife.demo` (e.g. `neonaria@nightlife.demo`) |
| Password | `DemoNight1!` |

Media URLs are public Unsplash / sample video links. Nothing is uploaded to Cloudinary by the seeder.

To refresh demo image/video URLs without wiping likes, comments, or follows:

```bash
cd NIGHTLIFE
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--nightlife.demo-data.refresh-media=true"
```

Turn that flag off again after `Demo media refresh complete`.

---

## Environment variables

Copy `client/.env.example` and `NIGHTLIFE/.env.example`. Real values stay in **local** `.env` files (gitignored). Do not commit secrets.

**Frontend**

| Variable | Local example |
|---|---|
| `REACT_APP_API_URL` | `http://localhost:5454` |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | *(local only)* |
| `REACT_APP_CLOUDINARY_PRESET_IMAGE` | *(local only)* |
| `REACT_APP_CLOUDINARY_PRESET_VIDEO` | *(local only)* |

**Backend**

| Variable | Local example |
|---|---|
| `JWT_SECRET` | *(required, local only)* |
| `JWT_EXPIRATION` | `86400000` |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3308` |
| `DB_NAME` | `nightlife` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | *(local only)* |
| `SERVER_PORT` | `5454` |
| `FRONTEND_URL` | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | *(optional, local only)* |
| `NIGHTLIFE_DEMO_DATA` | `false` (default; local opt-in only) |
| `NIGHTLIFE_DEMO_REFRESH_MEDIA` | `false` (default; local opt-in only) |

---

## Testing

Isolated backend tests (no live MySQL required):

```bash
cd NIGHTLIFE
.\mvnw.cmd test
```

**Latest result:** `BUILD SUCCESS` — **8 passed, 0 failed, 1 skipped**

The skipped test is the Spring context-load smoke test (`CookingHubApplicationTests`). It needs a running MySQL instance on `localhost:3308`. A skip or failure there is infrastructure, not an application logic failure.

Backend compile:

```bash
cd NIGHTLIFE
.\mvnw.cmd -DskipTests compile
```

**Latest result:** `BUILD SUCCESS`

The suite covers signup validation, invalid login **401**, comment ownership **403**, public user JSON without `savedPost`, and learning-plan ownership **403**.

Frontend: Create React App is used for development compile/ESLint. There is no meaningful frontend test suite (the default CRA “learn react” test was removed).

Local two-account QA of the core social loop has been exercised in development. There is **no hosted demo**.

---

## Screenshots

Portfolio UI captures belong in `docs/screenshots/` with these filenames:

| Screen | File |
|---|---|
| Login | `docs/screenshots/01-login.png` |
| Home feed | `docs/screenshots/02-home.png` |
| Create post | `docs/screenshots/03-create-post.png` |
| Explore | `docs/screenshots/04-explore.png` |
| Profile | `docs/screenshots/05-profile.png` |
| Post interaction | `docs/screenshots/06-post-interaction.png` |
| Activity | `docs/screenshots/07-activity.png` |
| Mobile layout | `docs/screenshots/08-mobile.png` |

*Image embeds will be added once those eight PNG files are present in the repository.*

---

## Demo

- **Live URL:** not deployed — run frontend and backend locally.
- **Typical walkthrough:** Login → publish a frame → Explore → like / comment / save → follow another user → Activity → open `/p/:postId`.
- Use your own accounts, or optionally enable the **local development** demo dataset described under [Optional: local demo dataset](#optional-local-demo-dataset-development-only) (defaults remain off).

---

## Known limitations / future improvements

**Limitations**

- Not deployed; local-only
- Schema via Hibernate `update`, not versioned migrations
- Email/password login still uses HTTP Basic
- Google OAuth is a local code path, not a production provider setup
- Stories and reels are thinner than posts
- Create Story UI is less aligned with the Nightlife theme
- Profile website field is not displayed; avatar “remove photo” is not wired
- Public profiles may still include email/mobile
- Small automated test set (8 backend tests); no frontend tests
- No rate limiting

**Possible later work (not in progress)**

- Hosted deploy with env-based CORS
- Flyway/Liquibase
- JSON login instead of HTTP Basic
- Stronger story/reel parity
- Notification refresh without a full reload

Do not add chat, AI, or ads for the portfolio scope.

---

## Author / Developer

**Chathuni Nimesha** — full-stack software engineering portfolio project (React, Spring Boot, MySQL, JWT, Cloudinary).

- GitHub: [github.com/Chathuni-Nimesha](https://github.com/Chathuni-Nimesha)
- Portfolio: [chathuni-nimesha.github.io](https://chathuni-nimesha.github.io/)
- Behance: [behance.net/chathuninimesha](https://www.behance.net/chathuninimesha)
