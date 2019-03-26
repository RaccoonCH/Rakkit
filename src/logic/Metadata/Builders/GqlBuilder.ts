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
  IParam,
  IHasType,
  IContext,
  IClassType,
  NextFunction,
  TypeFn,
  DecoratorHelper
} from "../../..";

export class GqlBuilder extends MetadataBuilder {
  private _gqlTypes: IDecorator<IGqlType>[] = [];
  private _params: Map<Function, IDecorator<IParam>> = new Map();
  private _fields: IDecorator<IField>[] = [];
  private _fieldSetters: IDecorator<Object | Function>[] = [];
  private _objectTypeSetters: IDecorator<Object | Function>[] = [];
  private _schema: GraphQLSchema;
  private _mutationType: IDecorator<IGqlType>;
  private _queryType: IDecorator<IGqlType>;

  private get _routingStorage() {
    return MetadataStorage.Instance.Routing;
  }

  constructor() {
    super();

    this._queryType = this.createObjectType("Query");
    this._mutationType = this.createObjectType("Mutation");

    this.AddType(this._queryType);
    this.AddType(this._mutationType);
  }

  get Schema() {
    return this._schema;
  }

  get ObjectTypes() {
    return this._gqlTypes as ReadonlyArray<IDecorator<IGqlType>>;
  }

  get Fields() {
    return this._fields as ReadonlyArray<IDecorator<IField>>;
  }

  AddType(item: IDecorator<IGqlType>) {
    this._gqlTypes.push(item);
  }

  AddField(item: IDecorator<IField>) {
    switch (item.params.resolveType) {
      case "Mutation":
        item.class = this._mutationType.class;
        break;
      case "Query":
        item.class = this._queryType.class;
        break;
    }
    this._fields.push(item);
  }

