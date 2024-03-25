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
    invitationLink;
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
}
