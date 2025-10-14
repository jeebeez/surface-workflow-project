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

### Run locally

Run these in order:

```
pnpm install
./start-database.sh
pnpm db:push
pnpm dev
```

Notes:

- Ensure Docker/Podman is running before `./start-database.sh`.
- The script reads `DATABASE_URL` from `.env` and starts a local Postgres container.
