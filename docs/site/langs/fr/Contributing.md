# Contribution
Pour contribuer vous pouvez simplement cloner le projet et soumettre vos pull-request.  
Vous êtes priez de fournir des tests unitaires aisni qu'un exemple pour votre fonctionnalité si celle-ci cible du code.  
Veuillez, également réspecter les convention de nommage des commits et celle du code en installant globalement `ts-lint` (`npm i -g ts-lint`).  
Il est important de fournir une bonne description de vos changement dans le pull request (En anglais et en complément vous pouvez mettre la version en français, mais il faut de toute façon fournir une version anglophone pour que le reste du monde afin que les autres puisse comprendre).  

Nous avons volontairement laisser le dossier **.vscode**, qui fournit les script de debuging. Il est alors recommandé d'utiliser celui-ci pour développer sur Rakkit.

Decriptif des fichiers et de l'architecture:  

| Fichier / Dossier | Description |
| --- | --- |
| MetadataStorage.ts | Gère toute la logique des décorateurs et construit les objets à partir de leurs informations |
| Rakkit.ts | Initialise les serveurs et les dépendance externes (Koa, Socket.io) |
| AppLoader | Tout ce qui conserne un chargement en mémoire ou de fichiers |
| types | Contient tous les types / interfaces / classes abstraites / classes sans logiques particulières (Qui définissent un type) utilisées par Rakkit |
| misc | Tout les fonction diverse n'important pas pour le fonctionnement du Rakkit |
| logic | Toutes les classes comportants de la logique |
| erros | Toutes les type d'érreur que Rakkit enclenche |
| decorators | Toutes les définitions des décorateurs |
| examples | Les exemples d'utilisation de Rakkit |
