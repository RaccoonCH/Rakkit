import { MetadataBuilder } from "./MetadataBuilder";
import {  } from "graphql";
import {
  IDecorator,
  IField,
  IQuery,
  IGqlType,
  IResolver
} from "../../..";

export class GqlBuilder extends MetadataBuilder {
  private _resolvers: Map<Function, IDecorator<IResolver>> = new Map();
  private _queries: Map<Function, IDecorator<IQuery>> = new Map();

  AddType(item: IDecorator<IGqlType>) {
    console.log(item);
  }

  AddResolver(item: IDecorator<IResolver>) {
    console.log(item);
  }

  AddField(item: IDecorator<IField>) {
    this._resolvers.set(item.class, item);
  }

  AddQuery(item: IDecorator<IQuery>) {
    this._queries.set(item.class, item);
  }

  Build() {
  }

  private buildResolvers() {
  }
}
