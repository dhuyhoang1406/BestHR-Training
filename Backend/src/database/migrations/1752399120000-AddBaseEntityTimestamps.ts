import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBaseEntityTimestamps1752399120000
  implements MigrationInterface
{
  name = 'AddBaseEntityTimestamps1752399120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "created_at" TYPE TIMESTAMPTZ
        USING "created_at" AT TIME ZONE 'UTC';
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now();
    `);

    await queryRunner.query(`
      ALTER TABLE "categories"
        ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "categories"
        DROP COLUMN IF EXISTS "updated_at",
        DROP COLUMN IF EXISTS "created_at";
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "updated_at";
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "created_at" TYPE TIMESTAMP
        USING "created_at" AT TIME ZONE 'UTC';
    `);
  }
}
