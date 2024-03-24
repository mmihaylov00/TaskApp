export interface UploadAttachmentDto {
  taskId: string;
  extension: string;
}

export interface AttachmentDataDto {
  id: string;
  name: string;
  extension: string;
  mime: string;
}

export interface ThumbnailUpdatedDto {
  taskId: string;
  thumbnail: string;
}

export const TASK_HEADER = 'X-Task-ID';
export const ALLOWED_MIME_TYPES =
  /image\/.+|doc|rar|7z|xml|application\/msword|csv|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/x-zip-compressed/;
