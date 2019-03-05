# Websocket
They are based on the same operation as those of [socket.io](https://socket.io). You can, therefore, if necessary, refer to their documentation.

#### Basic notions
**Websocket decorator**  
**`@Websocket(namespace?: string)`**  
- It **decorates a class**.  
- Declares the class as being used to **receive websocket event type**.

**On decorator**  
**`@On(event: string)`**
- It decorates a **class method**.
- Decorates the method that will be **executed when the event is called by the client**.

**`Socket`**  
- Same object as the socket.io object, so you have the [documentation](https://socket.io/docs/server-api#Socket) of this one which is provided [here](https://socket.io/docs/server-api#Socket).
The class methods decorated with `@On`, receive in the first parameter the `Socket` which called the event and in the second parameter, the data sent by it (except for the `connection` event which receives no data).

#### Basic websocket class
```javascript
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

#### Websocket class with namespace

##### Server-side
_ExampleWs.ts_
```javascript
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
```javascript
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

##### Client-side
Warning Socket.io has a special way to connect to the server. In the first parameter of the connection you must specify **the URL of the server as well as the namespace** (`http://localhost:4000/nsp` in this case) and in the second parameter an object containing the **path property which must be the same as that of the server** (`/ws-server` in this case).  

_App.ts_
```javascript
import { connect as SocketConnect } from "socket.io-client";

const socketConnection = SocketConnect("http://localhost:4000/nsp", { path: "/ws-server" });
```
