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
import { BoardService } from '../board/board.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class BoardGateway implements OnGatewayDisconnect {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer() io: Server;

  @SubscribeMessage('board')
  handleEvent(
    @MessageBody() data: { token: string; boardId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = new JwtUser(this.authService.decodeToken(data.token));
    if (!user) {
      client.disconnect();
      return;
    }
    client['boardId'] = data.boardId;
    client['userId'] = user.id;

    let board = BoardService.boards[data.boardId];
    if (!board) board = new Set();
    board.add(client);

    BoardService.boards[data.boardId] = board;
  }

  handleDisconnect(client: Socket) {
    BoardService.boards[client['boardId']]?.delete(client);
  }
}
