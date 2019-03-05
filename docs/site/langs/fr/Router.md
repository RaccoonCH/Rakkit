# Routeur
Ils sont basés sur le même fonctionnement que ceux de [koa](https://koajs.com/). Vous pouvez, donc, si besoin, vous referez à leur documentation.

### Notions de base
**Router decorator**  
**`@Router(path: string)`**  
- Il décore une **classe**.  
- **Déclare la classe en tant que routeur**, le paramètre `path` est le **chemin d'accès du router**. Qui sera accessible selon les paramètres que vous avez fourni dans les [options de démarrage](http://localhost:3000/#/fr/GettingStarted?id=param%C3%A8tres-de-d%C3%A9marrage) et la valeur fournie à la déclaration des endpoints dans la classes (voir ci-dessous).  

**Enpoint decorator**  
**`@Get(endpoint?: string) & @Post & @Put & Delete`**  
- Il décore une **méthode de classe**.  
- Défini par quelle **méthode http** (get, post, put, delete) et par quel url on va pouvoir **executer la méthode de classe**.  
Le paramètre `endpoint` que vous renseignez lors de la "décoration" est monté après le chemin d'accès du router ce qui donne l'adresse: `http://HOST:PORT/REST_ENDPOINT/ROUTER_PATH/ENDPOINT_VALUE`.  
Founir la valeur `"/"` ou le fait de ne pas préciser de valeur monte l'endpoint à la racine du chemin d'accès du router, ce qui donne: `http://HOST:PORT/REST_ENDPOINT/ROUTER_PATH`  
_Toutes les valeurs en majuscule varient selon votre configuration_

**Le Context**  
- Les méthode de classe décorées de **@Get**, **@Post**, **@Put** ou **@Delete** reçoivent en **premier paramètre** un `Context` qui équivaut à un `Context` de [koa](https://koajs.com/) et fonctionne de la même façon, vous pouvez donc vous référez à leur [documentation](https://koajs.com/) afin de savoir comment l'utiliser et le manipuler.

#### Routeur basique
Voici un exemple simple de routeur avec Rakkit.
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
Vous pouvez avoir deux **méthodes de classe** qui ont la même **méthode http** ainsi que le même **endpoint** afin de chainer les executions qui se font **dans l'orde de déclaration des méthodes dans la classe**.  
_Surtout utile quand elle est couplée à l'utilisation des [middlewares](http://localhost:3000/#/fr/Middleware)_  
Pour pouvoir utiliser cette fonctionnalité vous devrez comprendre le fonctionnement de la fonction [next](http://localhost:3000/#/fr/Middleware?id=avant-tout-la-fonction-next).

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

**Précision sur la fonction [next](http://localhost:3000/#/fr/Middleware?id=avant-tout-la-fonction-next)**  
Comment on peut l'observer, on a **juste eu besoin d'appeller la fonction next à la première méthode** (`first`) car on veut **passer à la seconde** `second` .  
Dans cette exemple si le client accède à la route `http://localhost:4000/example`, il recevra la réponse: `hello world`.  
Main si la fonction next n'avait pas été appelée, le client aurait juste reçu `hello `.
