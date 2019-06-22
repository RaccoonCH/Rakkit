# Websocket
They are based on the same operation as those of [socket.io](https://socket.io). You can, therefore, if necessary, refer to their documentation.

## Basic notions
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
