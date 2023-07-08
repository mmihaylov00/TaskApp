import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class DefaultUserMigration1688840647766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const password: string = await bcrypt.hash('password', salt);
    await queryRunner.query(
      `INSERT INTO "users" ("email", "password", "firstName", "lastName", "role") VALUES ('admin@task.app', $1, 'Admin', 'User', 'ADMIN')`,
      [password],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
