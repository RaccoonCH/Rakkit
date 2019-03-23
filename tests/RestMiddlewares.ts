import Axios, { AxiosInstance } from "axios";
import { GlobalSecondBeforeMiddleware } from "./ClassesForTesting/Middlewares/Global/Before/GlobalSecondBeforeMiddleware";
import { GlobalFirstBeforeMiddleware } from "./ClassesForTesting/Middlewares/Global/Before/GlobalFirstBeforeMiddleware";
import { GlobalSecondAfterMiddleware } from "./ClassesForTesting/Middlewares/Global/After/GlobalSecondAfterMiddleware";
import { GlobalFirstAfterMiddleware } from "./ClassesForTesting/Middlewares/Global/After/GlobalFirstAfterMiddleware";
import { AppSecondBeforeMiddleware } from "./ClassesForTesting/Middlewares/App/Before/AppSecondBeforeMiddleware";
import { AppFirstBeforeMiddleware } from "./ClassesForTesting/Middlewares/App/Before/AppFirstBeforeMiddleware";
import { AppSecondAfterMiddleware } from "./ClassesForTesting/Middlewares/App/After/AppSecondAfterMiddleware";
import { AppFirstAfterMiddleware } from "./ClassesForTesting/Middlewares/App/After/AppFirstAfterMiddleware";
import { Start } from "./Utils/Start";
import { Rakkit, Router, UseMiddleware, Get, NextFunction, IContext } from "../src";

const getMergedMiddlewareString = (...mwStrings: string[]) => {
  return `${mwStrings.join(";")};`;
};

const getGenericMiddlewareString = (...mwStrings: string[]) => {
  return getMergedMiddlewareString(
    "ab1",
    "ab2",
    "gb1",
    "gb2",
    "rb1",
    "rb2",
    ...mwStrings,
    "ra1",
    "ra2",
    "ga1",
    "ga2",
    "aa1",
    "aa2"
  );
};

@Router("merge-mw-2")
export class MergeMw2 {
  @Get("/")
  @UseMiddleware(
    GlobalFirstBeforeMiddleware
  )
  async get1(context: IContext, next: NextFunction) {
    context.body += "1;";
    await next();
  }
  @Get("/")
  @UseMiddleware(
    GlobalSecondBeforeMiddleware,
    GlobalFirstAfterMiddleware
  )
  async get2(context: IContext, next: NextFunction) {
    context.body += "2;";
    await next();
  }
}

describe("REST Middlewares", () => {
  let api: AxiosInstance;

  beforeAll(async () => {
    await Start({
      appMiddlewares: [
        AppFirstBeforeMiddleware,
        AppSecondBeforeMiddleware,
        AppFirstAfterMiddleware,
        AppSecondAfterMiddleware
      ],
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

  it("should merge 2 endpoints that use different middlewares (different router)", async () => {
    const res = (await api.get("/merge-mw-2")).data;
    expect(res).toBe(
      getMergedMiddlewareString(
        "ab1",
        "ab2",
        "gb1",
        "gb2",
        "gb1",
        "1",
        "gb2",
        "2",
        "ga1",
        "ga1",
        "ga2",
        "aa1",
        "aa2"
      )
    );
  });
});
