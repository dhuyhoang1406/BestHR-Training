import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResetSchemaUsersCategoriesTodos1752387120000
  implements MigrationInterface
{
  name = 'ResetSchemaUsersCategoriesTodos1752387120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "todo_categories" CASCADE;
      DROP TABLE IF EXISTS "todos" CASCADE;
      DROP TABLE IF EXISTS "categories" CASCADE;
      DROP TABLE IF EXISTS "users" CASCADE;
      DROP TYPE IF EXISTS "todos_status_enum" CASCADE;
    `);

    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    await queryRunner.query(`
      CREATE TYPE "todos_status_enum" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "display_name" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "color" character varying NOT NULL DEFAULT '#94a3b8',
        CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "todos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "status" "todos_status_enum" NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        "user_id" uuid,
        CONSTRAINT "PK_todos_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_todos_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "todo_categories" (
        "todo_id" uuid NOT NULL,
        "category_id" uuid NOT NULL,
        CONSTRAINT "PK_todo_categories" PRIMARY KEY ("todo_id", "category_id"),
        CONSTRAINT "FK_todo_categories_todo_id"
          FOREIGN KEY ("todo_id") REFERENCES "todos"("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_todo_categories_category_id"
          FOREIGN KEY ("category_id") REFERENCES "categories"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_todo_categories_todo_id"
        ON "todo_categories" ("todo_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_todo_categories_category_id"
        ON "todo_categories" ("category_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "todo_categories" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "todos" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "todos_status_enum" CASCADE;`);
  }
}
