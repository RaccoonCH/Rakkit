import { Action } from "@logic";

export class Middleware {
  private _before?: Action[];
  private _after?: Action[];

  get Before(): Action[] {
    return this._before;
  }
  set Before(val: Action[]) {
    this._before = val;
  }

  get After(): Action[] {
    return this._after;
  }
  set After(val: Action[]) {
    this._after = val;
  }

  constructor(before: Action, after: Action)
  constructor(before: Action[], after: Action[])
  constructor(before: Action[] | Action, after: Action[] | Action) {
    this.Before = Array.isArray(before) ? before : [before];
    this.After = Array.isArray(after) ? after : [after];
  }
}
