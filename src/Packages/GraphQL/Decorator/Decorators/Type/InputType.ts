import { GraphQLInputObjectType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";

export const InputType = DecoratorHelper.getAddTypeDecorator(GraphQLInputObjectType);
