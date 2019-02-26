import { connect as SocketConnect } from "socket.io-client";
import Axios, { AxiosInstance } from "axios";
import { GlobalFirstBeforeMiddleware } from "./ClassesForTesting/Middlewares/Global/Before/GlobalFirstBeforeMiddleware";
import { Start } from "./Utils/Start";
import { Rakkit, Service, Inject, MetadataStorage } from "../src";

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

  it("should inject service with the specified ID", async () => {
    Rakkit.stop();

    @Service()
    @Service(1)
    class Storage {
      prop = "a";
    }

    @Service()
    class FirstReceiver {
      @Inject()
      private _firstStorageInstance: Storage;
      @Inject(1)
      private _secondStorageInstance: Storage;

      check() {
        this._firstStorageInstance.prop = "fr";
        this._secondStorageInstance.prop = "sr";
      }
    }

    @Service()
    class SecondReceiver {
      @Inject()
      private _firstStorageInstance: Storage;
      @Inject(1)
      private _secondStorageInstance: Storage;

      check() {
        expect(this._firstStorageInstance.prop).toBe("fr");
        expect(this._secondStorageInstance.prop).toBe("sr");
      }
    }

    await Rakkit.start();

    MetadataStorage.getService(FirstReceiver).instance.check();
    MetadataStorage.getService(SecondReceiver).instance.check();
  });
});
