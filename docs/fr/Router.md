# Routeur
Ils sont basés sur le même fonctionnement que ceux de [koa](https://koajs.com/).

### Notions de base
**Router decorator**  
**`@Router(path: string)`**  
Il décore une classe.  
Déclare la classe en tant que router, le paramètre `path` est le chemin d'accès du router qui sera accessible selon les paramètre que vous avez fournit dans les options de démarrage.  
Il est donc accessible à l'adresse: `http://HOST:PORT/REST_ENDPOINT/ROUTER_PATH` (toutes les valeurs en majuscule varie selon votre configuration)

**Enpoint decorator**  
**`@Get(endpoint?: string) & @Post & @Put & Delete`**  
Il décore une méthode de classe.  
Définie par quelle méthode http (get, post, put, delete) et par quel chemin on va pouvoir executer la méthode de classe.  
Le paramètre endpoint est monté après le chemin d'accès du router ce qui donne l'adresse: `http://HOST:PORT/REST_ENDPOINT/ROUTER_PATH/ENDPOINT`.  
La valeur `/` ou le fait de ne pas préciser de valoir monte l'endpoint à la racine du chemin d'accès du router.

**`Context`**  
Les routeurs reçoivent en paramètre un `Context` qui équivaut à un `Context` de [koa](https://koajs.com/) et fonctionne de la même façon, vous pouvez donc vous référez à leur [documentation](https://koajs.com/) afin de savoir comment utiliser et manipuler le context.

#### Routeur basique
```javascript
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

#### Fusion de route
Vous pouvez avoir deux **méthodes de classe** qui ont la même **méthode http** ainsi que le même **endpoint** pour chainer les executions qui se font **dans l'orde de déclaration**. On doit alors introduire une nouvelle notion qui est celle de l'execution de la fonction `next`.

**`next()`**  
Fonctionne comme la fonction next de koa ou express.  
Il est **passé en paramètre dans les méthode de classe après le context**.  
Il **permet de passer à la route suivante**, si cette fonction n'est pas appelé il va donc se contenter de simplement renvoyer le réponse au client sans passer aux routes qui suivent.  
C'est une notion importante pour l'utilisation des middlewares.

On peut fusionner des routes de cette façon:
```javascript
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
Comment on peut l'observer, on a juste eu besoin d'appeller la fonction next car on veut passer à la seconde méthode de class (`second(context: Context)`) qui suit la première (`first(context: Context, next: NextFunction)`).  
Dans cette exemple si le client accède à la route `http://localhost:4000/example`, il recevra la réponse: `hello world`
