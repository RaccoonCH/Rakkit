---
title: Utiliser des librairies externes (Koa)
---

# Utiliser des librairies externes Koa pour votre application
Rakkit à été créer afin d'être modulaire, c'est pourquoi toute les librairies créées pour Koa sont compatible avec votre application, c'est donc à vous de les télécharger et de les inclures dans votre application.  
Pour la plupart des modules vous pouvez les passer en paramètre au démarrage de Rakkit (`appMiddlewares`, `globalXXXMiddlewares`),
Rappellez vous que pour des modules demandant l'instance de l'application, vous y avez acces via `Rakkit.Instance.KoaApp` pour **l'instance de l'application** ou par `MetadataStorage.Instance.MainRouter` pour **l'instance du router principale** (de koa-router).  
Vous devrez alors les passer en paramètre en tant que middleware, le plus souvent ils seront globaux c'est pour cette raison que dans l'exemple ci-dessous le middleware est déclaré globalement.

Voici un d'utilisation avec _koa-bodyparser_:
```typescript
import * as BodyParser from "koa-bodyparser";
import { Rakkit } from "rakkit";

Rakkit.start({
  appMiddlewares: [
    BodyParser() // Il faut appeller cette fonction car elle retourne un middleware
  ]
});
```
