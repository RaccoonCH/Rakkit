import { Query, Resolver, Args } from "type-graphql";
import { OrmInterface } from "@logic";
import CultureModel from "./Culture.model";
import { CultureArgs, CultureGetResponse } from "./Types";

@Resolver(CultureModel)
export default class CultureController {
  private _ormInterface = new OrmInterface(CultureModel);

  @Query(returns => CultureGetResponse)
  cultures(@Args() args: CultureArgs) {
    return this._ormInterface.Query(args);
  }
}
