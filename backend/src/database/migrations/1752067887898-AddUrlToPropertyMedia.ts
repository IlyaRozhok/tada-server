import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlToPropertyMedia1752067887898 implements MigrationInterface {
  name = "AddUrlToPropertyMedia1752067887898";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column already exists before adding it
    const hasUrlColumn = await queryRunner.hasColumn("property_media", "url");
    if (!hasUrlColumn) {
      await queryRunner.query(
        `ALTER TABLE "property_media" ADD "url" character varying NOT NULL`
      );
    } else {
      console.log("URL column already exists in property_media table");
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists before dropping it
    const hasUrlColumn = await queryRunner.hasColumn("property_media", "url");
    if (hasUrlColumn) {
      await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "url"`);
    } else {
      console.log("URL column does not exist in property_media table");
    }
  }
}
