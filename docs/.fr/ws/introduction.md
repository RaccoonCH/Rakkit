# Websocket
Ils sont basés sur le même fonctionnement que ceux de [socket.io](https://socket.io). Vous pouvez, donc, si besoin, vous referez à leur documentation.

## Notions de base
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
