import { Router, Get } from "../src";

@Router("router")
export class RouterA {
  a: string;

  constructor() {
    this.a = "a";
  }

  @Get("/a")
  test() {
    this.a = "b";
    console.log(this.a);
  }
  @Get("/b")
  testb() {
    console.log(this.a);
  }
}
