import { HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import {
  ALLOWED_MIME_TYPES,
  TASK_HEADER,
} from 'taskapp-common/dist/src/dto/attachment.dto';
import { diskStorage } from 'multer';
import { Attachment } from '../database/entity/attachment.entity';
import { createReadStream, mkdirSync, unlinkSync } from 'fs';
import { Task } from '../database/entity/task.entity';
import { User } from '../database/entity/user.entity';
import { Project } from '../database/entity/project.entity';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { TaskAppError } from '../error/task-app.error';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import type { Response } from 'express';
import { BoardService } from '../board/board.service';
import { Stage } from '../database/entity/stage.entity';

@Injectable()
export class AttachmentService {
  constructor(private readonly boardService: BoardService) {}

  async get(id: string, user: JwtUser, res: Response) {
    const attachment = await this.getAttachment(id, user);

    const file = createReadStream(
      `./attachments/${attachment.task.id}/${attachment.id}_${attachment.name}`,
    );
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${attachment.name}"`,
    });
    return new StreamableFile(file);
  }

  async delete(id: string, user: JwtUser) {
    const attachment = await this.getAttachment(id, user);

    const task = attachment.task;
    task.updatedAt = new Date();
    task.updatedBy = user.id;
    if (task.thumbnail === attachment.id) {
      task.thumbnail = null;
      this.boardService.sendMessage(
        task.stage.boardId,
        'thumbnail-updated',
        task.toThumbnailDto(),
      );
      this.boardService.sendMessage(
        task.stage.boardId,
        'task-updated',
        task.toDto(),
      );
    }

    try {
      unlinkSync(
        `./attachments/${task.id}/${attachment.id}_${attachment.name}`,
      );
    } catch (_) {}
    await attachment.destroy();
    await task.save();
  }

  private async getAttachment(id: string, user: JwtUser) {
    const attachment = await Attachment.findByPk(id, {
      include: [
        { model: Task, include: [{ model: Project, include: [User] }, Stage] },
      ],
    });
    if (!attachment) {
      throw new TaskAppError('attachment_not_found', HttpStatus.NOT_FOUND);
    }

    if (
      user &&
      user.role != Role.ADMIN &&
      !this.isPartOfProject(user, attachment.task.project)
    ) {
      throw new TaskAppError('no_access', HttpStatus.FORBIDDEN);
    }
    return attachment;
  }

  public isPartOfProject(user: JwtUser, project: Project) {
    return project.users?.some((u) => (u.id = user.id));
  }

  static readonly UPLOAD_OPTIONS = {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (!file.mimetype.match(ALLOWED_MIME_TYPES)) {
          return;
        }

        const dir = `./attachments/${req.header(TASK_HEADER)}/`;
        mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: async (req, file, cb) => {
        if (!file.mimetype.match(ALLOWED_MIME_TYPES)) {
          return;
        }
        const taskId = req.header(TASK_HEADER);

        const task = await Task.findByPk(taskId, {
          include: [{ model: Project, include: [User] }, Stage],
        });
        if (!task) {
          return;
        }

        const userId = req.user['id'];
        const index = task.project.users.findIndex((u) => u.id === userId);
        if (index === -1) {
          return;
        }

        const filenameSplit = file.originalname.split('.');
        const attachment = await Attachment.create({
          name: file.originalname,
          mime: file.mimetype,
          extension: filenameSplit[filenameSplit.length - 1],
          taskId: taskId,
          uploader: userId,
        });

        task.updatedAt = new Date();
        task.updatedBy = userId;
        if (!task.thumbnail && file.mimetype.match(/image\/.+/)) {
          task.thumbnail = attachment.id;
          req['thumbnail'] = attachment.id;
          req['boardId'] = task.stage.boardId;
        }
        await task.save();

        cb(null, `${attachment.id}_${file.originalname}`);
      },
    }),
  };
}
