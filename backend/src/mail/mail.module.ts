import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import configuration from '../config/configuration';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: configuration().mail.host,
        port: configuration().mail.port,
        secure: true,
        auth: {
          user: configuration().mail.user,
          pass: configuration().mail.password,
        },
      },
      template: {
        dir: join(__dirname, '..', '..', 'mail', 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    NotificationModule,
  ],
  providers: [MailService, NotificationService],
})
export class MailModule {}
