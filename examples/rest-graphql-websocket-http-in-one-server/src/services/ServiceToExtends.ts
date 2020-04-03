import { Inject } from "rakkit";
import { TestService } from "./TestService";

export abstract class ServiceToExtends {
  @Inject()
  TestService: TestService;
  extendsVal = "a";
}
