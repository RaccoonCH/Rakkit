# Use external Koa libraries for your application
Rakkit was created to be modular, that's why all libraries created for Koa are compatible with your application, so it's up to you to download them and include them in your application.  
For most modules you can pass them as a parameter when starting your application (`appMiddlewares`, `globalXXXMiddlewares`),
Remember that for modules requesting the application instance, you can access it via `Rakkit.Instance.KoaApp` for **the application instance**, via `MetadataStorage.Instance.Rest.MainRouter` for **the main router instance** (of koa-router) or via `MetadataStorage.Instance.Rest.RestRouter` for the **rest router instance**.  
You will then have to pass them as parameters as middleware, most often they will be global, which is why in the example below the middleware is declared globally on the app.

Here is one of use with _koa-bodyparser_:
```javascript
import * as BodyParser from "koa-bodyparser";
import { Rakkit } from "rakkit";

Rakkit.start({
  appMiddleware: [
    BodyParser() // You have to call this function because it returns a middleware
  ]
});
```
