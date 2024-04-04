CREATE SCHEMA IF NOT EXISTS taskapp;

CREATE TYPE "taskapp"."enum_Users_role" AS ENUM ('DEVELOPER', 'PROJECT_MANAGER', 'ADMIN');
CREATE TYPE "taskapp"."enum_Users_status" AS ENUM ('INVITED', 'ACTIVE', 'DISABLED');
CREATE TYPE "taskapp"."enum_Tasks_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE "taskapp"."Users"
(
    id               UUID                     NOT NULL PRIMARY KEY,
    email            VARCHAR(255) UNIQUE,
    password         VARCHAR(255),
    "firstName"      VARCHAR(255),
    "lastName"       VARCHAR(255),
    role             "enum_Users_role",
    "invitationLink" UUID,
    status           "enum_Users_status" DEFAULT 'INVITED'::"enum_Users_status",
    "invitedBy"      UUID,
    "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt"      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "taskapp"."Projects"
(
    id          UUID                     NOT NULL PRIMARY KEY,
    name        VARCHAR(255),
    color       VARCHAR(255),
    icon        VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "taskapp"."UserProjects"
(
    "userId"    UUID                     NOT NULL REFERENCES "taskapp"."Users" ON UPDATE CASCADE ON DELETE CASCADE,
    "projectId" UUID                     NOT NULL REFERENCES "taskapp"."Projects" ON UPDATE CASCADE ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("userId", "projectId")
);

CREATE TABLE "taskapp"."Boards"
(
    id            UUID                     NOT NULL PRIMARY KEY,
    name          VARCHAR(255),
    color         VARCHAR(255),
    archived      BOOLEAN,
    "projectId"   UUID REFERENCES "taskapp"."Projects" ON UPDATE CASCADE ON DELETE CASCADE,
    "stagesOrder" JSONB DEFAULT '[]'::JSONB,
    "createdAt"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt"   TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "taskapp"."Stages"
(
    id           UUID                     NOT NULL PRIMARY KEY,
    name         VARCHAR(255),
    color        VARCHAR(255),
    "boardId"    UUID REFERENCES "taskapp"."Boards" ON UPDATE CASCADE ON DELETE CASCADE,
    "tasksOrder" JSONB DEFAULT '[]'::JSONB,
    "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt"  TIMESTAMP WITH TIME ZONE,
    board_id     UUID                     REFERENCES "taskapp"."Boards" ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "taskapp"."Tasks"
(
    id          UUID NOT NULL PRIMARY KEY,
    name        VARCHAR(255),
    description JSONB,
    priority    "enum_Tasks_priority",
    "stageId"   UUID REFERENCES "taskapp"."Stages" ON UPDATE CASCADE ON DELETE CASCADE,
    "projectId" UUID REFERENCES "taskapp"."Projects" ON UPDATE CASCADE ON DELETE CASCADE,
    author      UUID REFERENCES "taskapp"."Users" ON UPDATE CASCADE ON DELETE CASCADE,
    assignee    UUID REFERENCES "taskapp"."Users" ON UPDATE CASCADE ON DELETE SET NULL,
    "updatedBy" UUID REFERENCES "taskapp"."Users" ON UPDATE CASCADE ON DELETE SET NULL,
    deadline    TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    deleted     BOOLEAN,
    completed   BOOLEAN,
    thumbnail   VARCHAR(255),
    uploader    UUID REFERENCES "taskapp"."Users" ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "taskapp"."Attachments"
(
    id        UUID NOT NULL
        PRIMARY KEY,
    name      VARCHAR(255),
    mime      VARCHAR(255),
    extension VARCHAR(255),
    uploader  UUID REFERENCES "taskapp"."Users" ON UPDATE CASCADE,
    "taskId"  UUID REFERENCES "taskapp"."Tasks" ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "taskapp"."Notifications"
(
    id          UUID NOT NULL PRIMARY KEY,
    message     VARCHAR(255),
    link        VARCHAR(255),
    read        BOOLEAN,
    deleted     BOOLEAN,
    "userId"    UUID REFERENCES "taskapp"."Users" ON UPDATE CASCADE ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX users_email ON "taskapp"."Users" (email);
CREATE INDEX user_project ON "taskapp"."UserProjects" ("userId", "projectId");
CREATE INDEX boards_archived ON "taskapp"."Boards" (archived);
CREATE INDEX stages_name ON "taskapp"."Stages" (name);
CREATE INDEX closed ON "taskapp"."Tasks" (deleted, completed);
CREATE INDEX tasks_deadline ON "taskapp"."Tasks" (deadline);
CREATE INDEX notifications_read ON "taskapp"."Notifications" (read);
CREATE INDEX notifications_deleted ON "taskapp"."Notifications" (deleted);
CREATE INDEX notifications_created_at ON "taskapp"."Notifications" ("createdAt");

