# Services / Dependency injection
We often find this notion in Angular and it will be useful to us in order to declare services that will be instances available everywhere in your application and injectable in classes.  
Thanks to Rakkit's service system you will be able to declare the same class as a service several times.

### How does it work?
When you declare a class as a service it will be instantiated and an ID will be assigned to it and then it will be stored in a container containing all instances of your application. You will then be able to retrieve your service instance using the `MetadataStorage` object or simply by injecting it into a class by the constructor or by property.

### What's the point?
Let's say you have to create an application that will look for data every 5 minutes on a site in order to send it via websocket to customers and also make it available via a REST API. You will then need to have one or more instances of a certain class doing this work which probably implies having a singleton or a list of instances of this class somewhere.... Declaring a class as a service allows you to do this work for you and not clutter up your code. In addition, it generally improves the comprehension and readability of the code.

### Service
First of all, it should be noted that the decorators below implicitly declare themselves as a service, so there is no need to redeclare them using `@Service`:
- @Router
- @Websocket
- @BeforeMiddleware
- @AfterMiddleware
- _@Service_

### Utilisation

#### Basic
In this example the same instance (having an ID) of class _A_ will be injected into _B_ and _C_.
```javascript
@Service()
class A {
  MyValue = "hello world";
}
```
```javascript
@Service()
class B {
  @Inject()
  private _a: A;

  constructor() {
    // By doing this the instance of A in class C is also affected
    this._a.MyValue = "I'm on the B service";
  }
}
```
```javascript
@Service()
class C {
  @Inject()
  private _a: A;
}
```

#### Multiple instances
In this example we declare two instances of class _A_ with different IDs that we can inject into our classes by specifying the ID.
```javascript
@Service(1, "a")
class A {
  MyValue = "hello world";
}
```
```javascript
@Service()
class B {
  @Inject(1)
  private _a: A;

  constructor() {
    // By doing this the instance of A in class C is NOT affected,
    // because they are two instances of different classes.
    this._a.MyValue = "I'm on the B service";
  }
}
```
```javascript
@Service()
class C {
  @Inject("a")
  private _a: A;
}
```

#### Array injection
By repeating the previous example, we can also inject several services into the same variable, which will give an instance array of the injected class.  
In this case we are forced to **declare explicitly the type in the injection** in the first parameter because TypeScript (reflect-metadata) does not allow me to know the type of a table.
```javascript
@Service(1, "a")
class A {
  MyValue = "hello world";
}
```
```javascript
@Service()
class B {
  @Inject(type => A, 1, "a")
  private _as: A[];

  constructor() {
    // By doing this the instance of A in class C is affected,
    // because _as[1] refers to the instance of A with the ID: "a"
    this._as[1].MyValue = "I'm on the B service";
  }
}
```
```javascript
@Service()
class C {
  @Inject("a")
  private _a: A;
}
```

#### Constructor injection
Another way to inject a dependency, which is by the constructor, can be used.  
It works the same way, but with this notation you don't have to decorate the injection if it is simple ( simple = @Inject() ).  
However, you will not be able to **do circular injection** with this method unlike with property injection, this is explained in [below](http://localhost:3000/#/fr/DI?id=circular-dependencies) and that is why we recommend property injection.
```javascript
@Service()
@Service("a")
class A {
  MyValue = "hello world";
}
```
```javascript
@Service()
class B {
  constructor(
    private _a: A; // No need to decorate this parameter with @Inject
    @Inject(1)
    private _a1: A;
  ) {}
}
```

### Inheritance
You can inherit your services from other services as well as from abstract class (or normal class) using injection so that your class inherits it:
```javascript
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
In this example `ExampleService` will have access to the `MyService` property inherited from `ToExtends`.

### Get and add at runtime
You can retrieve and add class instances on the fly by the object [MetadataStorage](http://localhost:3000/#/fr/MetadataStorage) using methods:  
_Get_
```javascript
MetadataStorage.Instance.Di.getService<ClassType>(classType: ClassType, id?: string | number);
```
_Add_
```javascript
MetadataStorage.Instance.Di.addService<ClassType>(classType: ClassType, id?: string | number);
```

### Limitations
#### Circular dependencies
In case you have a circular dependency (A injects B which injects A, ...) you will have to specify the type as the first parameter of the decorator.  
Because one class is certainly loaded before the other is known, it is then necessary to reference it manually.  
**It is important to know that one cannot make a circular dependency by injecting from the constructor that class A needs an instance of class B to build itself and that class B also needs an instance of class A to be built which creates an infinite loop.**
```javascript
@Service()
class A {
  @Inject(type => B)
  private _b: B;
}
```
```javascript
@Service()
class B {
  @Inject(type => A)
  private _a: A;
}
```

##### Import
It is possible, depending on your configuration, that when you need to import a module that has been re-exported are type is undetermined. We are investigating the problem, but in order to solve it you can import directly by the class path and not by the re-export path.  

**This configuration can be problematic**  
_index.ts_
```javascript
export * from "./A";
export * from "./B";
```
_A.ts_
```javascript
import { B } from "."; // "." est équivalent à "./index"

@Service()
class A {
  @Inject()
  private _b: B;
}
```

**Resolution**  
_A.ts_
```javascript
import { B } from "./B"; // Importation par chemin direct

@Service()
class A {
  @Inject()
  private _b: B;
}
```
