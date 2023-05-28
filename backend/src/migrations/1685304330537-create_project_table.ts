import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTable1685304330537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_users" ("projectId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_180c5df4197aae759c30784f7e1" PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1905d9d76173d09c07ba1f0cd8" ON "project_users" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ebc83af455ff1ed9573c823e2" ON "project_users" ("userId") `);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_1905d9d76173d09c07ba1f0cd84" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_6ebc83af455ff1ed9573c823e23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_6ebc83af455ff1ed9573c823e23"`);
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_1905d9d76173d09c07ba1f0cd84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ebc83af455ff1ed9573c823e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1905d9d76173d09c07ba1f0cd8"`);
        await queryRunner.query(`DROP TABLE "project_users"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
