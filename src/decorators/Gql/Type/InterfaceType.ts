import { DecoratorHelper } from "../../../logic";
import { GraphQLInterfaceType } from "graphql";

export const InterfaceType = DecoratorHelper.getAddTypeDecorator(GraphQLInterfaceType);
