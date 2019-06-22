import {
  On,
  Websocket,
  Socket
} from "../../../..";

@Websocket()
export class TestWs {
  @On("connection")
  connection(socket: Socket) {
    socket.emit("connected");
  }

  @On("hello")
  hello(socket: Socket) {
    socket.emit("world");
  }

  @On("params")
  params(socket: Socket, params: { datas: boolean }) {
    socket.emit("params", {
      error: !params.datas
    });
  }
}
