import { writeFile } from "fs";
import {
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
  GraphQLInterfaceType,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputType
} from "graphql";
import { MetadataBuilder } from "./MetadataBuilder";
import {
  IDecorator,
  IField,
  IGqlType,
  IResolver,
  MetadataStorage,
  GqlType,
  GraphQLISODateTime,
  IParam
} from "../../..";

export class GqlBuilder extends MetadataBuilder {
  private _objectTypes: Map<Function, IDecorator<IGqlType>> = new Map();
  private _params: Map<Function, IDecorator<IParam>> = new Map();
  private _fields: IDecorator<IField>[] = [];
  private _fieldSetters: IDecorator<Object | Function>[] = [];
  private _objectTypeSetters: IDecorator<Object | Function>[] = [];
  private _schema: GraphQLSchema;

  get _objectTypesList() {
    return Array.from(this._objectTypes.values());
  }

  get Schema() {
    return this._schema;
  }

  get ObjectTypes() {
    return this._objectTypes as ReadonlyMap<Function, IDecorator<IGqlType>>;
  }

  get Fields() {
    return this._fields as ReadonlyArray<IDecorator<IField>>;
  }

  AddType(item: IDecorator<IGqlType>) {
    this._objectTypes.set(item.class, item);
  }

  AddField(item: IDecorator<IField>) {
    this._fields.push(item);
  }

  AddResolver(item: IDecorator<IResolver>) {
    MetadataStorage.Instance.Di.AddService(item);
    this._objectTypes.set(item.class, item);
  }

