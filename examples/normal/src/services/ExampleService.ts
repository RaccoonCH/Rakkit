import { Socket } from "socket.io";
import { Service } from "../../../../src";

@Service()
export class ExampleService {
  Connections: Socket[] = [];
  MyServiceValue = "Hello, I'm a service";
}
