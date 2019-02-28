import Axios, { AxiosInstance } from "axios";
import { GlobalSecondBeforeMiddleware } from "./ClassesForTesting/Middlewares/Global/Before/GlobalSecondBeforeMiddleware";
import { GlobalFirstBeforeMiddleware } from "./ClassesForTesting/Middlewares/Global/Before/GlobalFirstBeforeMiddleware";
import { GlobalSecondAfterMiddleware } from "./ClassesForTesting/Middlewares/Global/After/GlobalSecondAfterMiddleware";
import { GlobalFirstAfterMiddleware } from "./ClassesForTesting/Middlewares/Global/After/GlobalFirstAfterMiddleware";
import { Start } from "./Utils/Start";
import { Rakkit, Router, UseMiddleware, Get, NextFunction, Context } from "../src";

const getMergedMiddlewareString = (...mwStrings: string[]) => {
  return `${mwStrings.join(";")};`;
};

const getGenericMiddlewareString = (...mwStrings: string[]) => {
  return getMergedMiddlewareString(
    "gb1",
    "gb2",
    "rb1",
    "rb2",
    ...mwStrings,
    "ra1",
    "ra2",
    "ga1",
    "ga2"
  );
};

@Router("merge-mw-2")
export class MergeMw2 {
  @Get("/")
  @UseMiddleware(
    GlobalFirstBeforeMiddleware
  )
  get1(context: Context, next: NextFunction) {
    context.body += "1;";
    next();
  }
  @Get("/")
  @UseMiddleware(
    GlobalSecondBeforeMiddleware,
    GlobalFirstAfterMiddleware
  )
  get2(context: Context, next: NextFunction) {
    context.body += "2;";
    next();
  }
}

describe("REST Middlewares", async () => {
  let api: AxiosInstance;

  beforeAll(async () => {
    await Start({
      globalRestMiddlewares: [
        GlobalFirstBeforeMiddleware,
        GlobalFirstAfterMiddleware,
        GlobalSecondBeforeMiddleware,
        GlobalSecondAfterMiddleware
      ]
    });
    api = Axios.create({
      baseURL: "http://localhost:3000/rest"
    });
  });

  afterAll(async () => {
    await Rakkit.stop();
  });

  it("should receive the returned body", async () => {
    const res = (await api.get("/test-middleware/")).data;
    expect(res).toBe(
      getGenericMiddlewareString("hello world")
    );
  });

  it("should pass to each middleware", async () => {
    const res = (await api.get("/test-middleware/mw")).data;
    expect(res).toBe(
      getGenericMiddlewareString("eb1", "eb2", "0", "ea1", "ea2")
    );
  });

  it("should merge endpoints if it has the same endpoint and method", async () => {
    const res = (await api.get("/test-middleware/merge")).data;
    expect(res).toBe(
      getGenericMiddlewareString("-1", "0")
    );
  });

  it("should merge endpoints if it has the same endpoint and method and use middlewares", async () => {
    const res = (await api.get("/test-middleware/merge-mw")).data;
    expect(res).toBe(
      getGenericMiddlewareString("eb1", "-1", "ea1", "eb2", "0", "ea2")
    );
  });

  it("should merge 3 endpoints if it has the same endpoint and method and use middlewares with params", async () => {
    const res = (await api.get("/test-middleware/merge-mw3/myparam")).data;
    expect(res).toBe(
      getGenericMiddlewareString("eb1", "-2", "ea1", "eb2", "-1", "ea2", "eb2", "myparam", "ea2")
    );
  });

  it("should merge 3 endpoints if it has the same endpoint and method and use middlewares with params", async () => {
    const res = (await api.get("/merge-mw-2")).data;
    expect(res).toBe(
      // Reseted at gb1 => real gb1;gb1;gb1
      getMergedMiddlewareString("gb1", "1", "gb2", "2", "ga1", "ga1", "ga2")
    );
  });
});
