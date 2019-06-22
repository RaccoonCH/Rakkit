import { connect as SocketConnect } from "socket.io-client";
import * as BodyParser from "koa-bodyparser";
import Axios, { AxiosInstance } from "axios";
import { GlobalFirstBeforeMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Global/Before/GlobalFirstBeforeMiddleware";
import { Start } from "../../Core/Tests/Utils/Start";
import { Rakkit } from "../../..";
import { Service } from "../../../Packages/DI/Decorator/Decorators/Service";
import { Inject } from "../../../Packages/DI/Decorator/Decorators/Inject";
import { Circular1 } from "../../Core/Tests/ClassesForTesting/CircularDi1Service";
import { Circular2 } from "../../Core/Tests/ClassesForTesting/CircularDi2Service";
import { CircularConstructorDi1Service } from "../../Core/Tests/ClassesForTesting/CircularConstructorDi1Service";
import { CircularConstructorDi2Service } from "../../Core/Tests/ClassesForTesting/CircularConstructorDi2Service";
import { MetadataStorage } from "../../Core/Logic/MetadataStorage";

const basicReturnedObject = {
  testDi: true,
  firstBeforeEndpoint: true,
  firstBeforeGlobal: true,
  firstBeforeRouter: true
};

@Service()
@Service(1, "a")
class Storage {
  prop = "a";
}

@Service()
class FirstReceiver {
  @Inject()
  private _firstStorageInstance: Storage;
  @Inject(1)
  private _secondStorageInstance: Storage;
  @Inject("a")
  private _thirdStorageInstance: Storage;

  check() {
    this._firstStorageInstance.prop = "fr";
    this._secondStorageInstance.prop = "sr";
    this._thirdStorageInstance.prop = "tr";
  }
}

@Service()
class SecondReceiver {
  @Inject()
  private _firstStorageInstance: Storage;
  @Inject(1)
  private _secondStorageInstance: Storage;
  @Inject("a")
  private _thirdStorageInstance: Storage;

  check() {
    expect(this._firstStorageInstance.prop).toBe("fr");
    expect(this._secondStorageInstance.prop).toBe("sr");
    expect(this._thirdStorageInstance.prop).toBe("tr");
  }
}

@Service()
class ArrayReceiver {
  @Inject()
  private _firstStorageInstance: Storage;
  @Inject(type => Storage, 1, "a")
  private _storageInstances: Storage[];

  check() {
    expect(this._firstStorageInstance.prop).toBe("fr");
    expect(this._storageInstances.map(i => i.prop)).toEqual(["sr", "tr"]);
  }
}

@Service()
class SingleValueArrayReceiver {
  @Inject()
  protected _firstStorageInstance: Storage;
  @Inject(type => Storage, 1)
  protected _secondStorageInstance: Storage[];
  @Inject(type => Storage, "a")
  protected _thirdStorageInstance: Storage[];

  check() {
    expect(this._firstStorageInstance.prop).toBe("fr");
    expect(this._secondStorageInstance[0].prop).toBe("sr");
    expect(this._thirdStorageInstance[0].prop).toBe("tr");
  }
}

@Service()
class ConstructorInjection {
  constructor(
    protected _firstStorageInstance: Storage,
    @Inject(type => Storage, 1)
    protected _secondStorageInstance: Storage,
    s: string,
    @Inject(type => Storage, "a")
    protected _thirdStorageInstance: Storage
  ) {
  }
  check() {
    expect(this._firstStorageInstance.prop).toBe("fr");
    expect(this._secondStorageInstance.prop).toBe("sr");
    expect(this._thirdStorageInstance.prop).toBe("tr");
  }
}

@Service()
class ExtendingServiceConstructor extends ConstructorInjection {
  check() {
    expect(this._firstStorageInstance.prop).toBe("fr");
    expect(this._secondStorageInstance.prop).toBe("sr");
    expect(this._thirdStorageInstance.prop).toBe("tr");
  }
}

@Service()
class ExtendingService extends SingleValueArrayReceiver {
  check() {
    expect(this._firstStorageInstance.prop).toBe("fr");
    expect(this._secondStorageInstance[0].prop).toBe("sr");
    expect(this._thirdStorageInstance[0].prop).toBe("tr");
  }
}

abstract class ToExtends1 {
  @Inject()
  protected _contructorInjection: ConstructorInjection;
}

abstract class ToExtends2 extends ToExtends1 {
  @Inject()
  protected _singleValueArrayReceiver: SingleValueArrayReceiver;
}

@Service()
class DeepExtending extends ToExtends2 {
  check() {
    this._contructorInjection.check();
    this._singleValueArrayReceiver.check();
  }
}

@Service()
class ConstructorArrayInjection {
  constructor(
    private _firstStorageInstance: Storage,
    @Inject(type => Storage, 1, "a")
    private _storageInstances: Storage[],
    s: string
  ) {
  }
  check() {
    expect(this._firstStorageInstance.prop).toBe("fr");
    expect(this._storageInstances.map(i => i.prop)).toEqual(["sr", "tr"]);
  }
}

describe("DI", () => {
  let api: AxiosInstance;
  let socketConnection: SocketIOClient.Socket;

  beforeAll(async () => {
    await Start({
      rest: {
        globalRestMiddlewares: [
          BodyParser(),
          GlobalFirstBeforeMiddleware
        ]
      }
    });
    socketConnection = SocketConnect("http://localhost:3000", { path: "/ws2" });
    api = Axios.create({
      baseURL: "http://localhost:3000/rest/test-di"
    });
  });

  afterAll(async () => {
    socketConnection.close();
    await Rakkit.stop();
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
    MetadataStorage.Instance.Di.GetService(FirstReceiver).check();
    MetadataStorage.Instance.Di.GetService(SecondReceiver).check();
  });

  it("should inject services with the specified ID into an array", async () => {
    MetadataStorage.Instance.Di.GetService(ArrayReceiver).check();
  });

  it("should inject one service with the specified ID into an array", async () => {
    MetadataStorage.Instance.Di.GetService(SingleValueArrayReceiver).check();
  });

  it("should create a new service at runtime", async () => {
    class NewService {
      MyProp = "a";
    }
    const instanceByAdding = MetadataStorage.Instance.Di.AddService(NewService, 2);
    expect(instanceByAdding.MyProp).toBe("a");
    instanceByAdding.MyProp = "b";
    const instanceByGetting = MetadataStorage.Instance.Di.GetService(NewService, 2);
    expect(instanceByGetting.MyProp).toBe("b");
  });

  it("should throw error when adding a new service at runtime and it already exists", async (done) => {
    try {
      MetadataStorage.Instance.Di.AddService(Storage, 1);
      done.fail("Error not throwed");
    } catch (err) {
      done();
    }
  });

  it("should inject circular", async () => {
    MetadataStorage.Instance.Di.GetService(Circular1).check();
    MetadataStorage.Instance.Di.GetService(Circular2).check();
  });

  it("should inject to constructor", async () => {
    MetadataStorage.Instance.Di.GetService(ConstructorInjection).check();
  });

  it("should inject to constructor with arrays", async () => {
    MetadataStorage.Instance.Di.GetService(ConstructorArrayInjection).check();
  });

  it("should inject to constructor with semi circular", async () => {
    MetadataStorage.Instance.Di.GetService(CircularConstructorDi1Service, 1).check();
    MetadataStorage.Instance.Di.GetService(CircularConstructorDi2Service, 1).check();
  });

  it("should inject to constructor with semi circular", async () => {
    MetadataStorage.Instance.Di.GetService(CircularConstructorDi1Service, 1).check();
    MetadataStorage.Instance.Di.GetService(CircularConstructorDi2Service, 1).check();
  });

  it("should inject extends with constructor", async () => {
    MetadataStorage.Instance.Di.GetService(ExtendingServiceConstructor).check();
  });

  it("should inject extends with property", async () => {
    MetadataStorage.Instance.Di.GetService(ExtendingService).check();
  });

  it("should inject extends with deep injection", async () => {
    MetadataStorage.Instance.Di.GetService(DeepExtending).check();
  });
});
