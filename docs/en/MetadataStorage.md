# MetadataStorage Object
Just like the Rakkit object is a singleton, so you can access its instance via `MetadataStorage.Instance`.  
It provides various properties that may be useful to you such as: services, injections, routers, endoints, websocket, etc....  
You just have to remember that it is he who manages the decorators, so you can access the information about them through this object instance.  

Here are the available properties and their descriptions via `MetadataStorage.Instance`, (They are all in readonly):


| Property | Type | Description |
| --- | --- | --- |
| MainRouter | `ApiRouter`| The main router of the application `/` |
| BeforeMiddlewares | `Map<Object, HandlerFunction>` | All `@BeforeMiddleware` |
| AfterMiddlewares | `Map<Object, HandlerFunction>` | All `@AfterMiddleware` |
| Middleware | `Map<Object, IDecorator<IMiddleware>>>` | All middleware (`@AfterMiddleware` and `@BeforeMiddleware`) |
| Routers | `ReadonlyMap<Object, IDecorator<IRouter>>>` | All `@Router` |
| Endpoints | `Array<IDecorator<IEndpoint>>>` | All `@Endpoint` |
| Ones | `Array<IDecorator<IOn>>>` | All `@On` |
| Websockets | `Map<Object, IDecorator<IWebsocket>>>` | All `@Websocket` |
| Services | `Array<IDecorator<IService<any>>>>` | All `@Service` |