  AddParam(item: IDecorator<IParam>) {
    this._params.set(item.class, item);
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
    this.applyRequired();
    this.applyIhneritance();

    const interfaceTypes = this.buildObjectTypes<GraphQLInterfaceType>("InterfaceType");
    const inputTypes = this.buildObjectTypes<GraphQLInputObjectType>("InputType");
    const objectTypes = this.buildObjectTypes("ObjectType");
    // const argsTypes = this.buildObjectTypes("ArgsType");
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

  /**
   * Merge GraphQL type with duplicate name
   * @param gqlObjectTypeName The gqlTypeName (ObjectType, InterfaceType, ...)
   */
  private mergeDuplicates(gqlObjectTypeName: GqlType) {
    const duplicatedTypes = this._objectTypesList.filter((dupObjectType) => {
      if (dupObjectType.params.gqlTypeName === gqlObjectTypeName) {
        return this._objectTypesList.find((foundDup) => {
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

  /**
   * Apply ObjectTypeSetters to ObjectTypes
   */
  private applyObjectTypeSetters() {
    this._objectTypeSetters.map((setter) => {
      const objectType = this._objectTypes.get(setter.class);
      this.setSetterParams(setter, objectType);
    });
  }

  /**
   * Apply FieldSetters to Fields
   */
  private applyFieldSetters() {
    this._fieldSetters.map((setter) => {
      const field = this._fields.find((field) => {
        return (
          field.class === setter.class &&
          field.key === setter.key
        );
      });
      this.setSetterParams(setter, field);
    });
  }

  /**
   * Apply the type Ihneritance to ObjectTypes
   */
  private applyIhneritance() {
    this._objectTypesList.map((objectType) => {
      const superClassType = Object.getPrototypeOf(objectType.class);
      const superClass = this._objectTypes.get(superClassType);
      if (superClass) {
        // Implements the superclass's interfaces to the ihnerited class
        objectType.params.interfaces = objectType.params.interfaces.concat(superClass.params.interfaces);
        // Copy the fields of the superclass to the ihnerited class
        this._fields.reduce<IDecorator<IField>[]>((prev, field) => {
          const alreadyExists = prev.find((existing) => existing.key === field.key);
          if (
            field.class === superClass.class &&
            !alreadyExists
          ) {
            const newField = this.copyDecoratorType(
              field,
              { class: objectType.class }
            );
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

  private applyPartials() {
    this.applyChildFieldsTransformation("partial", {
      partial: false,
      nullable: true
    });
  }

  private applyRequired() {
    this.applyChildFieldsTransformation("required", {
      required: false,
      nullable: false
    });
  }

  /**
   * Apply a transformation to each field of a specified FieldType (FieldType is a relation to ObjectType)
   * The type of a field is an ObjectType and it duplicated the ObjectType with the applied transformation of his fields
   * @param transformKey The key condition to apply transformation
   * @param transformation The transformation to apply
   */
  private applyChildFieldsTransformation(transformKey: keyof IField, transformation: Partial<IField>) {
    const prefix = transformKey.charAt(0).toUpperCase() + transformKey.slice(1);
    const classes: Map<string, Function> = new Map();
    // Get types to copy
    const types = this._fields.reduce<IDecorator<IGqlType>[]>((prev, field) => {
      if (field.params[transformKey]) {
        const fieldType: Function = field.params.type();
        const fieldObjectType = this._objectTypes.get(fieldType);
        if (fieldObjectType && !prev.includes(fieldObjectType)) {
          const name = this.prefix(prefix, fieldObjectType.params.name);
          // Create a new class (fake class, function) to set the type of field that own the transformation
          const classType = () => name;
          classes.set(name, classType);
          field.params.type = () => classType;
          prev.push(fieldObjectType);
        }
      }
      return prev;
    }, []);
    types.map((type) => {
      const name = this.prefix(prefix, type.params.name);
      const classType = classes.get(name);
      // Copy the type
      const newType = this.copyDecoratorType(
        type,
        {
          class: classType,
          key: name,
          params: {
            name
          }
        }
      );
      this._objectTypes.set(classType, newType);
      // Copy each field of the type with transformation
      this._fields.map((field) => {
        if (field.class === type.class) {
          const newField = this.copyDecoratorType(
            field,
            {
              class: classType,
              params: {
                ...transformation
              }
            }
          );
          this._fields.push(newField);
        }
      });
    });
  }

  /**
   * Build a GraphQL type (type, interface, input, ...)
   * @param gqlObjectTypeName The gql type to build
   */
  private buildObjectTypes<GqlObjectType = GraphQLObjectType>(gqlObjectTypeName: GqlType): GqlObjectType[] {
    this.mergeDuplicates(gqlObjectTypeName);
    const gqlObjects = this._objectTypesList.reduce((prev, objectType) => {
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

  /**
   * Get interfaces of an ObjectType
   * @param objectType The ObjectType to get interfaced
   */
  private getInterfaces(objectType: IDecorator<IGqlType>) {
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

  /**
   * Get fields of an ObjectType
   * @param objectType The object to get fields
   * @param interfaces The interfaces of the ObjectType to implements fields
   */
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
          field.params.compiled = gqlField;
          this.applyResolveToField(gqlField, field);
          prev[field.key] = gqlField;
        }
        return prev;
      }, {}) as FieldType;
      return fields;
    };
  }

  /**
   * Get the type of a field based on his defined app type
   * @param field The field to get the type
   */
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

  /**
   * Execute a function (resolve) field (Query)
   * @param field The field to be resolved
   */
  private applyResolveToField(
    gqlField: GraphQLFieldConfig<any, any>,
    field: IDecorator<IField>
  ) {
    if (field.params.function) {
      if (field.params.args) {
        const argsType = field.params.args();
        if (!field.params.flatArgs) {
          const objectType = this._objectTypes.get(argsType);
          if (objectType) {
            const args: GraphQLFieldConfigArgumentMap = {
              [objectType.params.name]: {
                type: objectType.params.compiled as GraphQLInputType
              }
            };
            gqlField.args = args;
          }
        } else {
          const fieldType = field.params.type();
          const argMap = this._fields.reduce<GraphQLFieldConfigArgumentMap>((prev, argField) => {
            if (fieldType === argField.class) {
              prev[argField.key] = {
                type: this.parseTypeToGql(argField) as GraphQLInputType
              };
            }
            return prev;
          }, {});
          gqlField.args = argMap;
        }
      }
      gqlField.resolve = async (root, args, context, info) => {
        return await this.bindContext(
          field,
          field.params.function
        )(args, context, info, root);
      };
    }
    return gqlField;
  }

  /**
   * TODO: AppConfig Path
   * Write the schema to a file
   */
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

  /**
   * Get the params of the Field or ObjectType params setter
   * @param setter The Field or ObjectType setter
   * @param current The Field or ObjectType to mutate
   */
  private setSetterParams(setter: IDecorator<Object | Function>, current?: IDecorator<any>) {
    if (current) {
      let params = setter.params;
      if (typeof params === "function") {
        params = (setter.params as Function)(current);
      }
      current.params = {
        ...current.params,
        ...params
      };
      return current;
    }
  }

  private prefix(prefix: string, suffix: string) {
    return prefix + suffix;
  }
}
