import { Socket } from "socket.io";
import { Service } from "rakkit";
import { ServiceToExtends } from "src/services/ServiceToExtends";

@Service()
export class ExampleService extends ServiceToExtends {
  Connections: Socket[] = [];
  MyServiceValue = "Hello, I'm a service";
}
