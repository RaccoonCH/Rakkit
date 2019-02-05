import { ArgsType, Field, ClassType } from "rakkitql";
import { QueryArgs } from "@types";

export class GraphqlUtils {
  static createArgsClass<DefaultClass>(defaultClass: ClassType<DefaultClass>) {
    @ArgsType()
    class GraphqlArgs extends QueryArgs {
      @Field(type => defaultClass, { nullable: true })
      where?: DefaultClass;
    }

    return GraphqlArgs as any;
  }
  /* TODO
  static createGetResponseClass<DefaultClass>(defaultClass: ClassType<DefaultClass>) {
    @InterfaceType(`${defaultClass.name}GetResponse`)
    abstract class GraphqlGetResponse {
      @Field({ nullable: true })
      readonly count?: number;

      @Field(type => [defaultClass], { nullable: true })
      readonly items?: DefaultClass[];
    }

    return GraphqlGetResponse as any;
  }
  */
}
