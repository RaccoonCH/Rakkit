# Websocket
Ils sont basés sur le même fonctionnement que ceux de [socket.io](https://socket.io)

#### Notions de base
**Websocket decorator**  
**`@Websocket()`**  
Il décore une classe.  
Déclare la classe comme étant utilisé afin de recevoir des évenements de type websocket.

**On decorator**  
**`@On(event: string)`**  
Il décore une méthode de classe.
Décore la méthode qui sera executé quand l'évenement sera appelé par le client.

**`Socket`**  
Même objet que celui de socket.io, vous avez donc la [documentation](https://socket.io/docs/server-api#Socket) de celui-ci qui est fournit [ici](https://socket.io/docs/server-api#Socket).
Les méthode de classe décorées de `@On`, reçoivent en premier paramètre le `Socket` qui a appelé l'évenement et en second paramètre, les données envoyées par celui-ci (excepté pour l'évement `"connection"` qui ne reçoit aucune données).

#### Classe websocket basique
```javascript
import { Websocket, On, Socket } from "rakkit";

@Websocket()
export class ExampleRouter {
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
