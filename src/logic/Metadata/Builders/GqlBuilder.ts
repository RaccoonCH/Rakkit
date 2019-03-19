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
  GraphQLFieldConfig,
  GraphQLInputFieldMap,
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInterfaceType
} from "graphql";
import {
  IDecorator,
  IField,
  IQuery,
  IGqlType,
  IResolver,
  MetadataStorage,
  GqlType,
  GraphQLISODateTime
} from "../../..";
import { writeFile } from "fs";

type Combination = {
  objectType: IDecorator<IGqlType>;
  field: IDecorator<IField>;
};

export class GqlBuilder extends MetadataBuilder {
  private _objectTypes: Map<Function | string, IDecorator<IGqlType>> = new Map();
  private _fields: IDecorator<IField>[] = [];
  private _fieldSetters: IDecorator<Object>[] = [];
  private _objectTypeSetters: IDecorator<Object>[] = [];

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

  AddFieldSetter<Type>(item: IDecorator<Type>) {
    this._fieldSetters.push(item);
  }

  AddTypeSetter<Type>(item: IDecorator<Type>) {
    this._objectTypeSetters.push(item);
  }

  Build() {
    this.applyObjectTypeSetters();
    this.applyIhneritance();
    this.applyGenerics();
    this.applyFieldSetters();
    const interfaceTypes = this.buildObjectTypes<GraphQLInterfaceType>("InterfaceType", true);
    const inputTypes = this.buildObjectTypes<GraphQLInputObjectType>("InputType", true);
    const objectTypes = this.buildObjectTypes("ObjectType", true);
    // const argsTypes = this.buildObjectTypes("ArgsType", true);
    const mutation = this.buildObjectTypes("Mutation");
    const query = this.buildObjectTypes("Query");
    const types = [
      ...interfaceTypes,
      ...inputTypes,
      ...objectTypes
    ];
    this._schema = new GraphQLSchema({
      query,
      mutation,
      types
    });
    this.writeSchemaFile();
  }

  private getGenericName(...strings: string[]) {
    return strings.join("_");
  }

  private applyObjectTypeSetters() {
    this._objectTypeSetters.map((setter) => {
      const objectType = this._objectTypes.get(setter.class);
      if (objectType) {
        objectType.params = {
          ...objectType.params,
          ...setter.params
        };
      }
    });
  }

  private applyFieldSetters() {
    this._fieldSetters.map((setter) => {
      const field = this._fields.find((field) => {
        return (
          field.class === setter.class &&
          field.key === setter.key
        );
      });
      if (field) {
        field.params = {
          ...field.params,
          ...setter.params
        };
      }
    });
  }

  private applyIhneritance() {
    Array.from(this._objectTypes.values()).map((objectType) => {
      const superClassType = Object.getPrototypeOf(objectType.class);
      const superClass = this._objectTypes.get(superClassType);
      if (superClass) {
        objectType.params.interfaces = objectType.params.interfaces.concat(superClass.params.interfaces);
        this._fields.reduce<IDecorator<IField>[]>((prev, field) => {
          const alreadyExists = prev.find((existing) => existing.key === field.key);
          if (
            field.class === superClass.class &&
            !alreadyExists
          ) {
            const newField = {
              ...field,
              class: objectType.class
            };
            this._fields.push(newField);
            return [
              ...prev,
              newField
            ];
          }
          return prev;
        }, []);
      }
    });
    return [];
  }

