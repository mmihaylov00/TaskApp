import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  TASK_HEADER,
  ThumbnailUpdatedDto,
  UploadAttachmentDto,
} from 'taskapp-common/dist/src/dto/attachment.dto';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import type { Response } from 'express';
import { BoardService } from '../board/board.service';

@Controller('attachments')
@UseGuards(JwtGuard)
export class AttachmentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly boardService: BoardService,
  ) {}

  private static readonly PARSE_FILE_PIPE = new ParseFilePipe({
    validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 })],
  });

  @Post()
  @UseInterceptors(FileInterceptor('file', AttachmentService.UPLOAD_OPTIONS))
  async uploadFile(
    @Authenticated() user: JwtUser,
    @UploadedFile(AttachmentController.PARSE_FILE_PIPE)
    file: Express.Multer.File,
    @Req() req: any,
    @Body() body: UploadAttachmentDto,
  ) {
    if (req['thumbnail']) {
      const taskId = req.header(TASK_HEADER);
      this.boardService.sendMessage(req['boardId'], 'thumbnail-updated', <
        ThumbnailUpdatedDto
      >{ taskId, thumbnail: req['thumbnail'] });
    }
  }

  @Get('/:id')
  async get(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.attachmentService.get(id, user, res);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Authenticated() user: JwtUser, @Param('id') id: string) {
    await this.attachmentService.delete(id, user);
  }
}
