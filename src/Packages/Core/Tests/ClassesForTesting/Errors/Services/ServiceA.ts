import { Inject, Service } from "../../../../../..";

export function load() {
  @Service(2, "1")
  class ServiceA {
  }
  @Service()
  class ReceiverA {
    @Inject(type => ServiceA, 2, "1")
    private _services: ServiceA; // Not declared as an Array
  }
}
