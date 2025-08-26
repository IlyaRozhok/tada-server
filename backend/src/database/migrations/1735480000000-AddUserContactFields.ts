import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserContactFields1735480000000 implements MigrationInterface {
  name = "AddUserContactFields1735480000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if phone field exists before adding it
    const hasPhoneColumn = await queryRunner.hasColumn("users", "phone");
    if (!hasPhoneColumn) {
      await queryRunner.addColumn(
        "users",
        new TableColumn({
          name: "phone",
          type: "varchar",
          isNullable: true,
          comment: "User phone number",
        })
      );
      console.log("Added phone field to users table");
    } else {
      console.log("Phone field already exists in users table");
    }

    // Check if date_of_birth field exists before adding it
    const hasDateOfBirthColumn = await queryRunner.hasColumn("users", "date_of_birth");
    if (!hasDateOfBirthColumn) {
      await queryRunner.addColumn(
        "users",
        new TableColumn({
          name: "date_of_birth",
          type: "date",
          isNullable: true,
          comment: "User date of birth",
        })
      );
      console.log("Added date_of_birth field to users table");
    } else {
      console.log("Date of birth field already exists in users table");
    }

    // Check if nationality field exists before adding it
    const hasNationalityColumn = await queryRunner.hasColumn("users", "nationality");
    if (!hasNationalityColumn) {
      await queryRunner.addColumn(
        "users",
        new TableColumn({
          name: "nationality",
          type: "varchar",
          isNullable: true,
          comment: "User nationality",
        })
      );
      console.log("Added nationality field to users table");
    } else {
      console.log("Nationality field already exists in users table");
    }

    console.log(
      "Completed checking/adding phone, date_of_birth, and nationality fields to users table"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if nationality field exists before removing it
    const hasNationalityColumn = await queryRunner.hasColumn("users", "nationality");
    if (hasNationalityColumn) {
      await queryRunner.dropColumn("users", "nationality");
      console.log("Removed nationality field from users table");
    } else {
      console.log("Nationality field does not exist in users table");
    }

    // Check if date_of_birth field exists before removing it
    const hasDateOfBirthColumn = await queryRunner.hasColumn("users", "date_of_birth");
    if (hasDateOfBirthColumn) {
      await queryRunner.dropColumn("users", "date_of_birth");
      console.log("Removed date_of_birth field from users table");
    } else {
      console.log("Date of birth field does not exist in users table");
    }

    // Check if phone field exists before removing it
    const hasPhoneColumn = await queryRunner.hasColumn("users", "phone");
    if (hasPhoneColumn) {
      await queryRunner.dropColumn("users", "phone");
      console.log("Removed phone field from users table");
    } else {
      console.log("Phone field does not exist in users table");
    }

    console.log(
      "Completed checking/removing phone, date_of_birth, and nationality fields from users table"
    );
  }
}
