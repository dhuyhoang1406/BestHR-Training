# Backend (NestJS)

REST API on port **3001** with TypeORM + PostgreSQL.

## Setup

```bash
docker compose up -d
cp .env.example .env
npm install
npm run start:dev
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/todos?limit=5&page=1` | Offset-paginated active todos |
| GET | `/todos?isArchived=true&limit=5&page=1` | Offset-paginated archived todos |
| GET | `/todos/:id` | Todo detail (includes archived) |
| POST | `/todos` | Create a todo |
| PATCH | `/todos/:id/status` | Update status (`PENDING` \| `IN_PROGRESS` \| `DONE`) |
| PATCH | `/todos/:id/archive` | Soft-delete (sets `deletedAt`) |
| PATCH | `/todos/:id/restore` | Restore an archived todo |
| POST | `/todos/bulk-delete` | Hard-delete many todos by ids (`204`) |

### Seed sample data

```bash
npm run seed
```

Inserts 24 sample todos when the table is empty (skips if data already exists).
