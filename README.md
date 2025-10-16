## Surface Workflow Project

Minimal Next.js app with an events ingestion API and a simple dashboard API backed by Postgres (Prisma).

- Ingest events: `POST /api/events` accepts a batch with `workspaceId` and up to 20 events.
- Query events: `GET /api/dashboard/events` supports pagination and filters (e.g. `workspaceId`, `type`, `visitorId`, `startTime`, `endTime`).

### Built with

- Used and extended [shadcn/ui](https://ui.shadcn.com/) for the design system
- [Zod](https://zod.dev/) for input validation

### Requirements

- Node.js and pnpm
- Docker or Podman running
- `.env` with `DATABASE_URL` (Postgres). Example:

```
DATABASE_URL="postgres://postgres:password@localhost:5432/surface_workflow"
```

### Steps to test

- Clone the repo, and then run these in order:

```
pnpm install
./start-database.sh
pnpm db:push
pnpm dev
```

- With the app running (e.g., `http://localhost:3000`), open the dashboard, click `Install tag`, and copy the snippet.
- Open `index.html` in the project root and paste the snippet inside the `<head></head>` tags. (Check `example.html` for reference)
- Open `index.html` in your browser.
- After the page loads, return to the dashboard and click `Test connection`.
- On success, you'll see the `Next step` button. Click it to view events.

Notes:

- Ensure Docker/Podman is running before `./start-database.sh`.
- The script reads `DATABASE_URL` from `.env` and starts a local Postgres container.