  private permute(inputArray: any[]) {
    const results = [];
    const permuteFn = (arr: any[], m: any[] = []) => {
      if (arr.length === 0) {
        results.push(m);
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          permuteFn(curr.slice(), m.concat(next));
        }
      }
    };
    permuteFn(inputArray);
    return results;
  }

  // TODO: GENERIC FUNC
  private getAllFieldArrangements(fields: IDecorator<IField>[], objectTypes: IDecorator<IGqlType>[]) {
    const allCombinations = fields.reduce((prev, field) => {
      const combinations = objectTypes.map((objectType) => {
        return [ objectType, field ];
      });
      return [
        ...prev,
        ...combinations
      ];
    }, []);
    return allCombinations;
  }

  private applyGenerics() {
    Array.from(this._objectTypes.values()).map((objectType, index) => {
      if (objectType.params.generic) {
        const genericObjectTypes = Array.from(this._objectTypes.values()).filter((genericObjectType) =>
          genericObjectType.class !== objectType.class &&
          genericObjectType.params.gqlTypeName === objectType.params.gqlTypeName
        );
        const genericFields = this._fields.filter((field) =>
          field.params.generic && field.class === objectType.class
        );
        const arrangements = this.getAllFieldArrangements(
          genericFields,
          genericObjectTypes
        );
        console.log(arrangements);
      }
    });
  }

  private buildObjectTypes<GqlObjectType = GraphQLObjectType>(
    gqlObjectTypeName: GqlType,
    nameWithClassName?: false
  ): GqlObjectType;
  private buildObjectTypes<GqlObjectType = GraphQLObjectType>(
    gqlObjectTypeName: GqlType,
    nameWithClassName: true
  ): GqlObjectType[];
  private buildObjectTypes<GqlObjectType = GraphQLObjectType>(
    gqlObjectTypeName: GqlType,
    nameWithClassName: boolean = false
  ): GqlObjectType | GqlObjectType[] {
    let name: string = gqlObjectTypeName;
    const gqlObjects = Array.from(this._objectTypes.values()).reduce((prev, objectType) => {
      if (!objectType.params.generic) {
        if (nameWithClassName) {
          name = objectType.key;
        }
        if (objectType.params.gqlTypeName === gqlObjectTypeName) {
          const baseParams = {
            name,
            fields: this.getFieldsFunction(objectType)
          };
          let compiled = {};
          switch (gqlObjectTypeName) {
            case "InputType":
              compiled = new GraphQLInputObjectType({
                ...baseParams,
                fields: this.getFieldsFunction<GraphQLInputFieldMap>(objectType)
              });
              break;
            case "InterfaceType":
              compiled = new GraphQLInterfaceType({
                ...baseParams
              });
              break;
            default:
              const interfaces = this.getInterfaces(objectType);
              compiled = new GraphQLObjectType({
                ...baseParams,
                fields: this.getFieldsFunction(objectType, interfaces),
                interfaces: () => {
                  return interfaces.map((gqlInterface) => {
                    return gqlInterface.params.compiled as GraphQLInterfaceType;
                  });
                }
              });
              break;
          }
          objectType.params.compiled = compiled;
          return [
            ...prev,
            compiled
          ];
        }
      }
      return prev;
    }, []);
    if (nameWithClassName) {
      return gqlObjects as any;
    }
    return gqlObjects[0] as any;
  }

  private getInterfaces(
    objectType: IDecorator<IGqlType>
  ) {
    if (objectType.params.interfaces) {
      return objectType.params.interfaces.reduce<IDecorator<IGqlType>[]>((prev, interfaceType) => {
        const foundInterface = this._objectTypes.get(interfaceType);
        if (foundInterface) {
          return [
            ...prev,
            foundInterface
          ];
        }
        return prev;
      }, []);
    }
    return [];
  }

  private getFieldsFunction<FieldType = GraphQLFieldConfigMap<any, any>>(
    objectType: IDecorator<IGqlType>,
    interfaces: IDecorator<IGqlType>[] = []
  ) {
    return () => {
      return this._fields.reduce((prev, field) => {
        const implementsField = interfaces.find((interfaceType) => interfaceType.class === field.class);
        if (
          !field.params.generic &&
          this.isObjectTypeParentOfField(objectType, field) ||
          implementsField
        ) {
          const gqlField: GraphQLFieldConfig<any, any> = {
            type: this.parseTypeToGql(field),
            deprecationReason: field.params.deprecationReason,
            description: field.params.description
          };
          prev[field.key] = gqlField;
        }
        return prev;
      }, {}) as FieldType;
    };
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

  private parseTypeToGql(field: IDecorator<IField>): GraphQLOutputType {
    let finalType: GraphQLOutputType = undefined;
    const baseType = field.params.type();
    const relation = this._objectTypes.get(baseType);
    if (relation) {
      finalType = relation.params.compiled as GraphQLOutputType;
    }
    switch (baseType) {
      case String:
        finalType = GraphQLString;
        break;
      case Boolean:
        finalType = GraphQLBoolean;
        break;
      case Number:
        finalType = GraphQLFloat;
        break;
      case Date:
        finalType = GraphQLISODateTime;
        break;
    }
    if (!field.params.nullable) {
      finalType = GraphQLNonNull(finalType);
    }
    if (field.params.isArray) {
      finalType = GraphQLList(finalType);
    }
    return finalType;
  }

  private isObjectTypeParentOfField(objectType: IDecorator<IGqlType>, field: IDecorator<IField>) {
    const fieldType = field.params.type();
    const isStringType = typeof fieldType === "string";
    if (isStringType) {
      return objectType.key === fieldType;
    }
    return objectType.class === field.class;
  }

  private async writeSchemaFile() {
    const alert = "# DO NOT EDIT THIS FILE, IT'S GENERATED AT EACH APP STARTUP #";
    const data = `${alert}\n\n${printSchema(this._schema)}`;
    return new Promise((resolve, reject) => {
      writeFile(`${__dirname}/schema.gql`, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
