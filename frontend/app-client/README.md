# Next.js Boilerplate

This is a Next.js (App Router) v16.1.1 frontend.

## Quick start

Install dependencies and run the dev server:

```bash
cd frontend/app-client
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Environment**

Add an `.env.local` with your API base (used by client-side fetches):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Optionally set `DJANGO_API_URL` as a server-only env if your deployment provides a different internal URL for server-side fetches.


## Build & deploy

- Development: `npm run dev`
- Production build: `npm run build` and `npm run start`
- Vercel: Deploy the `frontend/app-client` project on Vercel (it will automatically detect Next.js).
