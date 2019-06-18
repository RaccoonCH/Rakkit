import { Websocket, On, Rakkit } from "../../..";

describe("No error", () => {
  afterAll(async () => {
    await Rakkit.stop();
  });

  describe("websocket", () => {
    it("should not throw @On() same message error if they have same event but different namespace", async (done) => {
      try {
        @Websocket()
        class WsA {
          @On("a")
          wsaA() {}
        }
        @Websocket("nsp")
        class WsB {
          @On("a")
          wsbA() {}
        }
        await Rakkit.start({
          silent: true
        });
        done();
      } catch (err) {
        done.fail(err);
      }
      await Rakkit.stop();
    });
  });
});

