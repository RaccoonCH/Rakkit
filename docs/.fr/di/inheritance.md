# Héritage
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
