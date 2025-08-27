import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCoordinatesToProperties1755000000000 implements MigrationInterface {
  name = "AddCoordinatesToProperties1755000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if lat column exists
    const hasLatColumn = await queryRunner.hasColumn("properties", "lat");
    if (!hasLatColumn) {
      await queryRunner.addColumn(
        "properties",
        new TableColumn({
          name: "lat",
          type: "decimal",
          precision: 10,
          scale: 7,
          isNullable: true,
          comment: "Property latitude coordinate",
        })
      );
      console.log("Added lat field to properties table");
    } else {
      console.log("Lat field already exists in properties table");
    }

    // Check if lng column exists
    const hasLngColumn = await queryRunner.hasColumn("properties", "lng");
    if (!hasLngColumn) {
      await queryRunner.addColumn(
        "properties",
        new TableColumn({
          name: "lng",
          type: "decimal",
          precision: 10,
          scale: 7,
          isNullable: true,
          comment: "Property longitude coordinate",
        })
      );
      console.log("Added lng field to properties table");
    } else {
      console.log("Lng field already exists in properties table");
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if lat column exists before dropping
    const hasLatColumn = await queryRunner.hasColumn("properties", "lat");
    if (hasLatColumn) {
      await queryRunner.dropColumn("properties", "lat");
      console.log("Dropped lat field from properties table");
    } else {
      console.log("Lat field does not exist in properties table");
    }

    // Check if lng column exists before dropping
    const hasLngColumn = await queryRunner.hasColumn("properties", "lng");
    if (hasLngColumn) {
      await queryRunner.dropColumn("properties", "lng");
      console.log("Dropped lng field from properties table");
    } else {
      console.log("Lng field does not exist in properties table");
    }
  }
}
