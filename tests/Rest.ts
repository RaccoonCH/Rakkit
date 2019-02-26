import Axios, { AxiosInstance } from "axios";
import { Start } from "./Utils/Start";
import { Rakkit, HttpMethod } from "../src";

const bodyData = {
  body: "datas"
};

const getBody = (method: HttpMethod, param?: string, body?: boolean) => {
  return {
    method,
    params: param ? {
      param
    } : {},
    body: body ? bodyData : {}
  };
};

describe("REST", async () => {
  let api: AxiosInstance;

  beforeAll(async () => {
    api = Axios.create({
      baseURL: "http://localhost:3000/rest/test"
    });
    await Start();
  });

  afterAll(async () => {
    await Rakkit.stop();
  });

  describe("GET", () => {
    it("should receive the returned body", async () => {
      const res = (await api.get("/")).data;
      expect(res).toEqual(
        getBody("GET")
      );
    });
    it("should receive the url params", async () => {
      const res = (await api.get("/myparam")).data;
      expect(res).toEqual(
        getBody("GET", "myparam")
      );
    });
  });

  describe("DELETE", () => {
    it("should receive the returned body", async () => {
      const res = (await api.delete("/")).data;
      expect(res).toEqual(
        getBody("DELETE")
      );
    });
    it("should receive the url params", async () => {
      const res = (await api.delete("/myparam")).data;
      expect(res).toEqual(
        getBody("DELETE", "myparam")
      );
    });
  });

  describe("POST", () => {
    it("should receive the returned body", async () => {
      const res = (await api.post("/", bodyData)).data;
      expect(res).toEqual(
        getBody("POST", undefined, true)
      );
    });
    it("should receive the url params", async () => {
      const res = (await api.post("/myparam", bodyData)).data;
      expect(res).toEqual(
        getBody("POST", "myparam", true)
      );
    });
  });

  describe("PUT", () => {
    it("should receive the returned body", async () => {
      const res = (await api.put("/", bodyData)).data;
      expect(res).toEqual(
        getBody("PUT", undefined, true)
      );
    });
    it("should receive the url params", async () => {
      const res = (await api.put("/myparam", bodyData)).data;
      expect(res).toEqual(
        getBody("PUT", "myparam", true)
      );
    });
  });
});
