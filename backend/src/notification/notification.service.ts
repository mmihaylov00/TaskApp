import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { Notification } from '../database/entity/notification.entity';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { NotificationDto } from 'taskapp-common/dist/src/dto/notification.dto';

@Injectable()
export class NotificationService {
  static users: { [userId: string]: Socket } = {};

  async count(user: JwtUser) {
    const count = await Notification.count({
      where: { userId: user.id, read: null },
    });
    return { count };
  }

  async listUnread(user: JwtUser) {
    const notifications = await Notification.findAll({
      where: { userId: user.id, read: null, deleted: null },
      order: [['createdAt', 'DESC']],
    });
    await Notification.update(
      { read: true },
      { where: { userId: user.id, read: null } },
    );
    return notifications.map((n) => n.toDto());
  }

  async listAll(user: JwtUser, page: PageRequestDto) {
    const { count, rows } = await Notification.findAndCountAll(
      Page.paged(
        {
          where: { userId: user.id, deleted: null },
          order: [['createdAt', 'DESC']],
        },
        page,
      ),
    );

    return Page.getPageData<Notification, NotificationDto>(
      rows,
      page,
      count,
      (notification) => notification.toDto(),
    );
  }

  async delete(id: string, user: JwtUser) {
    await Notification.update(
      { deleted: true },
      { where: { id, userId: user.id } },
    );
  }

  async read(id: string, user: JwtUser) {
    await Notification.update(
      { read: true },
      { where: { id, userId: user.id } },
    );
  }

  async sendNotification(receiverId: string, message: string, link: string) {
    const notification = await Notification.create({
      message: message,
      link: link,
      userId: receiverId,
    });
    const user = NotificationService.users[receiverId];
    if (!user) {
      return;
    }

    user.emit('notification-received', { message, link, id: notification.id });
  }
}
