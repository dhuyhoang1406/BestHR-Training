import { MigrationInterface, QueryRunner } from 'typeorm';

export class TodoUserFkCascade1752388200000 implements MigrationInterface {
  name = 'TodoUserFkCascade1752388200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todos" DROP CONSTRAINT IF EXISTS "FK_todos_user_id";
    `);

    await queryRunner.query(`
      DELETE FROM "todos" WHERE "user_id" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "todos"
        ALTER COLUMN "user_id" SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "todos"
        ADD CONSTRAINT "FK_todos_user_id"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todos" DROP CONSTRAINT IF EXISTS "FK_todos_user_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "todos"
        ALTER COLUMN "user_id" DROP NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "todos"
        ADD CONSTRAINT "FK_todos_user_id"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;
    `);
  }
}
