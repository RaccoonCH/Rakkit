# Client-side
Warning Socket.io has a special way to connect to the server. In the first parameter of the connection you must specify **the URL of the server as well as the namespace** (`http://localhost:4000/nsp` in this case) and in the second parameter an object containing the **path property which must be the same as that of the server** (`/ws-server` in this case).  

_App.ts_
```typescript
import { connect as SocketConnect } from "socket.io-client";

const socketConnection = SocketConnect("http://localhost:4000/nsp", { path: "/ws-server" });
```
