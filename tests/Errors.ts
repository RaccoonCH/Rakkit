import { Rakkit, Router, Websocket, On, Service, Inject, ArrayDiError } from "../src";

describe("Error", async () => {
  afterAll(async () => {
    await Rakkit.stop();
  });

  describe("Service/DI", () => {
    it("should throw service already exists error", async (done) => {
      try {
        @Service()
        @Websocket()
        class WsD {
        }
        await Rakkit.start();
        done.fail("Error not throwed");
      } catch (err) {
        done();
      }
      await Rakkit.stop();
    });
    it("should not throw service already exists error", async (done) => {
      try {
        @Service(1)
        @Websocket()
        class WsE {
        }
        await Rakkit.start();
        done();
      } catch (err) {
        done.fail(err);
      }
      await Rakkit.stop();
    });
    it("should throw inconsistency array error (Type isn't an array, but multiple values injection)", async (done) => {
      // ERROR THROWED A ADDING DECORATOR, CANNOT TEST, TEST => BUILDING METADATA
      try {
        @Service(2, "1")
        class ServiceA {
        }
        @Service()
        class ReceiverA {
          @Inject(type => ServiceA, 2, "1")
          private _services: ServiceA; // Not declared as an Array
        }
        await Rakkit.start();
        done.fail("Error not throwed");
      } catch (err) {
        done();
      }
      await Rakkit.stop();
    });
    it("should throw inconsistency array error (Type is an array, but it inject a simple value)", async (done) => {
      // ERROR THROWED A ADDING DECORATOR, CANNOT TEST, TEST => BUILDING METADATA
      try {
        @Service(2, "1")
        class ServiceB {
        }
        @Service()
        class ReceiverB {
          @Inject(2)
          private _services: ServiceB[];
        }
        await Rakkit.start();
        done.fail("Error not throwed");
      } catch (err) {
        done();
      }
      await Rakkit.stop();
    });
    it("should throw inconsistency array error on constructor (Type is an array, but it inject a simple value)", async () => {
      @Service(2, "1")
      class ServiceB {
      }
      @Service()
      class ReceiverB {
        constructor(
          @Inject(2)
          private _services: ServiceB[]
        ) {}
      }
      expect(Rakkit.start()).rejects.toThrowError(ArrayDiError);
      await Rakkit.stop();
    });
  });

  describe("Router", () => {
    it("should throw router same path error", async (done) => {
      try {
        @Router("router")
        class RouterA {
        }
        @Router("router")
        class RouterB {
        }
        await Rakkit.start();
        done.fail();
      } catch (err) {
        done();
      }
      await Rakkit.stop();
    });
  });

  describe("On", () => {
    it("should throw @On() same message error if they have the same event and the same namespace", async (done) => {
      try {
        @Websocket()
        class WsA {
          @On("a")
          wsaA() {}
        }
        @Websocket()
        class WsB {
          @On("a")
          wsbA() {}
        }
        await Rakkit.start();
        done.fail("Error not throwed");
      } catch (err) {
        done();
      }
      await Rakkit.stop();
    });
  });
});
