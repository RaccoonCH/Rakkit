import { Action } from "@logic";

type AcceptedMethods = "get" | "post" | "put" | "delete";

export class Route {
  private _method: AcceptedMethods;
  private _route: string;
  private _actions: Action[];

  get Method(): AcceptedMethods {
    return this._method;
  }
  set Method(val: AcceptedMethods) {
    this._method = val;
  }

  get Route(): string {
    return this._route;
  }
  set Route(val: string) {
    this._route = val;
  }

  get Actions(): Action[] {
    return this._actions;
  }
  set Actions(val: Action[]) {
    this._actions = val;
  }

  constructor(method: AcceptedMethods, route: string, action: Action)
  constructor(method: AcceptedMethods, route: string, actions: Action[])
  constructor(method: AcceptedMethods, route: string, actions: Action[] | Action) {
    this.Method = method;
    this.Route = route;
    this.Actions = Array.isArray(actions) ? actions : [actions];
  }
}
