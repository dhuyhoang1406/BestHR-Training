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

- Offset pagination (`GET /todos` and `GET /todos/archived`)
- Active list `/` and Archive list `/?isArchived=true`
- Create todo with Zod + react-hook-form (`POST /todos` + `userId` / `categoryIds`)
- Detail `/todos/[id]`
- User todos `/users/[id]` (`GET /users/:id/todos` with categories)
- Update status / archive / restore / bulk delete
