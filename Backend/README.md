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
| GET | `/todos?limit=5&page=1` | Offset-paginated todos (excludes archived) |
| POST | `/todos` | Create a todo |
| PATCH | `/todos/:id/status` | Update status (`PENDING` \| `IN_PROGRESS` \| `DONE`) |
| PATCH | `/todos/:id/archive` | Soft-delete (sets `deletedAt`) |
| POST | `/todos/bulk-delete` | Hard-delete many todos by ids (`204`) |

### Seed sample data

```bash
npm run seed
```

Inserts 24 sample todos when the table is empty (skips if data already exists).
