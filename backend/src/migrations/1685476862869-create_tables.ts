import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1685476862869 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "boards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying NOT NULL, "projectId" uuid, CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying NOT NULL, "tasksOrder" json NOT NULL, "boardId" uuid, CONSTRAINT "PK_16efa0f8f5386328944769b9e6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "priority" "public"."tasks_priority_enum", "deadline" date, "stageId" uuid, "authorId" uuid, "assigneeId" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying NOT NULL, CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_users" ("projectsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_5da8dcbd4670a630f026951796a" PRIMARY KEY ("projectsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f85de63d78d882b8dfb7f82b1e" ON "project_users" ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f9195fdfbbf029e8509d152f52" ON "project_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "enabled" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "invitationLink" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "invitedById" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_446a800a0dc374a54f98f1ef5c4" UNIQUE ("invitedById")`);
        await queryRunner.query(`ALTER TABLE "boards" ADD CONSTRAINT "FK_074efe1a079786d8c076bf00fff" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stages" ADD CONSTRAINT "FK_a05774bdbc213fdbfe55fe4ea74" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_32af4d782a7656a3b2526259c61" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_b455b2f078b9a28bda8e7b3696a" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9a16d2c86252529f622fa53f1e3" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_446a800a0dc374a54f98f1ef5c4" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_f85de63d78d882b8dfb7f82b1e7" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_f9195fdfbbf029e8509d152f529" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_f9195fdfbbf029e8509d152f529"`);
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_f85de63d78d882b8dfb7f82b1e7"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_446a800a0dc374a54f98f1ef5c4"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9a16d2c86252529f622fa53f1e3"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_b455b2f078b9a28bda8e7b3696a"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_32af4d782a7656a3b2526259c61"`);
        await queryRunner.query(`ALTER TABLE "stages" DROP CONSTRAINT "FK_a05774bdbc213fdbfe55fe4ea74"`);
        await queryRunner.query(`ALTER TABLE "boards" DROP CONSTRAINT "FK_074efe1a079786d8c076bf00fff"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_446a800a0dc374a54f98f1ef5c4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "invitedById"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "invitationLink"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "enabled"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9195fdfbbf029e8509d152f52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f85de63d78d882b8dfb7f82b1e"`);
        await queryRunner.query(`DROP TABLE "project_users"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TABLE "stages"`);
        await queryRunner.query(`DROP TABLE "boards"`);
    }

}
