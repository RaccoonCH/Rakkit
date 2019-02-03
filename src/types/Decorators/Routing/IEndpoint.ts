import { RequestHandlerParams } from "express-serve-static-core";

export interface IEndpoint {
  endpoint: string;
  functions: RequestHandlerParams[];
  method: "GET" | "POST" | "DELETE" | "PUT";
}
