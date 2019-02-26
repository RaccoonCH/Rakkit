import { connect as SocketConnect } from "socket.io-client";
import Axios, { AxiosInstance } from "axios";
import { GlobalFirstBeforeMiddleware } from "./ClassesForTesting/Middlewares/Global/Before/GlobalFirstBeforeMiddleware";
import { Start } from "./Utils/Start";
import { Rakkit } from "../src";

const basicReturnedObject = {
  testDi: true,
  firstBeforeEndpoint: true,
  firstBeforeGlobal: true,
  firstBeforeRouter: true
};

describe("DI", async () => {
  let api: AxiosInstance;
  let socketConnection: SocketIOClient.Socket;

  beforeAll(async () => {
    await Start({
      globalMiddlewares: [
        GlobalFirstBeforeMiddleware
      ]
    });
    socketConnection = SocketConnect("http://localhost:3000", { path: "/ws" });
    api = Axios.create({
      baseURL: "http://localhost:3000/rest/test-di"
    });
  });

  afterAll(() => {
    Rakkit.stop();
  });

  it("should inject service to router and middlewares using the same instance", async () => {
    const res = (await api.get("/")).data;
    expect(res).toEqual(basicReturnedObject);
  });

  it("should inject service to websocket using the same instance as the last test", async (done) => {
    socketConnection.emit("di");
    socketConnection.on("di", (datas) => {
      expect(datas).toEqual({
        ...basicReturnedObject,
        ws: true
      });
      done();
    });
  });
});
