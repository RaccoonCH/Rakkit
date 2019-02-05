import { Route } from "@logic";

export class Router {
  private _name?: string;
  private _routes: Route[];

  get Name(): string {
    return this._name;
  }
  set Name(val: string) {
    this._name = val;
  }

  get Routes(): Route[] {
    return this._routes;
  }
  set Routes(val: Route[]) {
    this._routes = val;
  }

  constructor(routes: Route[])
  constructor(routes: Route[], name: string)
  constructor(routes: Route[], name?: string) {
    this.Name = name || null;
    this.Routes = routes;
  }
}
