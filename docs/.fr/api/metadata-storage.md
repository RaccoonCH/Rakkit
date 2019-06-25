# MetadataStorage
Tout comme l'objet Rakkit c'est un singleton, vous pouvez donc acceder à son instance via `MetadataStorage.Instance`.  
Il fournit diverses propriétés qui vous seront peut-être utile comme par exemple: les services, les injections, les routers, les endoints, les websocket, etc....  
Vous devez simplement retenir que c'est lui qui gère les décorateurs, c'est vous pouvez donc acceder aux informations les concernant par cet instance d'objet.

Voici les propriétés disponibles et leurs descriptions via `MetadataStorage.Instance`, (Elle sont toutes en readonly):

| Instance sujet | Proptiété | Type | Description |
| --- | --- | --- | --- |
| Rest | MainRouter | `ApiRouter` | Le routeur principale de l'application `/` |
| Rest | RestRouter | `ApiRouter` | Le routeur de rest `/rest` par défaut |
| Rest | BeforeMiddlewares | `Map<Object, HandlerFunction>` | Tous les `@BeforeMiddleware` |
| Rest | AfterMiddlewares | `Map<Object, HandlerFunction>` | Tous les `@AfterMiddleware` |
| Rest | Middlewares | `Map<Object, IDecorator<IMiddleware>>` | Tous les middlewares (`@AfterMiddleware` et `@BeforeMiddleware`) |
| Rest | Routers | `ReadonlyMap<Object, IDecorator<IRouter>>` | Tous les `@Router` |
| Rest | Endpoints | `Array<IDecorator<IEndpoint>>` | Tous les `@Endpoint` |
| Ws | Ons | `Array<IDecorator<IOn>>` | Tous les `@On` |
| Ws | Websockets | `Array<IDecorator<IWebsocket>>` | Tous les `@Websocket` |
| Di | Services | `Array<IDecorator<IService<any>>>` | Tous les `@Service` |
| Di | Injections | `Map<Object, IDecorator<IInject>>` | Tous les `@Inject` |
