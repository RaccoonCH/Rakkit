import { cars } from "./../datas/cars";
import { Resolver, Query, Args, Ctx } from "../../../src";
import { WhereArgs, QueryResponse } from "../generics";
import { Car, Person } from "../types";
import { persons } from "../datas";
import { Context } from "apollo-server-core";

@Resolver()
export class AppResolver {
  @Query(returns => Person, { generic: QueryResponse })
  persons(
    @Args({ type: Person }) args: WhereArgs<Person>,
    @Ctx() ctx: Context,
  ): QueryResponse<Person> {
    ctx;
    console.log(args);
    return new QueryResponse(persons);
  }

  @Query(returns => Car, { generic: QueryResponse })
  cars(@Args({ type: Car }) args: WhereArgs<Car>): QueryResponse<Car> {
    console.log(args);
    return new QueryResponse(cars);
  }
}
