import { GraphQLInterfaceType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";

export const InterfaceType = DecoratorHelper.getAddTypeDecorator(GraphQLInterfaceType);
