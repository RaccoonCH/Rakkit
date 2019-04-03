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
  GraphQLInputType,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLNamedType
} from "graphql";
import { MetadataBuilder } from "../../../Logic/MetadataBuilder";
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
  DecoratorHelper,
  SetterType,
  ITypeTransformation
} from "../../..";

export class GqlMetadataBuilder extends MetadataBuilder {
  private _gqlTypeDefs: IDecorator<IGqlType>[] = [];
  private _transformationGqlDef: ITypeTransformation[] = [];
  private _gqlTypeDefSetters: IDecorator<SetterType<IGqlType>>[] = [];
  private _fieldDefs: IDecorator<IField>[] = [];
  private _fieldDefSetters: IDecorator<SetterType<IField>>[] = [];
  private _mutationTypeDef: IDecorator<IGqlType<typeof GraphQLObjectType>>;
  private _queryTypeDef: IDecorator<IGqlType<typeof GraphQLObjectType>>;
  private _params: Map<Function, IDecorator<IParam>> = new Map();
  private _schema: GraphQLSchema;

  private get _routingStorage() {
    return MetadataStorage.Instance.Routing;
  }

  constructor() {
    super();

    this._queryTypeDef = this.createGqlTypeDef("Query", GraphQLObjectType);
    this._mutationTypeDef = this.createGqlTypeDef("Mutation", GraphQLObjectType);

    this.AddType(this._queryTypeDef);
    this.AddType(this._mutationTypeDef);
  }

  get Schema() {
    return this._schema;
  }

  get GqlType() {
    return this._gqlTypeDefs as ReadonlyArray<IDecorator<IGqlType>>;
  }

  get Fields() {
    return this._fieldDefs as ReadonlyArray<IDecorator<IField>>;
  }

  AddType(item: IDecorator<IGqlType>) {
    this._gqlTypeDefs.push(item);
  }

  AddTransformation(item: ITypeTransformation) {
    this._transformationGqlDef.push(item);
  }

  AddField(item: IDecorator<IField>) {
    this.setClassIfResolver(item);
    this._fieldDefs.push(item);
  }

  AddResolver(item: IDecorator<IResolver>) {
    MetadataStorage.Instance.Di.AddService(item);
    this.AddType(item);
  }

  AddParam(item: IDecorator<IParam>) {
    this._params.set(item.class, item);
  }

  AddFieldSetter(item: IDecorator<SetterType<IField>>) {
    this.setClassIfResolver(item);
    this._fieldDefSetters.push(item);
  }

  AddTypeSetter(item: IDecorator<SetterType<IGqlType>>) {
    this._gqlTypeDefSetters.push(item);
  }

  Build() {
    this.applyTransformationTypes();
    this.renameWithTypeName();
    this.applyObjectTypeSetters();
    this.applyFieldSetters();
    this.applyIhneritance();

    // TODO?: TypesToBuild list
    const interfaceTypes = this.buildGqlTypes(GraphQLInterfaceType);
    const inputTypes = this.buildGqlTypes(GraphQLInputObjectType);
    const objectTypes = this.buildGqlTypes(GraphQLObjectType);
    const enumTypes = this.buildGqlTypes(GraphQLEnumType);
    const unionTypes = this.buildGqlTypes(GraphQLUnionType);

    const query = objectTypes.find((gqlType) => gqlType.name === "Query");
    const mutation = objectTypes.find((gqlType) => gqlType.name === "Mutation");

    const types = [
      ...interfaceTypes,
      ...inputTypes,
      ...objectTypes,
      ...enumTypes,
      ...unionTypes
    ];

    const schemaParams = {
      query,
      mutation,
      types
    };

    if (this.getObjectTypeFieldsLength(query) <= 0) {
      delete schemaParams.query;
    }
    if (this.getObjectTypeFieldsLength(mutation) <= 0) {
      delete schemaParams.mutation;
    }

    this._schema = new GraphQLSchema(schemaParams);

    this.writeSchemaFile();
  }

