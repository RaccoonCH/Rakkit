# Router
They are based on the same operation as those of [koa](https://koajs.com/). You can, therefore, if necessary, refer to their documentation.

## Basic notions
**Router decorator**  
**`@Router(path: string)`**  
- He decorates a **class**.  
- **Declares the class as a router**, the `path` parameter is the **router access path**. Which will be accessible according to the parameters you provided in the [start options](http://localhost:3000/#/fr/GettingStarted?id=param%C3%A8tres-de-d%C3%A9start) and the value provided to the declaration of endpoints in the class (see below).  

**Enpoint decorator**  
**`@Get(endpoint?: string) & @Post & @Put & Delete`**  
- It decorates a **class method**.  
- Defined by which **http method** (get, post, put, delete) and by which url we will be able to **execute the class method**.  
The `endpoint` parameter that you enter when "decorating" is mounted after the router path, which gives the address: `http://HOST:PORT/REST_ENDPOINT/ROUTER_PATH/ENDPOINT_VALUE`.  
Providing the value `"/"` or not specifying a value mounts the endpoint to the root of the router path, which gives: `http://HOST:PORT/REST_ENDPOINT/ROUTER_PATH`  
_All capitalized values vary according to your configuration_

**The Context**  
- The decorated class methods of **@Get**, **@Post**, **@Put** or **@Delete** receive in **first parameter** a `Context` which is equivalent to a `Context` of [koa](https://koajs.com/) and works in the same way, so you can refer to their [documentation](https://koajs.com/) to know how to use and handle it.

## Basic router
Here is a simple example of a router with Rakkit.
```typescript
import { Router, Get, Post, Put, Delete, Context } from "rakkit";

@Router("example")
export class ExampleRouter {
  @Get("/")
  get(context: Context) {
    context.body = "hello world";
  }

  @Post("/")
  post(context: Context) {
    ...
  }

  @Put("/")
  put(context: Context) {
    ...
  }

  @Delete("/")
  delete(context: Context) {
    ...
  }
}
```

## Route merging
You can have two **class methods** that have the same **http method** as well as the same **endpoint** in order to chain the executions that are done **in the order of declaration of methods in the class**.  
_Especially useful when coupled with the use of [middlewares](http://localhost:3000/#/fr/Middleware)_  
To be able to use this feature you will need to understand how the [next](http://localhost:3000/#/fr/Middleware?id=before-all-function-next) function works.  

Roads can be merged this way:
```typescript
import { Router, Get, Context, NextFunction } from "rakkit";

@Router("example")
export class ExampleRouter {
  @Get("/")
  first(context: Context, next: NextFunction) {
    context.body = "hello ";
    next();
  }
  @Get("/")
  second(context: Context) {
    context.body += "world";
  }
}
```
**Precision on the function [next](http://localhost:3000/#/fr/Middleware?id=before-all-function-next)**   
How we can observe it, we **just needed to call the function next to the first method** (`first`) because we want **to go to the second** `second` .  
In this example if the client accesses the route `http://localhost:4000/example`, he will receive the answer: `hello world`.  
Main if the next function had not been called, the client would have just received `hello`.
