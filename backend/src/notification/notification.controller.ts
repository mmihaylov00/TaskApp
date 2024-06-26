import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { NotificationService } from './notification.service';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { PageParams } from '../decorator/page.decorator';
import { PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  listAll(
    @Authenticated() user: JwtUser,
    @PageParams() pageParams: PageRequestDto,
  ) {
    return this.notificationService.listAll(user, pageParams);
  }

  @Get('unread')
  async listUnread(@Authenticated() user: JwtUser) {
    return this.notificationService.listUnread(user);
  }

  @Get('count')
  count(@Authenticated() user: JwtUser) {
    return this.notificationService.count(user);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Authenticated() user: JwtUser, @Param('id') id: string) {
    await this.notificationService.delete(id, user);
  }

  @Get('/:id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(@Authenticated() user: JwtUser, @Param('id') id: string) {
    await this.notificationService.read(id, user);
  }
}
