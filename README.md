<p align="center">
  <img src="logo.png" width="220" alt="Nest Logo"/>
  <br>
  A simple backend library written in <b>TypeScript</b> that provides <b>REST API</b> and <b>Websocket</b> tools to build amazing server-side applications
  <p align="center">
    <a href="https://www.npmjs.com/package/rakkit">
      <img src="https://badge.fury.io/js/rakkit.svg">
    </a>
    <a href="https://travis-ci.com/RaccoonCH/Rakkit">
      <img src="https://travis-ci.com/RaccoonCH/Rakkit.svg?branch=master"/>
    </a>
    <a href="https://codecov.io/gh/RaccoonCH/Rakkit">
      <img src="https://codecov.io/gh/RaccoonCH/Rakkit/branch/master/graph/badge.svg" />
    </a>
    <a href="https://david-dm.org/RaccoonCH/Rakkit">
      <img src="https://david-dm.org/RaccoonCH/Rakkit.svg">
    </a>
    <a href="https://bundlephobia.com/result?p=rakkit@latest">
      <img src="https://badgen.net/bundlephobia/min/rakkit">
    </a>
    <a href="https://gitter.im/_rakkit_/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge">
      <img src="https://badges.gitter.im/_rakkit_/community.svg">
    </a>
  </p>
</p>

## Getting started  
```
npm i rakkit
```
```
yarn add rakkit
```

## Code
Imports are skipped for code clarity.
For each example we need to have a starting point:  
```typescript
import { Rakkit } from "rakkit"

Rakkit.start({
  routers: [
    // Your path the router files
    `${__dirname}/**/*Router.ts`
  ]
})
```
And below is the terminal output: 
```shell
PUBLIC: http://localhost:4000
REST  : http://localhost:4000/rest
WS    : http://localhost:4000/ws

Routers:
✅ http://localhost:4000/people
```


#### Simple app example
This is an example of a REST api app. The context is the same as a [koa context](https://koajs.com/), and you can use it like a it too.

_PeopleRouter.ts_
```typescript
@Router("people")
class PeopleRouter {
  @Get("/")
  get(context: Context) {
    context.body = "hello world";
  }
  @Post("/")
  post(context: Context) {
    ...
  }
  @Put("/:id")
  put(context: Context) {
    ...
  }
  @Delete("/:id")
  delete(context: Context) {
    ...
  }
}
```

### Parse body and use koa middleware
You can parse the body of requests by using [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser) and just call his exported function in the `globalRestMiddleware` start option:
```javascript
import * as BodyParser from "koa-bodyparser";

Rakkit.start({
  globalRestMiddlewares: [
    BodyParser(),
    ...
  ]
});
```
You can install and use all koa plugins like this.  

#### Middlewares
In this example we have two middlewares, the @BeforeMiddleware use methods that are executed before the @Get("/") and for the @AfterMiddleware they are executed after it.  
You have three levels of middleware, on the endpoint (@Get, @Post, @Put, @Delete), on the router (@Router) and globaly (All router of your application). In this example we illustrate each level.  
Middleware are executed in the order of the list that is passed in the @UseMiddleware decorator.  
"Global middlewares" wrap "router middlewares" (global BeforeMiddleware are executed before the router BeforeMiddleware and global AfterMiddleware are executed after the router AfterMiddleware).
"Router middleware" wraps "enpoint middlewares".  


_BeforeMiddleware.ts_
```typescript
@BeforeMiddleware()
class BeforeMiddleware implements IBaseMiddleware {
  @Get("/")
  use(context: Context, next: NextFunction) {
    ...
    next();
  }
}
```

_AfterMiddleware.ts_
```typescript
@AfterMiddleware()
class AfterMiddleware implements IBaseMiddleware {
  @Get("/")
  use(context: Context, next: NextFunction) {
    ...
    next();
  }
}
```

_App.ts_
```typescript
Rakkit.start({
  routers: [
    // Your path the router files
    `${__dirname}/**/*Router.ts`
  ],
  globalMiddlewares: [
    BeforeMiddleware,
    AfterMiddleware
  ]
})
```

_PeopleRouter.ts_
```typescript
@Router("people")
@UseMiddleware(
  BeforeMiddleware,
  AfterMiddleware
)
class PeopleRouter {
  @Get("/")
  @UseMiddleware(
    BeforeMiddleware,
    AfterMiddleware
  )
  get(context: Context) {
    context.body = this._peopleService.MyServiceValue;
  }
}
```

#### With a service and DI
A service is a singleton that you can inject into your classes if they are also declared as a @Service or as a @Router, @Websocket, @AfterMiddleware, @BeforeMiddleware.  
You can assign an id to the service (`@Service(id?: string | number)`) if you need to have multiple instances of the class running at the same time. You can also retrieve the specified instance with the @Inject decorator (`@Service(id?: string | number)`).

_PeopleService.ts_
```typescript
@Service()
class PeopleService {
  MyServiceValue = "I'm a service";
}
```

_PeopleRouter.ts_
```typescript
@Router("people")
class PeopleRouter {
  @Inject()
  private _peopleService: PeopleService;

  @Get("/")
  get(context: Context) {
    context.body = this._peopleService.MyServiceValue;
  }
}
```

#### Websockets
_PeopleRouter.ts_
```typescript
@Websocket()
class PeopleRouter {
  @On("connection")
  connection(socket: Socket) {
    console.log("A new connection !");
  }

  @On("Hello")
  hello(socket: Socket, datas) {
    socket.emit("world", datas);
  }
}
```

### Serving static files
If you want to serve static files, the best way is to use Apache2 or Nginx, but you can use [static-koa-router](https://www.npmjs.com/package/static-koa-router) like this:
```javascript
import { Rakkit, MetadataStorage } from "rakkit";
import { Serve } from "static-koa-router"

async function start() {
  await Rakkit.start()
  Serve(
    `${__dirname}/public`,
    MetadataStorage.Instance.MainRouter
  )
}

start();
```


## The project history  
Initially this tool was made in order to create a homemade Headless CMS. But as the project progressed, our needs grew and our backend application looked more and more like a Framework, so we choose to make it an independent tool to benefit the community and progress on a better basis.

## Philosophy  
We wanted to create a tool that would allow us to create backend applications much more simply with a small learning curve, so that anyone, with some TypeScript basics, could use it. We also didn't want to make a clone of NestJS.

## Features (full typed, class based with decorated)  
- Dependency injection support
- Rest API Creation ([koa](https://koajs.com/) base)
- Websocket app creation ([socket.io](https://socket.io/))

## Contributing  
You can simply clone the project and submit a pull request, we will analyze it and decide whether or not it is valid.

## TODO
- Documentation

## Chat with us
- [Discord](https://discord.gg/szRhf3C)
- [Gitter](https://gitter.im/_rakkit_/community)
