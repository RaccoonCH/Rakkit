# Utiliser des librairies externes Koa pour votre application
Rakkit à été créer pour être très modulaire, c'est pourquoi toute les librairies créées pour Koa disponibles (sur npm) sont compatible avec votre application, c'est donc à vous de les télécharger et de les inclures dans votre application.  
Rappellez vous que pour des modules demandant l'instance de l'application vous y avez acces via `Rakkit.Instance.KoaApp` pour **l'instance de l'application** ou par `MetadataStorage.Instance.MainRouter` pour **l'instance du router principale** (de koa-router).  
Voici quelques exemples d'utilisation de librairie très utilisées:  

#### koa-bodyparser
```javascript
import * as BodyParser from "koa-bodyparser";
import { Rakkit } from "rakkit";

Rakkit.start({
  globalRestMiddleware: [
    BodyParser() // Il faut appeller cette fonction car elle retourne un middleware
  ]
});
```

#### koa-ejs
```javascript
import * as BodyParser from "koa-bodyparser";
import { Rakkit } from "rakkit";

Rakkit.start({
  globalRestMiddleware: [
    BodyParser() // Il faut appeller cette fonction car elle retourne un middleware
  ]
});
```
