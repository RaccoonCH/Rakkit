# L'objet MetadataStorage
Tout comme l'objet Rakkit c'est un singleton, vous pouvez donc acceder à son instance via `MetadataStorage.Instance`.  
Il fournit diverses propriétés qui vous seront peut-être utile comme par exemple: les services, les injections, les routers, les endoints, les websocket, etc....  
Vous devez simplement retenir que c'est lui qui gère les décorateurs, c'est vous pouvez donc acceder aux informations les concernant par cet instance d'objet.

Voici les propriétés disponibles et leurs descriptions via `MetadataStorage.Instance`, (Elle sont toute en readonly):

| Proptiété | Type | Description |
| --- | --- | --- |
| MainRouter | `ApiRouter` | Le routeur principale de l'application `/` |
| BeforeMiddlewares | `Map<Object, HandlerFunction>` | Tous les `@BeforeMiddleware` |
| AfterMiddlewares | `Map<Object, HandlerFunction>` | Tous les `@AfterMiddleware` |
| Middlewares | `Map<Object, IDecorator<IMiddleware>>` | Tous les middlewares (`@AfterMiddleware` et `@BeforeMiddleware`) |
| Routers | `ReadonlyMap<Object, IDecorator<IRouter>>` | Tous les `@Router` |
| Endpoints | `Array<IDecorator<IEndpoint>>` | Tous les `@Endpoint` |
| Ons | `Array<IDecorator<IOn>>` | Tous les `@On` |
| Websockets | `Map<Object, IDecorator<IWebsocket>>` | Tous les `@Websocket` |
| Services | `Array<IDecorator<IService<any>>>` | Tous les `@Service` |
