# Middleware
C'est **une fonction qui est executer avant une autre**, en général pour modifier la requête afin de la "parser" ou bien pour bloquer la requête par exemple si la personne n'a pas les droits requis afin d'y acceder. Les middleware dans Rakkit **fonctionne de la même façon que ceux de Koa**.  

**Il y'a plusieurs niveaux de middleware**:
- Endpoint middleware
- Router middleware
- Middleware global au niveau du router REST `/rest`
- Middleware global au niveau du router racine `/`

Il y'a également **deux modes d'execution**:
- Avant la route
- Après la route

Il y'a **deux mode de déclaration**:
- Basé sur une class (préféré)
- Basé sur une méthode de classe

### Déclaration de middleware et utilisation
Vous avez deux décorateur a disposition qui sont `@AfterMiddleware()` et `BeforeMiddleware()`, tout les deux vous permettent de **déclarer des middleware** mais la différence est au niveau de l'ordre d'execution, un est pour dire que l'on veut executer une fonction avant la route et l'autre après la route.  
On va pouvoir dire que l'on veut **utiliser cetains middleware grâce au décorateur*** `@UseMiddleware(...middlewares: MiddlewareType[])`, on lui passe en paramètre tout les middleware utilisé, attention **l'ordre de la liste est important car il définit l'ordre d'éxecution des middlewares dans leur groupe (Les deux groupes étant "After" et "Before").**  

Il est important de savoir de savoir comment les middleware sont englobé par leurs parents:
- Les middlewares endpoint englobe le endpoint
- Les middlewares router englobe les middlewares endpoint
- Les middlewares globaux englobe les middlewares router

Ce qui veut dire:
**BeforeMiddleware**
Les middlewares globaux sont executés avant les middlewares de routeur qui sont executés avant les middlewares de endpoint.
**AfterMiddleware**
Les middleware de endpoint sont executées avant les middlewares de router qui sont executés avant les middlewares globaux.

Cela donne comme ordre (symétrique / onion):
- **Before** <span style="color:seagreen">global</span> middleware
- **Before** <span style="color:dodgerblue">router</span> middleware
- **Before** <span style="color:red">endpoint</span> middleware
- _endpoint_
- **After** <span style="color:red">endpoint</span> middleware
- **After** <span style="color:dodgerblue">router</span> middleware
- **After** <span style="color:seagreen">global</span> middleware


#### Déclaration au niveau du endpoint
```javascript
import {
  ... // Les imports ne sont pas précisé (Clarté)
} from "rakkit";

@BeforeMiddleware()
class MyBeforeMiddleware implements IBaseMiddleware {
  async use(ctx: Context, next: NextFunction) {
    ctx.body = "-2;";
    next(); // Pour passer à l'éxecution suivante
  }
}

@BeforeMiddleware()
class MySecondBeforeMiddleware implements IBaseMiddleware {
  async use(ctx: Context, next: NextFunction) {
    ctx.body = "-1;";
    next(); // Pour passer à l'éxecution suivante
  }
}

@AfterMiddleware()
class MyAfterMiddleware implements IBaseMiddleware {
  async use(ctx: Context) {
    ctx.body += "1;";
    // next n'a pas besoin d'être utilisé car il n'y pas d'éxecution qui suivent
  }
}

// Middleware sur les endpoint
@Router("example")
export class MiddlewareOnEndpoint {
  @Get("/")
  @UseMiddleware(
    MyBeforeMiddleware,
    MySecondBeforeMiddleware,
    MyAfterMiddleware
  )
  get(context: Context, next: NextFunction) {
    context.body += "0;";
    next(); // En appellant next je passe au middleware MyAfterMiddleware
  }
}
```
Dans cet exemple on a donc cet ordre d'éxecution:
- MyBeforeMiddleware
- MySecondBeforeMiddleware
- get
- MyAfterMiddleware  
En accedant à la route `http://localhost:4000/example` on va donc recevoir comme réponse `-2;-1;0;1;`

#### Déclaration au niveau du router
En utilisant les middlewares au niveau du routeur, les middlewares seront appliqués à tous les enpoints de celui-ci.
```javascript
// Middleware sur les endpoint
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
    next(); // En appellant next je passe au middleware MyAfterMiddleware
  }
  @Get("/foo")
  foo(context: Context, next: NextFunction) {
    context.body += "0;";
    next(); // En appellant next je passe au middleware MyAfterMiddleware
  }
}
```
Dans cet exemple on a donc cet ordre d'éxecution:
- MyBeforeMiddleware
- MySecondBeforeMiddleware
- _Route appelée_
- MyAfterMiddleware  
Dans cet exemple, en accedant à n'importe quel endpoint de ce routeur: `http://localhost:4000/example/*` (`/` ou `/foo`) on va recevoir comme réponse `-2;-1;0;1;`

#### Déclaration au niveau global
Vous pouvez **appliquer des middlewares à tout les routeurs de votre application (donc a tous les endpoints)** en passant en paramètres la liste de ceux-ci dans la proptiété `globalRestMiddlewares` (`/`) ou `globalRootMiddlewares` (`/rest` par défaut) de `Rakkit`.  
Vous pouvez aussi utiliser cette fonctionnalité afin **d'attacher des "plugins" Koa**, comme par exemple [koa-bodyparser](https://github.com/koajs/bodyparser) qui permet de "parser" le body des requêtes entrantes.
```javascript
import * as BodyParser from "koa-bodyparser";

Rakkit.start({
  globalRootMiddlewares: [
    BodyParser(); // Parser le body des reqête avant d'acceder à n'importe quel autre méthode
  ],
  globalRestMiddlewares: [
    MyBeforeMiddleware,
    MySecondBeforeMiddleware,
    MyAfterMiddleware
  ]
});
```

### Cas particulier: Fusion de endpoint et middleware
Comme expliqué dans la partie [routeur](/#/fr/router) on peut fusionner des endpoints, vous pouvez aussi utiliser les middlewares en utilisant cette notion.

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
l'ordre d'éxecution est alors:
- MyBeforeMiddleware
- get1
- MySecondeBeforeMiddleware
- get2
- MyAfterMiddleware
