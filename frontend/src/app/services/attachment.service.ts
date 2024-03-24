import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TASK_HEADER } from 'taskapp-common/dist/src/dto/attachment.dto';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  constructor(private readonly http: HttpClient) {}

  get(attachmentId: string) {
    return this.http.get<Blob>('attachments/' + attachmentId, {
      responseType: 'blob' as 'json',
    });
  }

  upload(file: File, extension: string, taskId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('extension', extension);
    formData.append('taskId', taskId);
    return this.http.post<void>('attachments', formData, {
      headers: { [TASK_HEADER]: taskId },
    });
  }

  delete(attachmentId: string) {
    return this.http.delete<void>('attachments/' + attachmentId);
  }
}
