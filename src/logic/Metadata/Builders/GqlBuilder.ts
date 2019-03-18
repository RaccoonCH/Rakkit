import { MetadataBuilder } from "./MetadataBuilder";
import {
  GraphQLFieldResolver,
  GraphQLFieldConfigMap,
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLFloat,
  printSchema,
  GraphQLInputObjectType,
  GraphQLFieldConfig
} from "graphql";
import {
  IDecorator,
  IField,
  IQuery,
  IGqlType,
  IResolver,
  MetadataStorage,
  GqlType
} from "../../..";
import { writeFile } from "fs";

export class GqlBuilder extends MetadataBuilder {
  private _resolvers: Map<Function, IDecorator<IResolver>> = new Map();
  private _queries: IDecorator<IQuery>[] = [];
  private _objectTypes: Map<Function, IDecorator<IGqlType>> = new Map();
  private _fields: IDecorator<IField>[] = [];

  private _schema: GraphQLSchema;

  get Schema() {
    return this._schema;
  }

  AddType(item: IDecorator<IGqlType>) {
    MetadataStorage.Instance.Di.AddService(item);
    this._objectTypes.set(item.class, item);
  }

  AddField(item: IDecorator<IField>) {
    this._fields.push(item);
  }

  AddQuery(item: IDecorator<IQuery>) {
    this._fields.push(item);
  }

  AddResolver(item: IDecorator<IResolver>) {
    MetadataStorage.Instance.Di.AddService(item);
    this._objectTypes.set(item.class, item);
  }

  Build() {
    const query = this.buildObjectTypes("Query");
    const mutation = this.buildObjectTypes("Mutation");
    const inputType = this.buildObjectTypes("InputType", true);
    const objectType = this.buildObjectTypes("ObjectType", true);
    const argsType = this.buildObjectTypes("ArgsType", true);
    const types = [
      ...inputType,
      ...objectType,
      ...argsType
    ];
    this._schema = new GraphQLSchema({
      query,
      mutation,
      types
    });
    writeFile(`${__dirname}/schema.gql`, printSchema(this._schema), (err) => {});
  }

  private buildObjectTypes<T = any, U = any>(
    gqlObjectTypeName: GqlType,
    nameWithClassName?: false
  ): GraphQLObjectType;
  private buildObjectTypes<T = any, U = any>(
    gqlObjectTypeName: GqlType,
    nameWithClassName: true
  ): GraphQLObjectType[];
  private buildObjectTypes<T = any, U = any>(
    gqlObjectTypeName: GqlType,
    nameWithClassName: boolean = false
  ) {
    let name: string = gqlObjectTypeName;
    const objects: Map<string, GraphQLFieldConfigMap<T, U>> = new Map();
    this._fields.map((field) => {
      const parentType = this._objectTypes.get(field.class);
      if (
        parentType &&
        parentType.params.gqlTypeName === gqlObjectTypeName
      ) {
        if (nameWithClassName) {
          name = parentType.key;
        }
        const existingFields = objects.get(name);
        const resolve = this.resolveField(field);
        const newField: GraphQLFieldConfig<any, any> = {
          type: this.parseTypeToGql(field),
          args: {},
          description: "",
          deprecationReason: ""
        };
        if (resolve) {
          newField.resolve = resolve;
        }
        objects.set(name, {
          ...existingFields,
          [field.key]: newField
        });
      }
    });
    const values = Array.from(objects).map(([name, fields]) => {
      const params = {
        name,
        fields
      };
      switch (gqlObjectTypeName) {
        case "InputType":
          return new GraphQLInputObjectType(params as any);
        default:
          return new GraphQLObjectType(params as any);
      }
    });
    if (nameWithClassName) {
      return values;
    }
    return values[0];
  }

  private resolveField(field: IDecorator<any>): GraphQLFieldResolver<any, any, any> {
    if (field.params.function) {
      return async (root, args, context, info) => {
        return await this.bindContext(
          field,
          field.params.function
        )(args, context, info, root);
      };
    }
    return undefined;
  }

  private parseTypeToGql(query: IDecorator<IField>) {
    const baseType = query.params.type();
    switch (baseType) {
      case String:
        return GraphQLString;
      case Boolean:
        return GraphQLBoolean;
      case Number:
        return GraphQLFloat;
      default:
        return undefined;
    }
  }
}