  //#region Getters
  getObjectTypeFieldsLength(objectType: GraphQLObjectType) {
    return Object.keys(objectType.getFields()).length;
  }

  /**
   * Get the list of defined GraphQL types that is defined in the app
   * @param classType
   * @param gqlType
   */
  // TODO?: Fallback orGqlTypes
  GetGqlTypeDefs<Type extends GqlType = any>(
    classType: Function,
    ...orGqlTypes: Type[]
  ): IDecorator<IGqlType<Type>>[] {
    const types = this._gqlTypeDefs.filter((gqlTypeDef) => {
      return (
        gqlTypeDef.class === classType &&
        (orGqlTypes.length > 0 ? orGqlTypes.includes(gqlTypeDef.params.gqlType) : true)
      );
    });
    return types;
  }

  /**
   * Get a GraphQL types that is defined in the app.
   * @param classType
   * @param gqlTypeName
   */
  GetOneGqlTypeDef<Type extends GqlType = any>(classType: Function, ...orGqlTypes: Type[]) {
    return this.GetGqlTypeDefs(classType, ...orGqlTypes)[0];
  }

  /**
   * Get gqlTypeDefs by their GraphQL type
   * @param gqlType The GraphQL Type
   */
  GetGqlTypeDefByType<Type extends GqlType>(
    gqlType: Type
  ): IDecorator<IGqlType<Type>>[] {
    return this._gqlTypeDefs.filter((item) =>
      item.params.gqlType === gqlType
    );
  }
  //#endregion

  //#region Build utils
  /**
   * Build a GraphQL type (type, interface, input, ...)
   * @param gqlObjectTypeName The gql type to build
   */
  private buildGqlTypes<Type extends GqlType>(gqlType: Type) {
    this.mergeDuplicates(gqlType);
    const gqlTypes = this._gqlTypeDefs.reduce<InstanceType<Type>[]>((prev, gqlTypeDef) => {
      if (gqlTypeDef.params.gqlType === gqlType) {
        const compiledGqlType = this.buildGqlType<Type>(gqlTypeDef);
        return [
          ...prev,
          compiledGqlType.params.compiled
        ];
      }
      return prev;
    }, []);
    return gqlTypes;
  }

  /**
   * Build a single gqlTypeDef
   * @param gqlTypeDef the gqlTypeDef to build
   */
  private buildGqlType<Type extends GqlType>(gqlTypeDef: IDecorator<IGqlType<Type>>) {
    const baseParams = {
      name: gqlTypeDef.params.name,
      fields: this.getFieldsFunction(gqlTypeDef)
    };

    let compiled: any;
    switch (gqlTypeDef.params.gqlType) {
      case GraphQLInputObjectType:
        compiled = new GraphQLInputObjectType({
          ...baseParams,
          fields: this.getFieldsFunction<GraphQLInputFieldMap>(gqlTypeDef)
        });
        break;
      case GraphQLInterfaceType:
        compiled = new GraphQLInterfaceType({
          ...baseParams
        });
        break;
      case GraphQLObjectType:
        const interfaces = this.getInterfaces(gqlTypeDef);
        compiled = new GraphQLObjectType({
          ...baseParams,
          fields: this.getFieldsFunction(gqlTypeDef, interfaces),
          interfaces: () => {
            return interfaces.map((gqlInterface) => {
              return gqlInterface.params.compiled as GraphQLInterfaceType;
            });
          }
        });
        break;
      case GraphQLEnumType:
        compiled = new GraphQLEnumType({
          ...baseParams,
          values: gqlTypeDef.params.enumValues
        });
        break;
      case GraphQLUnionType:
        compiled = new GraphQLUnionType({
          ...baseParams,
          types: gqlTypeDef.params.unionTypes.map((unionClassType) => {
            const unionGqlTypeDef = this.GetOneGqlTypeDef(unionClassType, GraphQLObjectType);
            if (unionGqlTypeDef) {
              return unionGqlTypeDef.params.compiled;
            }
            throw new Error(`No type for the class ${unionClassType.name} was found to create the ${gqlTypeDef.params.name} union type`);
          })
        });
        break;
    }
    gqlTypeDef.params.compiled = compiled;
    return gqlTypeDef;
  }

