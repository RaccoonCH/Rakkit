import { DecoratorHelper } from "../../../logic";
import { GraphQLInputObjectType } from "graphql";

export const InputType = DecoratorHelper.getAddTypeDecorator(GraphQLInputObjectType);
