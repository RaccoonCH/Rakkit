import { connect as SocketConnect } from "socket.io-client";
import { Start } from "./Utils/Start";
import { Rakkit } from "../src";

describe("Websocket", async () => {
  let socketConnection: SocketIOClient.Socket;
  let roomSocketConnection: SocketIOClient.Socket;

  beforeAll(async () => {
    await Start();
  });

  afterAll(async () => {
    socketConnection.close();
    roomSocketConnection.close();
    await Rakkit.stop();
  });

  describe("Without room", () => {
    it("should trigger the connection", async (done) => {
      socketConnection = SocketConnect("http://localhost:3000", { path: "/ws2" });
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

    it("should pass datas through parameters", async (done) => {
      socketConnection.emit("params", {
        datas: true
      });
      socketConnection.on("params", (datas) => {
        expect(datas).toEqual({
          error: false
        });
        done();
      });
    });
  });

  describe("With room", () => {
    it("should trigger the connection", async (done) => {
      roomSocketConnection = SocketConnect("http://localhost:3000/my-room", { path: "/ws2" });
      roomSocketConnection.on("room-connected", () => {
        done();
      });
    });

    it("should trigger the specified method by message", async (done) => {
      roomSocketConnection.emit("room-hello");
      roomSocketConnection.on("room-world", () => {
        done();
      });
    });

    it("should pass datas through parameters", async (done) => {
      roomSocketConnection.emit("room-params", {
        datas: true
      });
      roomSocketConnection.on("room-params", (datas) => {
        expect(datas).toEqual({
          error: false
        });
        done();
      });
    });
  });
});
