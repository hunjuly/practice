import { MigrationInterface, QueryRunner } from "typeorm";

export class mig11658578285595 implements MigrationInterface {
  name = "mig11658578285595";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`authentication\` (\`id\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`authentication\``);
  }
}
