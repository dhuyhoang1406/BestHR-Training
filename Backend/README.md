# Backend (NestJS)

REST API on port **3001** with TypeORM + PostgreSQL.

## Setup

```bash
docker compose up -d
cp .env.example .env
npm install
npm run migration:run
npm run start:dev
```

### Migrations

Reset/create schema from entities (`users`, `categories`, `todos`, `todo_categories`):

```bash
npm run migration:run
npm run migration:show
npm run migration:revert
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/todos?limit=5&page=1` | Offset-paginated active todos (+ user, categories) |
| GET | `/todos?isArchived=true&limit=5&page=1` | Offset-paginated archived todos |
| GET | `/todos/:id` | Todo detail (includes archived) |
| POST | `/todos` | Create todo + categories in one transaction (`201`) |
| PATCH | `/todos/:id/status` | Update status (`PENDING` \| `IN_PROGRESS` \| `DONE`) |
| PATCH | `/todos/:id/archive` | Soft-delete (sets `deletedAt`) |
| PATCH | `/todos/:id/restore` | Restore an archived todo |
| POST | `/todos/bulk-delete` | Hard-delete many todos by ids (`204`) |
| GET | `/users` | List users |
| GET | `/users/:id/todos?status=` | User todos with categories (single JOIN query) |
| GET | `/categories` | List categories |

### Create todo body

```json
{
  "title": "Buy milk",
  "description": "optional",
  "userId": "uuid",
  "categoryIds": ["uuid-1", "uuid-2"]
}
```

### Seed sample data

```bash
npm run seed
```

Seeds demo user (`demo@besthr.local`), categories, and 24 todos (skips todos if any already exist).
