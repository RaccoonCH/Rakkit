import { Inject, Service } from "../../../../src";

export function load() {
  @Service(2, "1")
  class ServiceConstructor {
  }
  @Service()
  class ReceiverConstructor {
    constructor(
      @Inject(2)
      private _services: ServiceConstructor[]
    ) {}
  }
}
