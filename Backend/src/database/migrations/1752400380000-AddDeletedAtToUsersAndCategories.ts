import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToUsersAndCategories1752400380000
  implements MigrationInterface
{
  name = 'AddDeletedAtToUsersAndCategories1752400380000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;
    `);

    await queryRunner.query(`
      ALTER TABLE "categories"
        ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "categories"
        DROP COLUMN IF EXISTS "deleted_at";
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "deleted_at";
    `);
  }
}
