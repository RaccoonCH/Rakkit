import { Service, Inject } from "../../../..";
import { CircularConstructorDi1Service } from "./CircularConstructorDi1Service";

@Service(1)
export class CircularConstructorDi2Service {
  prop = "c2";
  @Inject(type => CircularConstructorDi1Service, 1)
  private _c1: CircularConstructorDi1Service;
  constructor(
    s: string
  ) {
  }
  check() {
    expect(this._c1.prop).toBe("c1");
  }
}
