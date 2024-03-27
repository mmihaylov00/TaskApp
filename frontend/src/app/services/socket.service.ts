import { environment } from '../../environments/environment';
import { io } from 'socket.io-client';

export abstract class SocketService {
  protected socket = io(`${environment.backendUrl}`);
  protected events: Set<string> = new Set();

  subscribe<T>(
    room: string,
    subscribe: { [key: string]: (data: any) => void },
    body?: any,
  ) {
    const token = localStorage.getItem('token');

    this.socket.emit(room, { ...body, token });

    for (const key of Object.keys(subscribe)) {
      this.events.add(key);
      this.socket.on(key, subscribe[key]);
    }
  }

  unsubscribe() {
    for (const key of this.events) {
      this.socket.off(key);
    }
  }
}
