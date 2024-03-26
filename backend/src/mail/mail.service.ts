import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { OnEvent } from '@nestjs/event-emitter';
import configuration from '../config/configuration';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user.invitation')
  async sendInvitation(data: {
    user: UserDetailsDto;
    invitationLink: string;
    invitedBy: UserDetailsDto;
  }) {
    const invitationLink = `${configuration().frontend_url}/invitation/${
      data.invitationLink
    }`;
    let name = `${data.user.firstName} ${data.user.lastName}`.trim();
    if (name.length) {
      name = `, ${name}`;
    }
    await this.mailerService.sendMail({
      to: data.user.email,
      subject: 'TaskApp Invitation',
      template: './user-invitation',
      context: {
        name,
        invitedBy: `${data.invitedBy.firstName} ${data.invitedBy.lastName}`,
        invitationLink,
      },
    });
  }

  @OnEvent('user.notification')
  async sendNotification(data: {
    receiver: string;
    title: string;
    message: string;
    button?: string;
    link?: string;
  }) {
    await this.mailerService.sendMail({
      to: data.receiver,
      subject: 'TaskApp: ' + data.title,
      template: './user-notification',
      context: {
        title: data.title,
        message: data.message,
        button: data.button,
        link: data.link,
      },
    });
  }
}
