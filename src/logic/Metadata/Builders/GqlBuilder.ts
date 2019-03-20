import { writeFile } from "fs";
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
import { MetadataBuilder } from "./MetadataBuilder";
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

export class GqlBuilder extends MetadataBuilder {
  private _objectTypes: Map<Function, IDecorator<IGqlType>> = new Map();
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
    this.applyFieldSetters();
    this.applyPartials();
    this.applyIhneritance();
    const interfaceTypes = this.buildObjectTypes<GraphQLInterfaceType>("InterfaceType");
    const inputTypes = this.buildObjectTypes<GraphQLInputObjectType>("InputType");
    const objectTypes = this.buildObjectTypes("ObjectType");
    // const argsTypes = this.buildObjectTypes("ArgsType", true);
    const mutation = this.buildObjectTypes("Mutation")[0];
    const query = this.buildObjectTypes("Query")[0];
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

  private mergeDuplicates(gqlObjectTypeName: GqlType) {
    const duplicatedTypes = Array.from(this._objectTypes.values()).filter((dupObjectType) => {
      if (dupObjectType.params.gqlTypeName === gqlObjectTypeName) {
        return Array.from(this._objectTypes.values()).find((foundDup) => {
          return (
            dupObjectType.params.name === foundDup.params.name &&
            dupObjectType !== foundDup
          );
        });
      }
      return false;
    }).map((duplicatedType) => duplicatedType.class);
    // Merge fields to one type
    this._fields.map((field) => {
      if (duplicatedTypes.includes(field.class)) {
        field.class = duplicatedTypes[0];
      }
    });
    duplicatedTypes.map((duplicatedType, index) => {
      if (index > 0) {
        this._objectTypes.delete(duplicatedType);
      }
    });
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

  private applyPartials() {
    const getPartialName = (name: string) => {
      return `Partial${name}`;
    };
    const partialClasses: Map<string, Function> = new Map();
    const partialTypes = this._fields.reduce<IDecorator<IGqlType>[]>((prev, field) => {
      if (field.params.partial) {
        const fieldType: Function = field.params.type();
        const fieldObjectType = this._objectTypes.get(fieldType);
        if (fieldObjectType && !prev.includes(fieldObjectType)) {
          const partialName = getPartialName(fieldType.name);
          const partialClass = () => partialName;
          partialClasses.set(partialName, partialClass);
          field.params.type = () => partialClass;
          prev.push(fieldObjectType);
        }
      }
      return prev;
    }, []);
    partialTypes.map((partial) => {
      const partialName = getPartialName(partial.params.name);
      const partialClass = partialClasses.get(partialName);
      const newPartial: IDecorator<IGqlType> = {
        ...partial,
        class: partialClass,
        key: partialName,
        params: {
          ...partial.params,
          name: partialName
        }
      };
      this._objectTypes.set(partialClass, newPartial);
      this._fields.map((field) => {
        if (field.class === partial.class) {
          const partialField: IDecorator<IField> = {
            ...field,
            class: partialClass,
            params: {
              ...field.params,
              partial: false,
              nullable: true
            }
          };
          this._fields.push(partialField);
        }
      });
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

  private buildObjectTypes<GqlObjectType = GraphQLObjectType>(
    gqlObjectTypeName: GqlType
  ): GqlObjectType[] {
    this.mergeDuplicates(gqlObjectTypeName);
    const gqlObjects = Array.from(this._objectTypes.values()).reduce((prev, objectType) => {
      if (objectType.params.gqlTypeName === gqlObjectTypeName) {
        const baseParams = {
          name: objectType.params.name,
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
      return prev;
    }, []);
    return gqlObjects;
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
      const fields = this._fields.reduce((prev, field) => {
        const implementsField = interfaces.find((interfaceType) => interfaceType.class === field.class);
        if (
          objectType.class === field.class ||
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
      return fields;
    };
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
