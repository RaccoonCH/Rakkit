# Services / Injection de dépendances
On retrouve souvent cette notion dan Angular et elle va nous être utile afin de déclarer des services qui seront des instances disponibles partout dans votre application et injectables dans des classes.  
Grâce au système de service de Rakkit vous aller pouvoir déclarer plusieurs fois la même classe comme étant un service.

### Comment ça marche ?
Quand vous déclarer une class comme étant un service elle va être instancier et un ID va lui être assigné puis elle sera stocké dans container contenant toutes les instances de votre application. Vous allez, alors, pouvoir récuperer votre instance de service grâce à l'objet `MetadataStorage` ou simplement en l'injectant dans une classe.

### A quoi ça sert ?
Admettons que vous devez créer une application qui va toute les 5 minutes chercher des données sur un site afin de les envoyer via websocket au clients et aussi de les rendres disponibles via une API REST. Vous devrez alors avoir un ou plusieurs instance d'une certaine classe faisan ce travaille qui tournent ce qui implique que vous aurez surement un singleton ou une liste d'instance de cette classe... Déclarer une classe en tant que service permet de faire ce travail pour vous et de ne pas encombrer votre code. De plus cela améliore généralement la comprehension et la lisibilité du code.

### Service
Il faut avant tout savoir que les décorateurs ci-dessous se déclare implicitement en tant que service, de ce fait il n'y pas besoin de les redéclarer en utilisant `@Service`:
- @Router
- @Websocket
- @BeforeMiddleware
- @AfterMiddleware
- _@Service_
