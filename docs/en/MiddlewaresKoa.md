# Use external Koa libraries for your application
Rakkit was created to be modular, that's why all libraries created for Koa are compatible with your application, so it's up to you to download them and include them in your application.  
Remember that for modules requesting the application instance, you can access it via `Rakkit.Instance.KoaApp` for **the application instance** or via `MetadataStorage.Instance.MainRouter` for **the main router instance** (of koa-router).  
You will then have to pass them as parameters as middleware, most often they will be global, which is why in the example below the middleware is declared globally.

Here is one of use with _koa-bodyparser_:
```javascript
import * as BodyParser from "koa-bodyparser";
import { Rakkit } from "rakkit";

Rakkit.start({
  globalRestMiddleware: [
    BodyParser() // You have to call this function because it returns a middleware
  ]
});
```
