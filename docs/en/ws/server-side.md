# Server-side
## Basic websocket class
```typescript
import { Websocket, On, Socket } from "rakkit";

@Websocket()
export class ExampleWs {
  @On("connection")
  connection(socket: Socket) {
    socket.emit("connected")
  }

  @On("hello")
  hello(socket: Socket, datas: Object) {
    socket.emit("world", datas)
  }
}
```
In this example, by calling the `hello` event from a socket.io client, the server will call the `world` event of the client and return the received data to it.

## Websocket class with namespace
_ExampleWs.ts_
```typescript
import { Websocket, On, Socket } from "rakkit";

@Websocket("nsp")
export class ExampleWs {
  @On("connection")
  connection(socket: Socket) {
    socket.emit("connected")
  }

  @On("hello")
  hello(socket: Socket, datas: Object) {
    socket.emit("world", datas)
  }
}
```

_App.ts_
```typescript
import { Rakkit } from "rakkit";
import { ExampleWs } from "./ExampleWs.ts";

Rakkit.start({
  websockets: [
    ExampleWs
  ],
  socketioOptions: {
    path: "/ws-server"
  }
});
```
