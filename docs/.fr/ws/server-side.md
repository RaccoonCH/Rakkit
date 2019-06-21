# Server-side

## Classe websocket basique
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
Dans cet exemple, en appellant l'évenement `hello` depuis un client socket.io, le serveur va appeler l'évenement `world` du client et lui renvoyer les données reçues.

## Classe websocket avec namespace

#### Server-side
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
