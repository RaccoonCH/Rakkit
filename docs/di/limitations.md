# Limitations
## Circular dependencies
In case you have a circular dependency (A injects B which injects A, ...) you will have to specify the type as the first parameter of the decorator.  
Because one class is certainly loaded before the other is known, it is then necessary to reference it manually.  
**It is important to know that one cannot make a circular dependency by injecting from the constructor that class A needs an instance of class B to build itself and that class B also needs an instance of class A to be built which creates an infinite loop.**
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

## Circular import (TypeScript issue)
It is possible, depending on your configuration, that when you need to import a module that has been re-exported are type is undetermined. We are investigating the problem, but in order to solve it you can import directly by the class path and not by the re-export path.  

**This configuration can be problematic**  
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

**Resolution**  
_A.ts_
```typescript
import { B } from "./B"; // Importation par chemin direct

@Service()
class A {
  @Inject()
  private _b: B;
}
```
