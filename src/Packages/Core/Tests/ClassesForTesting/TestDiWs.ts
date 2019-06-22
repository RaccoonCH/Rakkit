import {
  On,
  Websocket,
  Socket,
  Inject
} from "../../../..";
import { TestService } from "./TestService";

@Websocket()
export class TestDiWs {
  @Inject()
  private _testService: TestService;

  @On("di")
  connection(socket: Socket) {
    this._testService.TestValue.ws = true;
    socket.emit("di", this._testService.TestValue);
  }
}
