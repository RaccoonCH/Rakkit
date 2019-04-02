import { IDecorator, IGqlType, GqlType } from "../../../..";
import { GraphQLNamedType } from "graphql";

export class GraphQLRakkitType<ForType extends GqlType> {
  name: string;
  description?: string;
  for?: IDecorator<IGqlType<ForType>>;
  output?: IDecorator<IGqlType<ForType>>;
}
