import { Service, Inject } from "../../../..";
import { Circular1 } from "./CircularDi1Service";

@Service()
export class Circular2 {
  prop = "c2";

  @Inject(type => Circular1)
  private _circular1: Circular1;

  check() {
    expect(this._circular1.prop).toBe("c1");
  }
}
