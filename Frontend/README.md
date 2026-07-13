# Frontend (Next.js)

Simple Todo UI for the NestJS backend on port **3001**.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

App runs at http://localhost:3000

## Features

- Offset pagination (`GET /todos?limit=&page=&isArchived=`)
- Active list `/` and Archive list `/?isArchived=true`
- Detail `/todos/[id]` (`GET /todos/:id`)
- Update status (`PATCH /todos/:id/status`)
- Archive / soft-delete (`PATCH /todos/:id/archive`)
- Bulk hard-delete (`POST /todos/bulk-delete`)
