import { Resolver, FieldResolver, IContext } from "../../../../src";

import { Rate } from "../entities/rate";
import { User, UserModel } from "../entities/user";

@Resolver(of => Rate)
export class RateResolver {
  @FieldResolver(type => User)
  async user(context: IContext<any, Rate>): Promise<User> {
    return (await UserModel.findById(context.gql.root.user))!;
  }
}
