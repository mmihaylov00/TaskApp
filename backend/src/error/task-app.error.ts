import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';

export class TaskAppError extends HttpException {

  constructor(message: string | Record<string, any>, code: HttpStatus, cause?: Error) {
    super(message, code, { cause });
  }
}
