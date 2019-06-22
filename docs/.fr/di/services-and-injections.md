# Services et injection (injection de dépendances)

## Service
Il faut avant tout savoir que les décorateurs ci-dessous se déclare implicitement en tant que service, de ce fait il n'y pas besoin de les redéclarer en utilisant `@Service`:
- @Router
- @Websocket
- @BeforeMiddleware
- @AfterMiddleware
- _@Service_

## Injection

### Basique
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

### Instances multiples
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

### Injection dans un tableau
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

### Injection par constructeur
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
