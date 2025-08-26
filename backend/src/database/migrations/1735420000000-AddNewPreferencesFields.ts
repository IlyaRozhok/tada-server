import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewPreferencesFields1735420000000
  implements MigrationInterface
{
  name = "AddNewPreferencesFields1735420000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding them
    const hasMaxBedrooms = await queryRunner.hasColumn(
      "preferences",
      "max_bedrooms"
    );
    if (!hasMaxBedrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" ADD "max_bedrooms" integer`
      );
    }

    const hasMaxBathrooms = await queryRunner.hasColumn(
      "preferences",
      "max_bathrooms"
    );
    if (!hasMaxBathrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" ADD "max_bathrooms" integer`
      );
    }

    const hasBuildingStyle = await queryRunner.hasColumn(
      "preferences",
      "building_style"
    );
    if (!hasBuildingStyle) {
      await queryRunner.query(
        `ALTER TABLE "preferences" ADD "building_style" text`
      );
    }

    const hasDesignerFurniture = await queryRunner.hasColumn(
      "preferences",
      "designer_furniture"
    );
    if (!hasDesignerFurniture) {
      await queryRunner.query(
        `ALTER TABLE "preferences" ADD "designer_furniture" boolean`
      );
    }

    const hasHouseShares = await queryRunner.hasColumn(
      "preferences",
      "house_shares"
    );
    if (!hasHouseShares) {
      await queryRunner.query(
        `ALTER TABLE "preferences" ADD "house_shares" character varying`
      );
    }

    const hasDatePropertyAdded = await queryRunner.hasColumn(
      "preferences",
      "date_property_added"
    );
    if (!hasDatePropertyAdded) {
      await queryRunner.query(
        `ALTER TABLE "preferences" ADD "date_property_added" character varying`
      );
    }

    // Check if columns exist before renaming them
    const hasBedrooms = await queryRunner.hasColumn("preferences", "bedrooms");
    if (hasBedrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" RENAME COLUMN "bedrooms" TO "min_bedrooms"`
      );
    }

    const hasBathrooms = await queryRunner.hasColumn(
      "preferences",
      "bathrooms"
    );
    if (hasBathrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" RENAME COLUMN "bathrooms" TO "min_bathrooms"`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before renaming them back
    const hasMinBathrooms = await queryRunner.hasColumn(
      "preferences",
      "min_bathrooms"
    );
    if (hasMinBathrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" RENAME COLUMN "min_bathrooms" TO "bathrooms"`
      );
    }

    const hasMinBedrooms = await queryRunner.hasColumn(
      "preferences",
      "min_bedrooms"
    );
    if (hasMinBedrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" RENAME COLUMN "min_bedrooms" TO "bedrooms"`
      );
    }

    // Check if columns exist before removing them
    const hasDatePropertyAdded = await queryRunner.hasColumn(
      "preferences",
      "date_property_added"
    );
    if (hasDatePropertyAdded) {
      await queryRunner.query(
        `ALTER TABLE "preferences" DROP COLUMN "date_property_added"`
      );
    }

    const hasHouseShares = await queryRunner.hasColumn(
      "preferences",
      "house_shares"
    );
    if (hasHouseShares) {
      await queryRunner.query(
        `ALTER TABLE "preferences" DROP COLUMN "house_shares"`
      );
    }

    const hasDesignerFurniture = await queryRunner.hasColumn(
      "preferences",
      "designer_furniture"
    );
    if (hasDesignerFurniture) {
      await queryRunner.query(
        `ALTER TABLE "preferences" DROP COLUMN "designer_furniture"`
      );
    }

    const hasBuildingStyle = await queryRunner.hasColumn(
      "preferences",
      "building_style"
    );
    if (hasBuildingStyle) {
      await queryRunner.query(
        `ALTER TABLE "preferences" DROP COLUMN "building_style"`
      );
    }

    const hasMaxBathrooms = await queryRunner.hasColumn(
      "preferences",
      "max_bathrooms"
    );
    if (hasMaxBathrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" DROP COLUMN "max_bathrooms"`
      );
    }

    const hasMaxBedrooms = await queryRunner.hasColumn(
      "preferences",
      "max_bedrooms"
    );
    if (hasMaxBedrooms) {
      await queryRunner.query(
        `ALTER TABLE "preferences" DROP COLUMN "max_bedrooms"`
      );
    }
  }
}
