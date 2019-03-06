# Websocket
Ils sont basés sur le même fonctionnement que ceux de [socket.io](https://socket.io). Vous pouvez, donc, si besoin, vous referez à leur documentation.

### Notions de base
**Websocket decorator**  
**`@Websocket(namespace?: string)`**  
- Il **décore une classe**.  
- Déclare la classe comme étant utilisé afin de **recevoir des évenements de type websocket**.

**On decorator**  
**`@On(event: string)`**  
- Il décore une **méthode de classe**.
- Décore la méthode qui sera **executé quand l'évenement sera appelé par le client**.

**`Socket`**  
- Même objet que celui de socket.io, vous avez donc la [documentation](https://socket.io/docs/server-api#Socket) de celui-ci qui est fournit [ici](https://socket.io/docs/server-api#Socket).
Les méthode de classe décorées de `@On`, reçoivent en premier paramètre le `Socket` qui a appelé l'évenement et en second paramètre, les données envoyées par celui-ci (excepté pour l'évement `"connection"` qui ne reçoit aucune données).

### Classe websocket basique
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
Dans cet exemple, en appellant l'évenement `hello` depuis un client socket.io, le serveur va appeler l'évenement `world` du client et lui renvoyer les données reçues.

### Classe websocket avec namespace

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
Attention Socket.io a une façon particulière de se connecter au serveur. En premier paramètre de la connexion vous devez préciser **l'URL du serveur ansi que le namespace** (`http://localhost:4000/nsp` dans ce cas) et en deuxième paramètre un objet contenant la **propriété path qui doit être la même que celle du serveur** (`/ws-server` dans ce cas).  

_App.ts_
```javascript
import { connect as SocketConnect } from "socket.io-client";

const socketConnection = SocketConnect("http://localhost:4000/nsp", { path: "/ws-server" });
```
