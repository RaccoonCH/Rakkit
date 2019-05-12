import { Service, Inject } from "../../../..";
import { Circular2 } from "./CircularDi2Service";

@Service()
export class Circular1 {
  prop = "c1";

  @Inject(type => Circular2)
  private _circular2: Circular2;

  check() {
    expect(this._circular2.prop).toBe("c2");
  }
}
