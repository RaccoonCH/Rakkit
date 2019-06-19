# MetadataStorage
Just like the Rakkit object is a singleton, so you can access its instance via `MetadataStorage.Instance`.  
It provides various properties that may be useful to you such as: services, injections, routers, endoints, websocket, etc....  
You just have to remember that it is he who manages the decorators, so you can access the information about them through this object instance.  

Here are the available properties and their descriptions via `MetadataStorage.Instance`, (They are all in readonly):


| Subject property | Property | Type | Description |
| --- | --- | --- | --- |
| Rest | MainRouter | `ApiRouter`| The main router of the application `/` |
| Rest | BeforeMiddlewares | `Map<Object, HandlerFunction>` | All `@BeforeMiddleware` |
| Rest | AfterMiddlewares | `Map<Object, HandlerFunction>` | All `@AfterMiddleware` |
| Rest | Middleware | `Map<Object, IDecorator<IMiddleware>>>` | All middleware (`@AfterMiddleware` and `@BeforeMiddleware`) |
| Rest | Routers | `ReadonlyMap<Object, IDecorator<IRouter>>>` | All `@Router` |
| Rest | Endpoints | `Array<IDecorator<IEndpoint>>>` | All `@Endpoint` |
| Ws | Ons | `Array<IDecorator<IOn>>>` | All `@On` |
| Ws | Websockets | `Map<Object, IDecorator<IWebsocket>>>` | All `@Websocket` |
| Di | Services | `Array<IDecorator<IService<any>>>>` | All `@Service` |
| Di | Injections | `Array<IDecorator<IInject>>` | All `@Inject` |
