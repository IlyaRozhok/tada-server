import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeRoleNullable1752670000000 implements MigrationInterface {
  name = "MakeRoleNullable1752670000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make roles column nullable and remove default
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roles" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: set default tenant for null roles first, then make NOT NULL
    await queryRunner.query(
      `UPDATE "users" SET "roles" = 'tenant' WHERE "roles" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roles" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT 'tenant'`
    );
  }
}
