import { Socket } from "socket.io";
import { Service } from "../../../../src";
import { ServiceToExtends } from "./ServiceToExtends";

@Service()
export class ExampleService extends ServiceToExtends {
  Connections: Socket[] = [];
  MyServiceValue = "Hello, I'm a service";
}
