# Rakkit
Ceci est l'objet qui vous permet de manipuler l'application Rakkit, c'est un singleton vous pouvez donc acceder à son instance via la propriété `Rakkit.Instance` qui fournit les instances principale des dépendance `Koa` et `Socket.io` pour les cas particuliers où vous auriez besoin d'y acceder.  

Grâce à cet objet vous pouvez arrêter l'application (`stop`) et la démarrer (`start`)
