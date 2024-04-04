CREATE TYPE "enum_Users_role" AS ENUM ('DEVELOPER', 'PROJECT_MANAGER', 'ADMIN');
CREATE TYPE "enum_Users_status" AS ENUM ('INVITED', 'ACTIVE', 'DISABLED');
CREATE TYPE "enum_Tasks_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE "Users"
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

CREATE TABLE "Projects"
(
    id          UUID                     NOT NULL PRIMARY KEY,
    name        VARCHAR(255),
    color       VARCHAR(255),
    icon        VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "UserProjects"
(
    "userId"    UUID                     NOT NULL REFERENCES "Users" ON UPDATE CASCADE ON DELETE CASCADE,
    "projectId" UUID                     NOT NULL REFERENCES "Projects" ON UPDATE CASCADE ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("userId", "projectId")
);

CREATE TABLE "Boards"
(
    id            UUID                     NOT NULL PRIMARY KEY,
    name          VARCHAR(255),
    color         VARCHAR(255),
    archived      BOOLEAN,
    "projectId"   UUID REFERENCES "Projects" ON UPDATE CASCADE ON DELETE CASCADE,
    "stagesOrder" JSONB DEFAULT '[]'::JSONB,
    "createdAt"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt"   TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "Stages"
(
    id           UUID                     NOT NULL PRIMARY KEY,
    name         VARCHAR(255),
    color        VARCHAR(255),
    "boardId"    UUID REFERENCES "Boards" ON UPDATE CASCADE ON DELETE CASCADE,
    "tasksOrder" JSONB DEFAULT '[]'::JSONB,
    "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt"  TIMESTAMP WITH TIME ZONE,
    board_id     UUID                     REFERENCES "Boards" ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "Tasks"
(
    id          UUID NOT NULL PRIMARY KEY,
    name        VARCHAR(255),
    description JSONB,
    priority    "enum_Tasks_priority",
    "stageId"   UUID REFERENCES "Stages" ON UPDATE CASCADE ON DELETE CASCADE,
    "projectId" UUID REFERENCES "Projects" ON UPDATE CASCADE ON DELETE CASCADE,
    author      UUID REFERENCES "Users" ON UPDATE CASCADE ON DELETE CASCADE,
    assignee    UUID REFERENCES "Users" ON UPDATE CASCADE ON DELETE SET NULL,
    "updatedBy" UUID REFERENCES "Users" ON UPDATE CASCADE ON DELETE SET NULL,
    deadline    TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE,
    deleted     BOOLEAN,
    completed   BOOLEAN,
    thumbnail   VARCHAR(255),
    uploader    UUID REFERENCES "Users" ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "Attachments"
(
    id        UUID NOT NULL
        PRIMARY KEY,
    name      VARCHAR(255),
    mime      VARCHAR(255),
    extension VARCHAR(255),
    uploader  UUID REFERENCES "Users" ON UPDATE CASCADE,
    "taskId"  UUID REFERENCES "Tasks" ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "Notifications"
(
    id          UUID NOT NULL PRIMARY KEY,
    message     VARCHAR(255),
    link        VARCHAR(255),
    read        BOOLEAN,
    deleted     BOOLEAN,
    "userId"    UUID REFERENCES "Users" ON UPDATE CASCADE ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX users_email ON "Users" (email);
CREATE INDEX user_project ON "UserProjects" ("userId", "projectId");
CREATE INDEX boards_archived ON "Boards" (archived);
CREATE INDEX stages_name ON "Stages" (name);
CREATE INDEX closed ON "Tasks" (deleted, completed);
CREATE INDEX tasks_deadline ON "Tasks" (deadline);
CREATE INDEX notifications_read ON "Notifications" (read);
CREATE INDEX notifications_deleted ON "Notifications" (deleted);
CREATE INDEX notifications_created_at ON "Notifications" ("createdAt");
