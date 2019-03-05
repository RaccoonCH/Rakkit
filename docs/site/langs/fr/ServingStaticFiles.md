# Servir des fichiers statiques
Nous préconisons de servir les fichier static avec Apache ou Nginx mais vous pouvez le faire avec votre application en utilisant la librairie qui à été développer par nos soins et disponible sur npm: **[koa-router-static](https://www.npmjs.com/package/static-koa-router)**.  
Pour l'utiliser vous aurez besoin de l'instance du router principale disponible via l'objet `MetadataStorage` afin de servir les fichier via la racine de votre application (`/`).  
**Exemple**
```javascript
import { Serve } from "static-koa-router";

Serve(`${__dirname}/public`, MetadataStorage.Instance.MainRouter)
```

Vous pouvez également le monter sur un routeur que créer par vous même grâce à la librairie `koa-router`. Mais faite attention de ne pas empiter sur un router que vous auriez déclarer avec la même route.
```javascript
import * as KoaRouter from "koa-router";

const router = new KoaRouter({
  prefix: "/public"
});
Serve(`${__dirname}/public`, router)
```
