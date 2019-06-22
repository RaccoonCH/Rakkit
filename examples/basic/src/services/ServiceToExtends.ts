import { Inject } from "../../../../src";
import { TestService } from "./TestService";

export abstract class ServiceToExtends {
  @Inject()
  TestService: TestService;
  extendsVal = "a";
}