  AddResolver(item: IDecorator<IResolver>) {
    MetadataStorage.Instance.Di.AddService(item);
    this.AddType(item);
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
    this.renameWithTypeName();
    this.applyObjectTypeSetters();
    this.applyFieldSetters();
    this.applyIhneritance();

    const interfaceTypes = this.buildObjectTypes<GraphQLInterfaceType>("InterfaceType");
    const inputTypes = this.buildObjectTypes<GraphQLInputObjectType>("InputType");
    const objectTypes = this.buildObjectTypes("ObjectType");
    const query = objectTypes.find((gqlType) => gqlType.name === "Query");
    const mutation = objectTypes.find((gqlType) => gqlType.name === "Mutation");

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

  GetGqlTypes(classType: Function, gqlTypeName?: GqlType) {
    const types = this._gqlTypes.filter((objectType) => {
      return (
        objectType.class === classType &&
        (gqlTypeName ? objectType.params.gqlTypeName === gqlTypeName : true)
      );
    });
    return types;
  }

  GetOneGqlType(classType: Function, gqlTypeName?: GqlType) {
    return this.GetGqlTypes(classType, gqlTypeName)[0];
  }

  // TODO: Prefix
  CreatePartial(classType: Function): Function[];
  // TODO: better way for RenameWithTypeName()
  CreatePartial(classType: Function, gqlTypeName: GqlType, name?: string): Function;
  CreatePartial(
    classType: Function,
    gqlTypeName?: GqlType,
    name?: string
  ): Function[] | Function {
    this.renameWithTypeName();
    const targetTypes = this.GetGqlTypes(classType, gqlTypeName);
    const newTypes = targetTypes.map((targetType) => {
      const partialName = name || `Partial${targetType.params.name}`;
      const newType = DecoratorHelper.getAddTypeParams(
        () => name,
        targetType.params.gqlTypeName,
        partialName,
        targetType.params.interfaces
      );
      this.copyFieldsWithTransformation(
        targetType,
        newType,
        { nullable: true }
      );
      return newType;
    });
    if (gqlTypeName) {
      return newTypes[0].class;
    }
    return newTypes.map((newType) => newType.class);
  }

  /**
   * Merge GraphQL type with duplicate name
   * @param gqlObjectTypeName The gqlTypeName (ObjectType, InterfaceType, ...)
   */
  private mergeDuplicates(gqlObjectTypeName: GqlType) {
    const duplicatedTypes = this._gqlTypes.filter((dupObjectType) => {
      if (dupObjectType.params.gqlTypeName === gqlObjectTypeName) {
        return this._gqlTypes.find((foundDup) => {
          return (
            dupObjectType.params.name === foundDup.params.name &&
            dupObjectType !== foundDup
          );
        });
      }
      return false;
    });
    if (duplicatedTypes.length > 0) {
      // Merge fields to one type
      this._fields.map((field) => {
        const dupClass = duplicatedTypes[0].class;
        if (dupClass === field.class) {
          field.class = dupClass;
        }
      });
      duplicatedTypes.map((duplicatedType, index) => {
        if (index > 0) {
          this._gqlTypes.splice(
            this._gqlTypes.indexOf(duplicatedType),
            1
          );
        }
      });
    }
  }

  /**
   * Rename gql type by prefixing his type if there is multiple gql type linked to the same class
   */
  private renameWithTypeName() {
    this._gqlTypes.map((gqlType) => {
      const gqlTypesWithSameClass = this.GetGqlTypes(gqlType.class).filter((gqlType) =>
        gqlType.key === gqlType.params.name
      );
      if (gqlTypesWithSameClass.length > 1) {
        gqlTypesWithSameClass.map((gqlType) => {
          if (gqlType.params.name === gqlType.key) {
            gqlType.params.name = this.prefix(gqlType.params.gqlTypeName, gqlType.params.name);
          }
        });
      }
    });
  }

  private createObjectType(name: string, gqlTypeName: GqlType = "ObjectType") {
    return DecoratorHelper.getAddTypeParams(
      () => name,
      gqlTypeName,
      name,
      []
    );
  }

  /**
   * Apply ObjectTypeSetters to ObjectTypes
   */
  private applyObjectTypeSetters() {
    this._objectTypeSetters.map((setter) => {
      const objectType = this.GetOneGqlType(setter.class);
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
    this._gqlTypes.map((objectType) => {
      const superClassType = Object.getPrototypeOf(objectType.class);
      const superClass = this.GetOneGqlType(superClassType);
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

  private copyFieldsWithTransformation(
    objectType: IDecorator<IGqlType>,
    destination: IDecorator<IGqlType>,
    transformation: Partial<IField>
  ) {
    this.AddType(destination);
    this._fields.map((field) => {
      if (field.class === objectType.class) {
        const newField = this.copyDecoratorType(field, {
          class: destination.class,
          params: transformation
        });
        this.AddField(newField);
      }
    });
  }

  /**
   * Build a GraphQL type (type, interface, input, ...)
   * @param gqlObjectTypeName The gql type to build
   */
  private buildObjectTypes<GqlObjectType = GraphQLObjectType>(gqlObjectTypeName: GqlType): GqlObjectType[] {
    this.mergeDuplicates(gqlObjectTypeName);
    const gqlObjects = this._gqlTypes.reduce((prev, objectType) => {
      if (objectType.params.gqlTypeName === gqlObjectTypeName) {
        const buildedObjectType = this.buildObjectType(
          objectType,
          gqlObjectTypeName
        );
        return [
          ...prev,
          buildedObjectType.params.compiled
        ];
      }
      return prev;
    }, []);
    return gqlObjects;
  }

  private buildObjectType(objectType: IDecorator<IGqlType>, gqlObjectTypeName: GqlType) {
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
    return objectType;
  }

  /**
   * Get interfaces of an ObjectType
   * @param objectType The ObjectType to get interfaced
   */
  private getInterfaces(objectType: IDecorator<IGqlType>) {
    if (objectType.params.interfaces) {
      return objectType.params.interfaces.reduce<IDecorator<IGqlType>[]>((prev, interfaceType) => {
        const foundInterface = this.GetOneGqlType(interfaceType, "InterfaceType");
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
            type: this.parseTypeToGql(
              field.params,
              objectType,
              !!implementsField
            ),
            deprecationReason: field.params.deprecationReason,
            description: field.params.description
          };
          field.params.compiled = gqlField;
          this.applyResolveToField(gqlField, field);
          prev[field.params.name] = gqlField;
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
  private parseTypeToGql(
    typed: IHasType,
    objectType?: IDecorator<IGqlType>,
    fromInterface: boolean = false
  ): GraphQLOutputType {
    let finalType: GraphQLOutputType = undefined;
    const baseType = typed.type();
    if (objectType) {
      // An interface can only have a relation to a "type"
      let relation;

      // A field from an InterfaceType field try first to make a relation a an ObjectType.
      // Because an interface can have a relation to a type or an interface.
      // If the relation doesn't exists with an interface type try with an InterfaceType.
      if (objectType.params.gqlTypeName === "InterfaceType") {
        relation = this.GetOneGqlType(
          baseType,
          "ObjectType"
        );
      }

      if (!relation) {
        relation = this.GetOneGqlType(
          baseType,
          objectType.params.gqlTypeName
        );
      }

      // An field from an ObjectType try first to make a relation to an ObjectType.
      // Because a type can have a relation to a type or an interface.
      // If the relation with an ObjectType doesn't exists it will fallback to an InterfaceType relation
      if (!relation && objectType.params.gqlTypeName === "ObjectType") {
        relation = this.GetOneGqlType(
          baseType,
          "InterfaceType"
        );
      }

      if (relation) {
        finalType = relation.params.compiled as GraphQLOutputType;
      }
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
    if (!typed.nullable) {
      finalType = GraphQLNonNull(finalType);
    }
    if (typed.isArray) {
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
        const argMap = field.params.args.reduce<GraphQLFieldConfigArgumentMap>((prev, arg) => {
          const argType = arg.type();
          let objectType = this.GetOneGqlType(argType);
          if (arg.flat) {
            this._fields.map((field) => {
              if (field.class === objectType.class) {
                prev[field.params.name] = {
                  type: this.parseTypeToGql(field.params, objectType) as GraphQLInputType
                };
              }
            });
          } else {
            objectType = this.GetOneGqlType(argType, "InputType");
            prev[arg.name] = {
              type: this.parseTypeToGql(arg, objectType) as GraphQLInputType
            };
          }
          return prev;
        }, {});
        gqlField.args = argMap;
      }

      const usedMiddlewares = this._routingStorage.GetUsedMiddlewares(field);
      const usedMiddlewaresFn = this._routingStorage.ExtractMiddlewares(usedMiddlewares);
      const beforeMiddlewares = this._routingStorage.GetBeforeMiddlewares(usedMiddlewaresFn);
      const afterMiddlewares = this._routingStorage.GetAfterMiddlewares(usedMiddlewaresFn);

      const mainFn = async (gqlContext: IContext, next: NextFunction) => {
        const bindedFn: Function = this.bindContext(
          field,
          field.params.function
        );
        const argsList = Array.from(Object.values(gqlContext.args));
        await bindedFn(...argsList, gqlContext, next);
      };
      gqlField.resolve = this.createResolveFn(
        field,
        beforeMiddlewares,
        mainFn,
        afterMiddlewares
      );
    }
    return gqlField;
  }

  private createResolveFn(
    field: IDecorator<IField>,
    beforeMiddlewares: Function[],
    main: Function,
    afterMiddlewares: Function[]
  ) {
    let mwIndex = -1;
    const allMiddlewares = [
      ...beforeMiddlewares,
      main,
      ...afterMiddlewares
    ];
    return async(root, args, context, info) => {
      const argList = this.parseArgs(field, args);

      const returnType = field.params.type();
      const returnGqlType = this.GetOneGqlType(returnType, "ObjectType");
      const baseResponse = returnGqlType ? new (returnGqlType.class as IClassType)() : {};

      const gqlContext: IContext = {
        args: argList,
        rawArgs: args,
        info,
        gqlResponse: baseResponse,
        root,
        apiType: "gql",
        ...context
      };

      const next = async () => {
        mwIndex++;
        if (mwIndex < allMiddlewares.length) {
          await allMiddlewares[mwIndex](
            gqlContext,
            next
          );
        }
      };

      await next();
      mwIndex = 0;
      return gqlContext.gqlResponse;
    };
  }

  private parseArgs(field: IDecorator<IField>, args: Object) {
    const fieldArgs = field.params.args;
    const parsedArgs = fieldArgs.reduce((finalArg, fieldArg) => {
      if (fieldArg.flat) {
        const groupedArg = {};
        const parentType = fieldArg.type();
        this._fields.map((flatField) => {
          if (flatField.class === parentType) {
            groupedArg[flatField.params.name] = args[flatField.params.name];
          }
        });
        finalArg[fieldArg.name] = this.createFieldInstance(
          fieldArg.type,
          groupedArg
        );
      } else {
        finalArg[fieldArg.name] = this.createFieldInstance(
          fieldArg.type,
          args[fieldArg.name]
        );
      }
      return finalArg;
    }, {});
    return parsedArgs;
  }

  private createFieldInstance(
    typeFn: TypeFn,
    fieldValue: any
  ) {
    if (typeFn) {
      const fieldType = typeFn();
      const fieldGqlType = this.GetOneGqlType(fieldType);
      if (fieldGqlType && fieldValue) {
        const instance = new (fieldType as IClassType)();
        Object.entries(fieldValue).map(([key, value]) => {
          const childField = this._fields.find((field) =>
            field.class === fieldType &&
            field.params.name === key
          );
          instance[childField.key] = this.createFieldInstance(childField.params.type, value);
        });
        return instance;
      }
    }
    return fieldValue;
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

  private getTypeFields(
    gqlType: IDecorator<IGqlType>,
    additionalCondition?: (
      field: IDecorator<IField>,
      gqlType: IDecorator<IGqlType>
    ) => boolean
  ) {
    return this._fields.filter((field) =>
      field.class === gqlType.class &&
      (additionalCondition ? additionalCondition(field, gqlType) : true)
    );
  }

  private prefix(...strings: string[]) {
    return strings.join("");
  }
}
