import {
  On,
  Websocket,
  Socket
} from "../../../..";

@Websocket("my-room")
export class TestRoomWs {
  @On("connection")
  connection(socket: Socket) {
    socket.emit("room-connected");
  }

  @On("room-hello")
  hello(socket: Socket) {
    socket.emit("room-world");
  }

  @On("room-params")
  params(socket: Socket, params: { datas: boolean }) {
    socket.emit("room-params", {
      error: !params.datas
    });
  }
}
