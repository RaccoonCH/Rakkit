import { connect as SocketConnect } from "socket.io-client";
import { Start } from "./Utils/Start";
import { Rakkit } from "../src";

describe("Websocket", async () => {
  let socketConnection: SocketIOClient.Socket;

  beforeAll(async () => {
    await Start();
    socketConnection = SocketConnect("http://localhost:3000", { path: "/ws" });
  });

  afterAll(async () => {
    socketConnection.close();
    await Rakkit.stop();
  });

  it("should trigger the connection", async (done) => {
    socketConnection.on("connected", () => {
      done();
    });
  });

  it("should trigger the specified method by message", async (done) => {
    socketConnection.emit("hello");
    socketConnection.on("world", () => {
      done();
    });
  });

  it("should pass datas through parameters", async () => {
    socketConnection.emit("params", {
      datas: true
    });
    socketConnection.on("params", (datas) => {
      expect(datas).toEqual({
        error: false
      });
    });
  });
});
