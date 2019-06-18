# Client-side
Attention Socket.io a une façon particulière de se connecter au serveur. En premier paramètre de la connexion vous devez préciser **l'URL du serveur ansi que le namespace** (`http://localhost:4000/nsp` dans ce cas) et en deuxième paramètre un objet contenant la **propriété path qui doit être la même que celle du serveur** (`/ws-server` dans ce cas).  

_App.ts_
```typescript
import { connect as SocketConnect } from "socket.io-client";

const socketConnection = SocketConnect("http://localhost:4000/nsp", { path: "/ws-server" });
```
