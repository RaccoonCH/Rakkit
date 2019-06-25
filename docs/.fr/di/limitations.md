# Limitations
## Dépendance circulaire
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

## Import (Problème venant de TypeScript)
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
