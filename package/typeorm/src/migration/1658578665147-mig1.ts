import { MigrationInterface, QueryRunner } from "typeorm";

export class mig11658578665147 implements MigrationInterface {
  name = "mig11658578665147";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` RENAME COLUMN \`lastName\` TO \`famillyName\``
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`midName\` varchar(255) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` RENAME COLUMN \`famillyName\` TO \`lastName\``
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`midName\``);
  }
}
