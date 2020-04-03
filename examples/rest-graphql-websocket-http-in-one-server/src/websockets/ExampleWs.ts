import { Inject, On, Socket, Websocket } from "rakkit";
import { ExampleService } from "src/services/ExampleService";

@Websocket()
export class ExampleWs {
  @Inject()
  private _exampleService: ExampleService;

  @On("connection")
  connection(socket: Socket) {
    this._exampleService.Connections.push(socket);
    console.log(`Socket ${socket.id} connected`);
  }

  @On("hello")
  yo(socket: Socket) {
    socket.emit("world");
  }

  @On("disconnect")
  disconnect(socket: Socket) {
    console.log(`Socket ${socket.id} disconnected`);
  }
}
