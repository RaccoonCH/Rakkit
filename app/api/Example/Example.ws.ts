import { On } from "src/decorators/WS/On";
import { Socket } from "socket.io";

export class ExampleWS {
  @On("connection")
  Hello(socket: Socket) {
    socket.broadcast.emit("hi");
    console.log(`New connection ${socket.id}`);
  }

  @On("hello")
  Yo(socket: Socket, message: Object) {
    socket.emit("test", {
      message: socket.id
    });
    socket.send("yo");
  }
}
