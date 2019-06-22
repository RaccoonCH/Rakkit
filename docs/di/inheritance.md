# Inheritance
You can inherit your services from other services as well as from abstract class (or normal class) using injection so that your class inherits it:
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
In this example `ExampleService` will have access to the `MyService` property inherited from `ToExtends`.
