import { Rakkit, Router, Websocket, On, Service } from "../src";

describe("Error", async () => {
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
        Rakkit.stop();
      } catch (err) {
        done();
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
        Rakkit.stop();
      } catch (err) {
        done();
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
        Rakkit.stop();
        done.fail();
      } catch (err) {
        done();
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
        Rakkit.stop();
        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
