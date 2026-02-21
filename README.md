# buy-sell-geo

A Vite + React frontend with an Express + MongoDB backend (monorepo style). This repository contains both the client (root) and server (`/server`).

## Quick local development

- Install dependencies and run both parts:

```bash
# from repo root
npm install

# Start backend (server) in another terminal
cd server
npm install
npm run dev

# Back in repo root: start client dev server
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:4000` (see `vite.config.ts`).

## Build & run (production simulation)

```bash
# from repo root
npm ci
npm run build        # builds client into /dist
node server/index.js # serves API and static client on PORT (default 4000)
```

## Docker

Build and run a production container:

```bash
docker build -t buy-sell-geo .
docker run -e MONGO_URI="your-mongo-uri" -p 4000:4000 buy-sell-geo
```

The container runs `node server/index.js` and serves the built client from `/dist` when present.

## Deploying to Heroku / Railway / Render

- Ensure environment variables are set: `MONGO_URI`, `PORT`, and `JWT_SECRET`.
- The repo includes a `Procfile` (`web: node server/index.js`). The root `package.json` contains `postinstall` which runs the client build so platforms that run `npm install` will build the client before starting the server.

## Files added to support hosting

- `Dockerfile` — multi-stage build (builds client, then runs server).
- `.dockerignore` — files to exclude in Docker build context.
- `Procfile` — for Heroku-style platforms.
- Server now serves `/dist` if present (static SPA fallback).

## Next recommended steps

- Add a small health endpoint (e.g., `/healthz`) for platform readiness checks.
- Add GitHub Actions to build and run tests on push.
- Secure environment: set `JWT_SECRET` and production MongoDB URI in environment variables.

If you want, I can add a health endpoint and a GitHub Actions workflow next.
