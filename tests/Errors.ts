import { Rakkit, Router, Websocket, On, Service, Inject } from "../src";

describe("Error", async () => {
  afterAll(async () => {
    await Rakkit.stop();
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
        await Rakkit.start({
          routers: [
            RouterA,
            RouterB
          ],
          silent: true
        });
        done.fail();
      } catch (err) {
        done();
      } finally {
        await Rakkit.stop();
      }
    });
  });

  describe("On", () => {
    it("should throw @On() same message error", async (done) => {
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
        await Rakkit.start({
          websockets: [
            WsA,
            WsB
          ],
          silent: true
        });
      } catch (err) {
        done();
      } finally {
        await Rakkit.stop();
      }
    });
  });

  describe("Service/DI", () => {
    it("should throw service already exists error", async (done) => {
      try {
        @Service()
        @Websocket()
        class WsB {
        }
        await Rakkit.start({
          websockets: [ WsB ],
          silent: true
        });
        done.fail();
      } catch (err) {
        done();
      } finally {
        await Rakkit.stop();
      }
    });
    it("should not throw service already exists error", async (done) => {
      try {
        @Service(1)
        @Websocket()
        class WsB {
        }
        await Rakkit.start({
          websockets: [ WsB ],
          silent: true
        });
        done();
      } catch (err) {
        done.fail(err);
      } finally {
        await Rakkit.stop();
      }
    });
    it("should not throw inconsistency array error (Type isn't an array, but multiple values injection)", async (done) => {
      try {
        @Service(2, "1")
        class ServiceA {
        }
        @Service()
        class ReceiverA {
          @Inject(ServiceA, 2, "1")
          private _services: ServiceA; // Not declared as an Array
        }
        await Rakkit.start({
        });
        done.fail("Error not throwed");
      } catch (err) {
        done();
      } finally {
        await Rakkit.stop();
      }
    });
    it("should not throw inconsistency array error (Type is an array, but it inject a simple value)", async (done) => {
      try {
        @Service(2, "1")
        class ServiceA {
        }
        @Service()
        class ReceiverA {
          @Inject(2)
          private _services: ServiceA[]; // Not declared as an Array
        }
        await Rakkit.start({
        });
        done.fail("Error not throwed");
      } catch (err) {
        done();
      } finally {
        await Rakkit.stop();
      }
    });
  });
});
