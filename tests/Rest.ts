import Axios, { AxiosInstance } from "axios";
import { Start } from "./ClassesForTesting/Start";
import { Rakkit } from "../src";

describe("REST", async () => {
  let api: AxiosInstance;

  beforeAll(async () => {
    const r = await Start();
    api = Axios.create({
      baseURL: "http://localhost:3000/rest"
    });
  });

  afterAll(() => {
    Rakkit.stop();
  });

  it("should receive the returned body", async () => {
    const res = (await api.get("/test")).data;
    expect(res).toBe("hello world");
  });

  it("should pass to each middleware", async () => {
    const res = (await api.get("/test/mw")).data;
    expect(res).toBe("b1;b2;0;a1;a2;");
  });

  it("should merge endpoints if it has the same endpoint and method", async () => {
    const res = (await api.get("/test/merge")).data;
    expect(res).toBe("-1;0;");
  });

  it("should merge endpoints if it has the same endpoint and method and use middleware", async () => {
    const res = (await api.get("/test/merge-mw")).data;
    expect(res).toBe("b1;-1;a1;b2;0;a2");
  });
});
