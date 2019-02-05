import { Request, Response } from "express";
import { Router, Post } from "@decorators";

@Router("system")
export class SystemRouter {
  @Post("/")
  async restart(req: Request, res: Response) {
  }
}
