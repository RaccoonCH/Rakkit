# Serving static files
We recommend serving static files with Apache or Nginx but you can do it with your application using the library that has been developed by us and available on npm: **[koa-router-static](https://www.npmjs.com/package/static-koa-router)**.  
To use it you will need the instance of the main router available via the `MetadataStorage` object in order to serve the files via your application root (`/`).  
**Example**
```typescript
import { Serve } from "static-koa-router";

Serve(`${__dirname}/public`, Rakkit.MetadataStorage.Rest.MainRouter)
```

You can also mount it on a router that you can create by yourself using the `koa-router` library. But be careful not to avoid a router that you would have declared with the same route.
```typescript
import * as KoaRouter from "koa-router";

const router = new KoaRouter({
  prefix: "/public"
});
Serve(`${__dirname}/public`, router)
```
