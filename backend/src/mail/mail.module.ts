import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import configuration from '../config/configuration';

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
      defaults: {
        from: '"From Name" <client@task.app>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
