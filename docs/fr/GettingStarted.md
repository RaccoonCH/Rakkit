# Commencer

### Installation
Vous pouvez simplement installer **Rakkit** avec `npm` ou `yarn`
```
npm i rakkit
```
```
yarn add rakkit
```

### Démarrer l'application
Afin de démarrer l'application vous devrez utiliser la class `Rakkit` et acceder à la méthode static `start`.  
Voici un exemple:
```javascript
import { Rakkit } from "rakkit";

Rakkit.start();
```

### Paramètres de démarrage
Vous pouvez passer plusieurs paramètres lors du démarrage de l'application dans la méthode `start` afin de la configurer.

| Property | Value | default | Description |
| --- | --- | --- | --- |
| silent | `boolean?` | `false` | Ne jamais rien écrire dans la console |
| host | `string?` | `localhost` | Le nom d'hôte
| port | `number?` | `4000` | Le numero du port
| restEndpoint | `string?` | `"/rest"` | Le chemin d'accès de l'api REST
| wsEndpoint | `string?` | `"/ws"` | Le chemin d'accès de l'application Websocket (socket.io)
| routers | `ClassOrString[]?` | `undefined` | Une liste chemins représentants les fichiers de routers ([glob](https://github.com/isaacs/node-glob)) ou une liste de class de routers
| websockets | `ClassOrString[]?` | `undefined` | Une liste chemins représentants les fichiers de websockets ([glob](https://github.com/isaacs/node-glob)) ou une liste de class de websockets
| globalMiddlewares | `MiddlewareType[]?` | `undefined` | Une liste de middlewares globaux (class ou fonctions)
| cors | `CorsOptions?` | `disabled: false` | Parametrage de CORS (désactivation, etc...) |
| public | `PublicOptions?` | `disabled: true` | Options afin de servir des fichiers de façon statique (fichier html, css, images, etc...) |
