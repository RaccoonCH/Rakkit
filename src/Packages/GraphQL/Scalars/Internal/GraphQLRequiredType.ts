import { GraphQLRakkitType } from "./GraphQLRakkitType";
import { GqlType } from "../..";

export class GraphQLRequiredType<ForType extends GqlType> extends GraphQLRakkitType<ForType> {
}
