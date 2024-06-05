import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { NotificationService } from '../notification/notification.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway implements OnGatewayDisconnect {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer() io: Server;

  @SubscribeMessage('notification')
  handleEvent(
    @MessageBody() data: { token: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = new JwtUser(this.authService.decodeToken(data.token));
    if (!user) {
      client.disconnect();
      return;
    }
    client['userId'] = user.id;
    NotificationService.users[user.id] = client;
  }

  handleDisconnect(client: Socket) {
    delete NotificationService.users[client['userId']];
  }
}