  /**
   * Copy a fieldDef and parent gqlType and apply transformations to the field (used for partial and required feature)
   * @param gqlType The gqlTypeDef
   * @param destination the newGqlTypeDef parent
   * @param transformation The transformation to apply to the field
   */
  private copyFieldsWithTransformation(
    gqlTypeDef: IDecorator<IGqlType>,
    destination: IDecorator<IGqlType>,
    transformation: Partial<IDecorator<Partial<IField>>>
  ) {
    return this._fieldDefs.reduce((prev, fieldDef) => {
      if (fieldDef.class === gqlTypeDef.class) {
        const newFieldDef = this.copyDecoratorType(fieldDef, {
          class: destination.class,
          params: transformation.params
        });
        prev.push(newFieldDef);
        this.AddField(newFieldDef);
      }
      return prev;
    }, []);
  }

  /**
   * Create the transformed types and register them
   */
  private applyTransformationTypes() {
    this._gqlTypeDefs.map((gqlTypeDef) => {
      const transformation = gqlTypeDef.params.transformation;
      if (transformation) {
        const searchGqlType = gqlTypeDef.params.gqlType ? [gqlTypeDef.params.gqlType] : [];
        const originalTypeDef = this.GetOneGqlTypeDef(transformation.target, ...searchGqlType);
        if (originalTypeDef) {
          gqlTypeDef.params.gqlType = originalTypeDef.params.gqlType;
          if (transformation.prefix) {
            gqlTypeDef.params.name = transformation.prefix + originalTypeDef.params.name;
          }
          this.copyFieldsWithTransformation(
            originalTypeDef,
            gqlTypeDef,
            transformation.fieldsTransformation
          );
        }
      }
    });
  }

