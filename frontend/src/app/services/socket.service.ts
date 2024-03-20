import { environment } from '../../environments/environment';
import { io } from 'socket.io-client';

export abstract class SocketService {
  protected socket = io(`${environment.backendUrl}`);

  subscribe<T>(room: string, body: any) {
    const token = localStorage.getItem('token');

    this.socket.emit(room, { ...body, token });
  }
}
