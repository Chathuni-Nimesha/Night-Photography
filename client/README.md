# Nightlife frontend

React client for **Nightlife**, a night-photography community platform.

The full project overview, architecture, environment variables, and local setup live in the [root README](../README.md).

## Local run

```bash
cd client
npm install
npm start
```

The app starts at [http://localhost:3000](http://localhost:3000) and calls the Spring Boot API at `http://localhost:5454` by default (`REACT_APP_API_URL`).

Copy `client/.env.example` to `client/.env` for local overrides. Do not commit secrets.

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Development server (port 3000) |
| `npm test` | CRA test runner (few/no app tests) |
| `npm run build` | Production bundle — do not run this while `npm start` is already using webpack |
