<center>
  <img src="../assets/logo.png" width="220" alt="Nest Logo"/>
  <br>
  A simple backend library written in <b>TypeScript</b> that provides <b>REST API</b> and <b>Websocket</b> tools to build amazing server-side applications
  <p align="center">
    <a href="https://www.npmjs.com/package/rakkit">
      <img src="https://badge.fury.io/js/rakkit.svg">
    </a>
    <a href="https://travis-ci.com/RaccoonCH/Rakkit">
      <img src="https://travis-ci.com/RaccoonCH/Rakkit.svg?branch=master"/>
    </a>
    <a href="https://codecov.io/gh/RaccoonCH/Rakkit">
      <img src="https://codecov.io/gh/RaccoonCH/Rakkit/branch/master/graph/badge.svg" />
    </a>
    <a href="https://david-dm.org/RaccoonCH/Rakkit">
      <img src="https://david-dm.org/RaccoonCH/Rakkit.svg">
    </a>
    <a href="https://gitter.im/_rakkit_/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge">
      <img src="https://badges.gitter.im/_rakkit_/community.svg">
    </a>
  </p>
</center>

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
| socketioOptions | `WsOptions?` | `path: "/ws"` | Paramètrage de Socket.io (socket.io)
| routers | `ClassOrString[]?` | `undefined` | Une liste chemins représentants les fichiers de routers ([glob](https://github.com/isaacs/node-glob)) ou une liste de class de routers
| websockets | `ClassOrString[]?` | `undefined` | Une liste chemins représentants les fichiers de websockets ([glob](https://github.com/isaacs/node-glob)) ou une liste de class de websockets
| globalRestMiddlewares | `MiddlewareType[]?` | `undefined` | Une liste de middlewares globaux pour l'api REST (class ou fonctions)
| globalRootMiddlewares | `MiddlewareType[]?` | `undefined` | Une liste de middlewares globaux de l'application à la racine (`"/"`) (class ou fonctions)
