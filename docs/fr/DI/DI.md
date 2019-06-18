# Services / Injection de dépendances
On retrouve souvent cette notion dan Angular et elle va nous être utile afin de déclarer des services qui seront des instances disponibles partout dans votre application et injectables dans des classes.  
Grâce au système de service de Rakkit vous aller pouvoir déclarer plusieurs fois la même classe comme étant un service.

### Comment ça marche ?
Quand vous déclarer une class comme étant un service elle va être instancier et un ID va lui être assigné puis elle sera stocké dans container contenant toutes les instances de votre application. Vous allez, alors, pouvoir récuperer votre instance de service grâce à l'objet `MetadataStorage` ou simplement en l'injectant dans une classe par le contructeur ou par propriété.

### A quoi ça sert ?
Admettons que vous devez créer une application qui va toute les 5 minutes chercher des données sur un site afin de les envoyer via websocket au clients et également les rendres disponibles via une API REST. Vous devrez alors avoir uns ou plusieurs instances d'une certaine classe faisant ce travaille ce qui implique d'avoir surement un singleton ou une liste d'instances de cette classe quelque part... Déclarer une classe en tant que service permet de faire ce travail pour vous et de ne pas encombrer votre code. De plus cela améliore généralement la comprehension et la lisibilité du code.

### Service
Il faut avant tout savoir que les décorateurs ci-dessous se déclare implicitement en tant que service, de ce fait il n'y pas besoin de les redéclarer en utilisant `@Service`:
- @Router
- @Websocket
- @BeforeMiddleware
- @AfterMiddleware
- _@Service_

### Utilisation

#### Basique
Dans cet exemple la même instance (ayant un ID) de la classe _A_ sera injectée dans _B_ et _C_.
```typescript
@Service()
class A {
  MyValue = "hello world";
}
```
```typescript
@Service()
class B {
  @Inject()
  private _a: A;

  constructor() {
    // En faisant ça l'instance de A se trouvant dans la classe C est également affectée
    this._a.MyValue = "I'm on the B service";
  }
}
```
```typescript
@Service()
class C {
  @Inject()
  private _a: A;
}
```

#### Instances multiples
Dans cet exemple on déclare deux instances de la class _A_ ayant des ID différents que l'on peut injecter dans nos classes en précisant l'identifiant.
```typescript
@Service(1, "a")
class A {
  MyValue = "hello world";
}
```
```typescript
@Service()
class B {
  @Inject(1)
  private _a: A;

  constructor() {
    // En faisant ça l'instance de A se trouvant dans la classe C n'est PAS affectée,
    // car ce sont deux instance de class différente.
    this._a.MyValue = "I'm on the B service";
  }
}
```
```typescript
@Service()
class C {
  @Inject("a")
  private _a: A;
}
```

#### Injection dans un tableau
En reprannant l'exemple précédent on peut également injecter plusieurs service dans la même variable ce qui va donner un tableau d'instance de la classe injectée.  
Dans ce cas on est forcé de **déclarer explicitement le type dans l'injection** en premier paramètre car TypeScript (reflect-metadata) me permet pas de connaître le type d'un tableau.
```typescript
@Service(1, "a")
class A {
  MyValue = "hello world";
}
```
```typescript
@Service()
class B {
  @Inject(type => A, 1, "a")
  private _as: A[];

  constructor() {
    // En faisant ça l'instance de A se trouvant dans la classe C est affectée,
    // car _as[1] se réfère à l'instance de A ayant l'ID: "a"
    this._as[1].MyValue = "I'm on the B service";
  }
}
```
```typescript
@Service()
class C {
  @Inject("a")
  private _a: A;
}
```

#### Injection par constructeur
On peut utiliser une autre façon d'injecter une dépendance, qui est par le constructeur.  
Elle fonctionne de la même façon, mais avec cette notation vous n'êtes pas obligé de décorer l'injection si celle-ci est simple ( simple = @Inject() ).  
Cependant vous ne pourrez **pas faire d'injection circulaire** avec cette façon contrairement avec l'injection par propriétés, ceci est expliqué en [dessous](http://localhost:3000/#/fr/DI?id=circular-dependencies) et c'est la raison pour laquelle nous préconision l'injection par propriétés.
```typescript
@Service()
@Service("a")
class A {
  MyValue = "hello world";
}
```
```typescript
@Service()
class B {
  constructor(
    private _a: A; // Pas besoin de décorer ce paramètre par @Inject
    @Inject(1)
    private _a1: A;
  ) {}
}
```

### Héritage
Vous pouvez hériter vos services de d'autres services ainsi que de classe abstraite (ou class normale) utilisant l'injection afin que votre classe hérite de celle-ci:
```typescript
@Service()
class MyService {
  MyServiceValue = "Hello";
}

abstract class ToExtends {
  @Inject()
  protected _myService: MyService;
}

@Service()
class ExampleService extends ToExtends {
}
```
Dans cet exemple `ExampleService` aura accès à la propriété `MyService` hérités de `ToExtends`.

### Récupération et ajout à la volée
Vous pouvez récupérer et ajouter des instances de classe à la volée par l'objet [MetadataStorage](http://localhost:3000/#/fr/MetadataStorage) en utilisant les méthodes:  
_Récupération_
```typescript
MetadataStorage.Instance.Di.getService<ClassType>(classType: ClassType, id?: string | number);
```
_Ajout_
```typescript
MetadataStorage.Instance.Di.addService<ClassType>(classType: ClassType, id?: string | number);
```

### Limitations
#### Circular dependencies
Dans le cas ou vous avez une dépendance circulaire (A injecte B qui inject A, ...) vous devrez préciser le type en premier paramètre du décorateur.  
Car une classe est certainement chargée avant que l'autre ne soit connue, il est alors nécessaire de la référencer manuellement.  
**Il est important de savoir que l'on ne peut faire de dépendance circlaire en injectant depuis le constructeur que la class A a besoin d'une instance de la classe B pour se construire et que la class B a également besoin d'une instance de la classe A pour être construit ce qui crée une boucle infinie.**
```typescript
@Service()
class A {
  @Inject(type => B)
  private _b: B;
}
```
```typescript
@Service()
class B {
  @Inject(type => A)
  private _a: A;
}
```

##### Import
Il est possible, selon votre configuration, que lorsque que vous devez faire un import d'un module qui à été reexporté sont type soit indéterminé. Nous investiguons sur le problème, mais afin de palier à celui-ci vous pouvez faire l'import directement par la chemin de la classe et non celui du reexport.

**Cette configuration peut poser problème**  
_index.ts_
```typescript
export * from "./A";
export * from "./B";
```
_A.ts_
```typescript
import { B } from "."; // "." est équivalent à "./index"

@Service()
class A {
  @Inject()
  private _b: B;
}
```

**Résolution**  
_A.ts_
```typescript
import { B } from "./B"; // Importation par chemin direct

@Service()
class A {
  @Inject()
  private _b: B;
}
```
