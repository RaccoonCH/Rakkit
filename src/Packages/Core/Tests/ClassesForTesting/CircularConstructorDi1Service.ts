import { Service } from "../../../../Packages/DI/Decorator/Decorators/Service";
import { Inject } from "../../../../Packages/DI/Decorator/Decorators/Inject";
import { CircularConstructorDi2Service } from "./CircularConstructorDi2Service";

@Service(1)
export class CircularConstructorDi1Service {
  prop = "c1";
  constructor(
    @Inject(type => CircularConstructorDi2Service, 1)
    private _c2: CircularConstructorDi2Service,
    s: string
  ) {
  }
  check() {
    expect(this._c2.prop).toBe("c2");
  }
}