  /**
   * Apply the type Ihneritance to GqlTypes
   */
  private applyIhneritance() {
    this._gqlTypeDefs.map((gqlTypeDef) => {
      let superClass = Object.getPrototypeOf(gqlTypeDef.class);
      if (gqlTypeDef.params.extends) {
        superClass = gqlTypeDef.params.extends;
      }
      const superTypeDef = this.GetOneGqlTypeDef(superClass, gqlTypeDef.params.gqlType);
      // gqlTypeDef -> ihneriter
      // superTypeDef -> ihnerited
      if (superTypeDef) {
        // Implements the superclass's interfaces to the ihnerited class
        gqlTypeDef.params.implements = gqlTypeDef.params.implements.concat(superTypeDef.params.implements);
        // Copy the fields of the superclass to the ihnerited class
        this._fieldDefs.reduce<IDecorator<IField>[]>((prev, field) => {
          // Overrided
          const alreadyExists = prev.find((existing) => existing.key === field.key);
          if (
            field.class === superClass &&
            !alreadyExists
          ) {
            const newField = this.copyDecoratorType(
              field,
              { class: gqlTypeDef.class }
            );
            this._fieldDefs.push(newField);
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

  /**
   * Merge typeDefs with duplicate name to a single typeDef
   * @param gqlType The GraphQL Type subject
   */
  private mergeDuplicates(gqlType: GqlType) {
    const duplicatedTypeDefs = this._gqlTypeDefs.filter((dupGqlTypeDef) => {
      if (dupGqlTypeDef.params.gqlType === gqlType) {
        return this._gqlTypeDefs.find((foundDup) => {
          return (
            dupGqlTypeDef.params.name === foundDup.params.name &&
            dupGqlTypeDef !== foundDup
          );
        });
      }
      return false;
    });
    if (duplicatedTypeDefs.length > 0) {
      // Merge fields to one type
      this._fieldDefs.map((fieldDef) => {
        const dupClass = duplicatedTypeDefs[0].class;
        if (dupClass === fieldDef.class) {
          fieldDef.class = dupClass;
        }
      });
      duplicatedTypeDefs.map((duplicatedTypeDef, index) => {
        if (index > 0) {
          this._gqlTypeDefs.splice(
            this._gqlTypeDefs.indexOf(duplicatedTypeDef),
            1
          );
        }
      });
    }
  }

  /**
   * Rename typeDef by prefixing his type if there is multiple typeDef linked to the same class
   * Example - this class has two types, if they haven't declared names,
   * we need to generate a name for each type to avoid GraphQL schema duplicated name error:
   * @ObjectType()
   * @InputType()
   * class MyClass { ... }
   */
  private renameWithTypeName() {
    this._gqlTypeDefs.map((gqlTypeDef) => {
      const gqlTypesWithSameClass = this.GetGqlTypeDefs(gqlTypeDef.class).filter((gqlType) =>
        gqlType.key === gqlType.params.name
      );
      if (gqlTypesWithSameClass.length > 1) {
        gqlTypesWithSameClass.map((gqlType) => {
          if (gqlType.params.name === gqlType.key) {
            gqlType.params.name = this.prefix(gqlType.params.gqlType.name, gqlType.params.name);
          }
        });
      }
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
  //#endregion

  //#region GqlTypeDef utils
  /**
   * Get interfaces of a gqlTypeDef
   * @param gqlType Get the interfaces of this gqlTyeDef
   */
  private getInterfaces(gqlTypeDef: IDecorator<IGqlType>) {
    if (gqlTypeDef.params.implements) {
      return gqlTypeDef.params.implements.reduce<IDecorator<IGqlType<typeof GraphQLInterfaceType>>[]>((prev, interfaceType) => {
        const foundInterface = this.GetOneGqlTypeDef(interfaceType, GraphQLInterfaceType);
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
   * Apply ObjectTypeSetters to ObjectTypes
   */
  private applyObjectTypeSetters() {
    this._gqlTypeDefSetters.map((setter) => {
      const gqlTypeDefs = this.GetGqlTypeDefs(setter.class);
      gqlTypeDefs.map((gqlTypeDef) => {
        this.setSetterParams(setter, gqlTypeDef);
      });
    });
  }

  /**
   * Create an artificial GqlTypeDef at runtime
   * @param name The gqlTypeDef name
   * @param gqlType The GraphQL Type
   */
  private createGqlTypeDef<Type extends GqlType>(
    name: string,
    gqlType: Type
  ) {
    return DecoratorHelper.getAddTypeParams<Type>(
      () => name,
      gqlType,
      name
    );
  }

  /**
   * Get the fields of a gqlTypeDef
   * @param gqlTypeDef The gqlTypeDef
   * @param additionalCondition Additional conditions to filter fields
   */
  private getFieldsOfTypeDefs(
    gqlTypeDef: IDecorator<IGqlType>,
    additionalCondition?: (
      fieldDef: IDecorator<IField>,
      gqlTypeDef: IDecorator<IGqlType>
    ) => boolean
  ) {
    return this._fieldDefs.filter((fieldDef) =>
      fieldDef.class === gqlTypeDef.class &&
      (additionalCondition ? additionalCondition(fieldDef, gqlTypeDef) : true)
    );
  }
  //#endregion

  //#region FieldDef utils
  /**
   * If the field is on a resolver, assign the field class with the query or mutation gqlTypeDef
   * @param fieldDef The field definition
   */
  private setClassIfResolver(fieldDef: IDecorator<any>) {
    switch (fieldDef.params.resolveType) {
      // Add a prop to not mutate the original class: gqlTypeClass ?
      case "Mutation":
        fieldDef.class = this._mutationTypeDef.class;
        break;
      case "Query":
        fieldDef.class = this._queryTypeDef.class;
        break;
    }
  }

  /**
   * Create an artificial field on runtime
   * @param name The field name
   * @param typeFn The field type
   * @param isArray Is the fieldType an array
   */
  // TODO: isNullable
  private createFieldDef(
    name: string,
    typeFn: Function,
    isArray: boolean
  ): IDecorator<IField> {
    return DecoratorHelper.getAddFieldParams(
      () => name,
      name,
      () => typeFn,
      isArray
    );
  }

  /**
   * Apply FieldSetters to Fields
   */
  private applyFieldSetters() {
    this._fieldDefSetters.map((setter) => {
      const fieldDef = this._fieldDefs.find((fieldDef) => {
        return (
          // The class can be mutated by the setClassIfResolver
          fieldDef.originalClass === setter.originalClass &&
          fieldDef.key === setter.key
        );
      });
      this.setSetterParams(setter, fieldDef);
    });
  }

  /**
   * Get fields of an ObjectType
   * @param objectType The object to get fields
   * @param interfaces The interfaces of the ObjectType to implements fields
   */
  private getFieldsFunction<FieldType = GraphQLFieldConfigMap<any, any>>(
    gqlTypeDef: IDecorator<IGqlType>,
    interfaces: IDecorator<IGqlType>[] = []
  ) {
    return () => {
      const fieldDefs = this._fieldDefs.reduce((prev, fieldDef) => {
        const implementsField = interfaces.find((interfaceType) => interfaceType.class === fieldDef.class);
        if (
          gqlTypeDef.class === fieldDef.class ||
          implementsField
        ) {
          const gqlField: GraphQLFieldConfig<any, any> = {
            type: this.parseTypeToGql(
              fieldDef.params,
              gqlTypeDef,
              !!implementsField
            ),
            deprecationReason: fieldDef.params.deprecationReason,
            description: fieldDef.params.description
          };
          this.applyResolveToField(gqlField, fieldDef);
          prev[fieldDef.params.name] = gqlField;
        }
        return prev;
      }, {}) as FieldType;
      return fieldDefs;
    };
  }

  /**
   * Get the type of a field based on his defined app type
   * @param field The field to get the type
   */
  private parseTypeToGql(
    typed: IHasType,
    gqlTypeDef?: IDecorator<IGqlType>,
    fromInterface: boolean = false
  ): GraphQLOutputType {
    let finalType: GraphQLOutputType = undefined;
    const baseType = typed.type();
    if (gqlTypeDef) {
      let relation;

      // A field from an InterfaceType field try first to make a relation a an ObjectType.
      // Because an interface can have a relation to a type or an interface.
      // If the relation doesn't exists with an interface type try with an InterfaceType.
      if (gqlTypeDef.params.gqlType === GraphQLInterfaceType) {
        relation = this.GetOneGqlTypeDef(
          baseType,
          GraphQLObjectType
        );
      }

      if (!relation) {
        // Search in $gqlType, GraphQLUnionType and EnumType (for queries, and enums)
        relation = this.GetOneGqlTypeDef(
          baseType,
          gqlTypeDef.params.gqlType,
          GraphQLUnionType,
          GraphQLEnumType
        );
      }

      // An field from an ObjectType try first to make a relation to an ObjectType.
      // Because a type can have a relation to a type or an interface.
      // If the relation with an ObjectType doesn't exists it will fallback to an InterfaceType relation
      if (!relation && gqlTypeDef.params.gqlType === GraphQLObjectType) {
        relation = this.GetOneGqlTypeDef(
          baseType,
          GraphQLInterfaceType
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
    fieldDef: IDecorator<IField>
  ) {
    if (fieldDef.params.function) {
      if (fieldDef.params.args) {
        const argMap = fieldDef.params.args.reduce<GraphQLFieldConfigArgumentMap>((prev, arg) => {
          const argType = arg.type();
          let gqlTypeDef = this.GetOneGqlTypeDef(argType);
          if (arg.flat) {
            this._fieldDefs.map((field) => {
              if (field.class === gqlTypeDef.class) {
                prev[field.params.name] = {
                  type: this.parseTypeToGql(field.params, gqlTypeDef) as GraphQLInputType
                };
              }
            });
          } else {
            gqlTypeDef = this.GetOneGqlTypeDef(argType, GraphQLInputObjectType);
            prev[arg.name] = {
              type: this.parseTypeToGql(arg, gqlTypeDef) as GraphQLInputType
            };
          }
          return prev;
        }, {});
        gqlField.args = argMap;
      }

      const usedMiddlewares = this._routingStorage.GetUsedMiddlewares(fieldDef);
      const usedMiddlewaresFn = this._routingStorage.ExtractMiddlewares(usedMiddlewares);
      const beforeMiddlewares = this._routingStorage.GetBeforeMiddlewares(usedMiddlewaresFn);
      const afterMiddlewares = this._routingStorage.GetAfterMiddlewares(usedMiddlewaresFn);

      const mainFn = async (gqlContext: IContext, next: NextFunction) => {
        const bindedFn: Function = this.bindContext(
          fieldDef,
          fieldDef.params.function
        );
        const argsList = Array.from(Object.values(gqlContext.args));
        await bindedFn(...argsList, gqlContext, next);
      };
      gqlField.resolve = this.createResolveFn(
        fieldDef,
        beforeMiddlewares,
        mainFn,
        afterMiddlewares
      );
    }
    return gqlField;
  }

  /**
   * Create a resolver function for the field
   * @param fieldDef The resolved field
   * @param beforeMiddlewares The middlewares that is executed before the resolve function
   * @param main The main resolve function
   * @param afterMiddlewares The middlewares that is executed after the resolve function
   */
  private createResolveFn(
    fieldDef: IDecorator<IField>,
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
      const argList = this.parseArgs(fieldDef, args);

      const returnType = fieldDef.params.type();
      const returnGqlType = this.GetOneGqlTypeDef(returnType, GraphQLObjectType);
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

  /**
   * Parse the arguments of a query
   * @param fieldDef The queried field
   * @param args The field args
   */
  private parseArgs(fieldDef: IDecorator<IField>, args: Object) {
    const fieldArgs = fieldDef.params.args;
    const parsedArgs = fieldArgs.reduce((finalArg, fieldArg) => {
      if (fieldArg.flat) {
        const groupedArg = {};
        const parentType = fieldArg.type();
        this._fieldDefs.map((flatFieldDef) => {
          if (flatFieldDef.class === parentType) {
            groupedArg[flatFieldDef.params.name] = args[flatFieldDef.params.name];
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

  /**
   * If the field type is a class, create an instance of the class for this field
   * @param typeFn The field type
   * @param fieldValue The value of the field
   */
  private createFieldInstance(
    typeFn: TypeFn,
    fieldValue: any
  ) {
    if (typeFn) {
      const fieldType = typeFn();
      const fieldGqlTypeDef = this.GetOneGqlTypeDef(fieldType);
      if (fieldGqlTypeDef && fieldValue) {
        const instance = new (fieldType as IClassType)();
        Object.entries(fieldValue).map(([key, value]) => {
          const childField = this._fieldDefs.find((fieldDef) =>
            fieldDef.class === fieldType &&
            fieldDef.params.name === key
          );
          instance[childField.key] = this.createFieldInstance(childField.params.type, value);
        });
        return instance;
      }
    }
    return fieldValue;
  }
  //#endregion

  //#region Misc
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

  private prefix(...strings: string[]) {
    return strings.join("");
  }
  //#endregion
}
