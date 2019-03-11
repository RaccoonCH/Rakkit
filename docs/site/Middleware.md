# Middleware
This is **a function that is executed before another**, usually to modify the request in order to "parse" it or to block the request for example if the person does not have the required rights to access it. The middleware in Rakkit **functions in the same way as those in Koa**.  

**There are several levels of middleware:**
- Endpoint middleware
- Middleware router
- Global middleware at the REST `/rest` router level
- Global middleware at the root router level `/`
- App middleware (mostly used for koa modules)

There are also **two modes of execution:**
- Before the route
- After the route

There are **two reporting modes**:
- Based on a class (preferred)
- Based on a class method

### Middleware declaration and use
You have two decorators at your disposal which are `@AfterMiddleware()` and `BeforeMiddleware()`, both of them allow you to **declare middleware** but the difference is in the execution order, one is to say that you want to execute one function before the route and the other after the route.  
We will be able to say that we want to **use this middleware with the decorator*** `@UseMiddleware(...middlewares: MiddlewareType[])`, we pass all the middleware used to it as parameters, be careful **the order of the list is important because it defines the order of execution of the middlewares in their group (both groups being "After" and "Before").**  

It is important to know how middleware is encompassed by their parents:
- Endpoint middleware wrapps endpoint
- The middlewares router wrapps the endpoint middlewares
- Global middleware wrapps router middleware
- App middleware wrapps global middlewares

This gives as an order (symmetrical / onion):
- **Before** <span style="color:violet">app</span> middleware
- **Before** <span style="color:seagreen">global</span> middleware
- **Before** <span style="color:dodgerblue">router</span> middleware
- **Before** <span style="color:red">endpoint</span> middleware
- _endpoint_
- **After** <span style="color:red">endpoint</span> middleware
- **After** <span style="color:dodgerblue">router</span> middleware
- **After** <span style="color:seagreen">global</span> middleware
- **After** <span style="color:violet">app</span> middleware

### First of all, the next function
- Works as the next function of [Koa](https://koajs.com) (or [Express](https://expressjs.com/fr/)).  
- It is **passed as the second parameter (after the context) in the class methods**.  
- It **allows you to move on to the next route**, so if this function is not called it will simply send the answer back to the client without moving on to the next routes.  
- If a function is asynchronous in the list of called methods it is necessary to execute **next with an await**, because the middleware waits for the execution of the next method which waits for the next one and so on and when everything has been executed it sends the answer to the client.  

#### Declaration at the endpoint level
```javascript
import {
  ... // Imports are not specified (Clarity)
} from "rakkit";

@BeforeMiddleware()
class MyBeforeMiddleware implements IBaseMiddleware {
  async use(ctx: Context, next: NextFunction) {
    ctx.body = "-2;";
    await next(); // To proceed to the next execution
  }
}

@BeforeMiddleware()
class MySecondBeforeMiddleware implements IBaseMiddleware {
  async use(ctx: Context, next: NextFunction) {
    ctx.body = "-1;";
    await next(); // To proceed to the next execution
  }
}

@AfterMiddleware()
class MyAfterMiddleware implements IBaseMiddleware {
  async use(ctx: Context) {
    ctx.body += "1;";
    // next does not need to be used because there is no execution that follows
  }
}

// Middleware on endpoints
@Router("example")
export class MiddlewareOnEndpoint {
  @Get("/")
  @UseMiddleware(
    MyBeforeMiddleware,
    MySecondBeforeMiddleware,
    MyAfterMiddleware
  )
  async get(context: Context, next: NextFunction) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    context.body += "0;";
    // By calling next I switch to MyAfterMiddleware middleware
    // No need to call next because the following method does not include asynchronous tasks,
    // but you can still put it
    next();
  }
}
```
In this example we have this order of execution:  
- MyBeforeMiddleware
- MySecondBeforeMiddleware
- get
- MyAfterMiddleware  
When accessing the route `http://localhost:4000/example` we will therefore receive as an answer `-2;-1;0;1;`

#### Declaration at router level
By using middleware at the router, middleware will be applied to all points on the router.  
```javascript
// Middleware on endpoints
@Router("example")
@UseMiddleware(
  MyBeforeMiddleware,
  MySecondBeforeMiddleware,
  MyAfterMiddleware
)
export class MiddlewareOnEndpoint {
  @Get("/")
  get(context: Context, next: NextFunction) {
    context.body += "0;";
    next(); // By calling next I switch to MyAfterMiddleware middleware
  }
  @Get("/foo")
  foo(context: Context, next: NextFunction) {
    context.body += "0;";
    next(); // By calling next I switch to MyAfterMiddleware middleware
  }
}
```
In this example we have this order of execution:  
- MyBeforeMiddleware
- MySecondBeforeMiddleware
- _Called route_
- MyAfterMiddleware  
By accessing any endpoint of this router: `http://localhost:4000/example/*` (`/` or `/foo`) we will receive as an answer `-2;-1;0;1;`

#### Declaration at the global level
You can **apply middlewares to all routers in your application (i.e. to all endpoints)** by passing the list of these in the `globalRestMiddlewares` (`/rest` by default) or `globalRootMiddlewares` (`/` root) property of `Rakkit` as parameters.  
You can also use this feature to **attach Koa** "plugins", such as [koa-bodyparser](https://github.com/koajs/bodyparser) which allows you to "parse" the body of incoming requests.
```javascript
import * as BodyParser from "koa-bodyparser";

Rakkit.start({
  globalRootMiddlewares: [
    BodyParser(); // Parse the request's body before accessing any other method
  ],
  globalRestMiddlewares: [
    MyBeforeMiddleware,
    MySecondBeforeMiddleware,
    MyAfterMiddleware
  ]
});
```

#### AppMiddlewares
It defines middleware directly on the instance of the Koa application and not on Koa-Router, this allows you for example to attach Koa modules.
```javascript
import * as Cors from "@koa/cors";
import * as BodyParser from "koa-bodyparser";

Rakkit.start({
  appMiddlewares: [
    Cors(),
    BodyParser()
  ]
});
```

### Special case: Merging endpoint and middlewares
As explained in the [router](/#/en/router) part you can merge endpoints, you can also use middlewares with this notion.

```javascript
@Router("example")
export class MiddlewareOnEndpoint {
  @Get("/")
  @UseMiddleware(MyBeforeMiddleware)
  get1(context: Context, next: NextFunction) {
    next()
  }
  @Get("/")
  @UseMiddleware(
    MySecondBeforeMiddleware
    MyAfterMiddleware
  )
  get2(context: Context, next: NextFunction) {
    next();
  }
}
```
the order of execution is then:
- MyBeforeMiddleware
- get1
- MySecondeBeforeMiddleware
- get2
- MyAfterMiddleware
