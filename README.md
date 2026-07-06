# Modular Form Creator — Frontend Solution

React frontend for the Resources Management workflow (draft modules, provisioning, and completed-resource editing).

## Prerequisites

- Node.js (LTS recommended)
- Docker (for the backend)

## Running the application

### Backend

From the repository root:

```bash
docker compose up -d
```

API documentation (Swagger): [http://localhost:5001/docs](http://localhost:5001/docs)

### Frontend

From the repository root:

```bash
npm install
npm run dev
```

Optional: copy `.env.example` to `.env` if you need a non-default API URL. The default is `http://localhost:5001`.

## URLs

| Service  | URL |
| -------- | --- |
| Frontend | [http://localhost:5173](http://localhost:5173) |
| Backend  | [http://localhost:5001](http://localhost:5001) |
| Swagger  | [http://localhost:5001/docs](http://localhost:5001/docs) |

## Manual verification

1. Open [http://localhost:5173/resources](http://localhost:5173/resources) and create a resource (name only).
2. Open **Basic Info**, fill required fields, and save (draft PATCH).
3. Open **Project Details**, fill required fields, and save (draft PATCH).
4. From the resource overview, **Provision resource** (available only when both modules are complete).
5. Edit the completed resource in **Basic Info** or **Project Details** — changes are held in temporary in-memory state (no immediate backend save).
6. Use **Persist changes to server** to confirm and send a full update (PUT).
7. Before step 6, refresh the page: unsaved buffer changes should be lost; only persisted server data remains.

## Implementation notes

- **Unchanged areas:** backend code and design system source (`src/design-system/`) were not modified.
- **Draft resources:** module saves use `PATCH /api/resources/{id}/basic-info` and `PATCH /api/resources/{id}/project-details`.
- **Completed resources:** edits are buffered in React in-memory state; persistence uses `PUT /api/resources/{id}` with the full resource payload after explicit confirmation. No `localStorage`, `sessionStorage`, or IndexedDB.
- **Project Details (draft):** locked until Basic Info is complete.
- **Resource name:** set at creation; cannot be changed afterward.

## Quality checks

```bash
npm run lint
npm run build
```

## Routes

| Path | Purpose |
| ---- | ------- |
| `/resources` | List and create resources |
| `/resources/:resourceId` | Overview, module progress, provisioning |
| `/resources/:resourceId/basic-info` | Basic Info module |
| `/resources/:resourceId/project-details` | Project Details module |
| `/resources/:resourceId/details` | Read-only summary |

Backend API details: [backend/README.md](backend/README.md)
