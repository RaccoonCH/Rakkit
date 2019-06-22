import { Service, Inject } from "../../../../../..";

export function load() {
  @Service(2, "1")
  class ServiceB {
  }
  @Service()
  class ReceiverB {
    @Inject(2)
    private _services: ServiceB[];
  }
}
