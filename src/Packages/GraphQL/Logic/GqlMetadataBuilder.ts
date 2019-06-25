// #region Imports
import { writeFile } from "fs";
import { PubSub, PubSubEngine, withFilter } from "graphql-subscriptions";
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
  GraphQLEnumValueConfigMap,
  GraphQLInputFieldConfig,
  GraphQLScalarType
} from "graphql";
import { MetadataBuilder } from "../../../Packages/Core/Logic/MetadataBuilder";
import { DecoratorHelper } from "..";
import {
  Rakkit,
  IDecorator,
  IField,
  IGqlType,
  IResolver,
  MetadataStorage,
  GqlType,
  GQLISODateTime,
  IParam,
  IHasType,
  IContext,
  IClassType,
  NextFunction,
  TypeFn,
  SetterType,
  ITypeTransformation,
  GQLTimestamp
} from "../../..";
// #endregion

export class GqlMetadataBuilder extends MetadataBuilder {
  private _gqlTypeDefs: IDecorator<IGqlType>[];
  private _transformationGqlDef: ITypeTransformation[];
  private _gqlTypeDefSetters: IDecorator<SetterType<IGqlType>>[];
  private _fieldDefs: IDecorator<IField>[];
  private _fieldDefSetters: IDecorator<SetterType<IField>>[];
  private _mutationTypeDef: IDecorator<IGqlType<typeof GraphQLObjectType>>;
  private _queryTypeDef: IDecorator<IGqlType<typeof GraphQLObjectType>>;
  private _subscriptionTypeDef: IDecorator<IGqlType<typeof GraphQLObjectType>>;
  private _params: Map<Function, IDecorator<IParam>>;
  private _schema: GraphQLSchema;
  private _pubSub: PubSubEngine;

  private get _routingStorage() {
    return MetadataStorage.Instance.Routing;
  }

  get Config() {
    return Rakkit.Instance.Config.gql;
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
    if (this.Config.pubSub) {
      this._pubSub = this.Config.pubSub;
    }

    this.fillClassWithFieldResolvers();
    this.applyTransformationTypes();
    this.renameWithTypeName();
    this.applyObjectTypeSetters();
    this.applyFieldSetters();
    this.applyInheritance();

    // TODO?: TypesToBuild list
    const interfaceTypes = this.buildGqlTypes(GraphQLInterfaceType);
    const inputTypes = this.buildGqlTypes(GraphQLInputObjectType);
    const objectTypes = this.buildGqlTypes(GraphQLObjectType);
    const enumTypes = this.buildGqlTypes(GraphQLEnumType);
    const unionTypes = this.buildGqlTypes(GraphQLUnionType);

    let query = objectTypes.find((gqlType) => gqlType.name === "Query");
    let mutation = objectTypes.find((gqlType) => gqlType.name === "Mutation");
    let subscription = objectTypes.find((gqlType) => gqlType.name === "Subscription");
    const typeDefs = objectTypes.filter((gqlType) =>
      !["Query", "Mutation", "Subscription"].includes(gqlType.name)
    );

    query = this.isQueryUsed(query);
    mutation = this.isQueryUsed(mutation);
    subscription = this.isQueryUsed(subscription);

    const types = [
      ...interfaceTypes,
      ...inputTypes,
      ...typeDefs,
      ...enumTypes,
      ...unionTypes
    ];

    const schemaParams = {
      query,
      mutation,
      types,
      subscription
    };

    this._schema = new GraphQLSchema(schemaParams);

    this.writeSchemaFile();
  }

  Clear() {
    this._gqlTypeDefs = [];
    this._transformationGqlDef = [];
    this._gqlTypeDefSetters = [];
    this._fieldDefs = [];
    this._fieldDefSetters = [];
    this._params = new Map();
    this._pubSub = new PubSub();

    this._queryTypeDef = this.createGqlTypeDef("Query", GraphQLObjectType);
    this._mutationTypeDef = this.createGqlTypeDef("Mutation", GraphQLObjectType);
    this._subscriptionTypeDef = this.createGqlTypeDef("Subscription", GraphQLObjectType);

    this.AddType(this._queryTypeDef);
    this.AddType(this._mutationTypeDef);
    this.AddType(this._subscriptionTypeDef);
  }

  //#region Getters
  GetObjectTypeFieldsLength(objectType: GraphQLObjectType) {
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
  private fillClassWithFieldResolvers() {
    this._gqlTypeDefs.map((typeDef) => {
      if (typeDef.params.name === "Query") {
        this._fieldDefs.find((fieldDef) => {
          if (
            typeDef.originalClass === fieldDef.originalClass &&
            typeDef.params.ofType &&
            fieldDef.params.resolveType === "FieldResolver"
          ) {
            const destination = this.GetOneGqlTypeDef(
              typeDef.params.ofType(),
              GraphQLObjectType
            );
            if (destination) {
              fieldDef.class = destination.class;
            }
          }
        });
      }
    });
  }

  /**
   * Remove unsed schema params to avoid error
   * @param schemaParams The schema params
   * @param schemaType The schema type to remove
   */
  private isQueryUsed(schemaType: GraphQLObjectType) {
    if (this.GetObjectTypeFieldsLength(schemaType) <= 0) {
      if (schemaType.name === "Query") {
        return new GraphQLObjectType({
          ...schemaType.toConfig(),
          fields: {
            _: {
              type: GraphQLBoolean
            }
          }
        });
      }
      return undefined;
    }
    return schemaType;
  }

  /**
   * Build a GraphQL type (type, interface, input, ...)
   * @param gqlObjectTypeName The gql type to build
   */
  private buildGqlTypes<Type extends GqlType>(gqlType: Type) {
    this.mergeDuplicates(gqlType);
    const gqlTypes = this._gqlTypeDefs.reduce<InstanceType<Type>[]>((prev, gqlTypeDef) => {
      if (gqlTypeDef.params.gqlType === gqlType) {
        const compiledGqlType = this.buildGqlType<Type>(gqlTypeDef);
        if (!gqlTypeDef.params.isAbstract) {
          return [
            ...prev,
            compiledGqlType.params.compiled
          ];
        }
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
    const interfaces = this.getInterfaces(gqlTypeDef);
    const baseParams = {
      name: gqlTypeDef.params.name,
      description: gqlTypeDef.params.description
    };
    const resolveWithProvidedFn = async (value: any) => {
      const type = await gqlTypeDef.params.resolveType(value);
      if (typeof type === "string") {
        return type;
      } else {
        const gqlType = this.GetOneGqlTypeDef<any>(
          type as Function,
          GraphQLInterfaceType,
          GraphQLObjectType
        );
        return gqlType.params.compiled || "__typename not found";
      }
    };

    let compiled: any;
    switch (gqlTypeDef.params.gqlType) {
      case GraphQLInputObjectType:
        compiled = new GraphQLInputObjectType({
          ...baseParams,
          fields: this.getFieldsFunction<GraphQLInputFieldMap>(gqlTypeDef, interfaces)
        });
        break;
      case GraphQLInterfaceType:
        const resolveInterfaceFn = async (value: any) => {
          if (!gqlTypeDef.params.resolveType) {
            const interfaceGqlTypeDef = this._gqlTypeDefs.find((interfaceGqlTypeDef) => {
              try {
                return value instanceof interfaceGqlTypeDef.originalClass;
              } catch (err) {}
            });
            if (interfaceGqlTypeDef) {
              return interfaceGqlTypeDef.params.compiled;
            }
            return this.unsafeResolveType(value, gqlTypeDef, GraphQLInterfaceType);
          } else {
            return await resolveWithProvidedFn(value);
          }
        };

        compiled = new GraphQLInterfaceType({
          ...baseParams,
          fields: this.getFieldsFunction(gqlTypeDef, interfaces),
          resolveType: resolveInterfaceFn
        });
        break;
      case GraphQLObjectType:
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
        // Enum from class
        if (!gqlTypeDef.params.enumValues) {
          gqlTypeDef.params.enumValues = this._fieldDefs.reduce<GraphQLEnumValueConfigMap>((prev, fieldDef) => {
            if (fieldDef.originalClass === gqlTypeDef.originalClass) {
              prev[fieldDef.key] = {
                value: fieldDef.params.enumValue,
                deprecationReason: fieldDef.params.deprecationReason,
                description: fieldDef.params.description
              };
            }
            return prev;
          }, {});
        }
        compiled = new GraphQLEnumType({
          ...baseParams,
          values: gqlTypeDef.params.enumValues
        });
        break;
      case GraphQLUnionType:
        const resolveUnionFn = async (value: any) => {
          if (!gqlTypeDef.params.resolveType) {
            const unionGqlClassType = gqlTypeDef.params.unionTypes.find((unionType) => value instanceof unionType);
            if (unionGqlClassType) {
              return this.GetOneGqlTypeDef(unionGqlClassType, GraphQLObjectType).params.compiled;
            }
            return this.unsafeResolveType(value, gqlTypeDef, GraphQLUnionType);
          } else {
            return await resolveWithProvidedFn(value);
          }
        };

        compiled = new GraphQLUnionType({
          ...baseParams,
          types: gqlTypeDef.params.unionTypes.map((unionClassType) => {
            const unionGqlTypeDef = this.GetOneGqlTypeDef(unionClassType, GraphQLObjectType);
            if (unionGqlTypeDef) {
              return unionGqlTypeDef.params.compiled;
            }
            throw new Error(`No type for the class ${unionClassType.name} was found to create the ${gqlTypeDef.params.name} union type`);
          }),
          resolveType: resolveUnionFn
        });
        break;
    }
    gqlTypeDef.params.compiled = compiled;
    return gqlTypeDef;
  }

  /**
   * Resolve the GraphQL typename for UnionType and InterfaceType based on properties
   * @param value The value object
   * @param gqlTypeDef The GraphQL type definition
   * @param gqlType The type to resolve
   */
  private unsafeResolveType<Type extends typeof GraphQLUnionType | typeof GraphQLInterfaceType>(
    value: object,
    gqlTypeDef: IDecorator<IGqlType<any>>,
    gqlType: Type
  ): GraphQLObjectType | undefined {
    const valueKeys = Object.keys(value);
    const possibleTypes = this._fieldDefs.reduce<[IDecorator<IGqlType<typeof GraphQLObjectType>>, IDecorator<IField>[]][]>((prev, fieldDef) => {
      if (
        valueKeys.includes(fieldDef.params.name) &&
        (gqlType === GraphQLUnionType ? gqlTypeDef.params.unionTypes.includes(fieldDef.originalClass) : true)
      ) {
        const fieldGqlTypeDef = this.GetOneGqlTypeDef<any>(
          fieldDef.originalClass,
          GraphQLObjectType
        );
        if (
          fieldGqlTypeDef &&
          (gqlType === GraphQLInterfaceType ? fieldGqlTypeDef.params.implements.includes(gqlTypeDef.originalClass) : true)
        ) {
          let exsitingTypeDef = prev.find((existingTypeDef) => {
            return existingTypeDef[0].originalClass === fieldGqlTypeDef.originalClass;
          });
          if (!exsitingTypeDef) {
            exsitingTypeDef = [fieldGqlTypeDef, []];
            prev.push(exsitingTypeDef);
          }
          const fieldExists = exsitingTypeDef[1].find((existingField) => existingField.key === fieldDef.key);
          if (exsitingTypeDef && !fieldExists) {
            exsitingTypeDef[1].push(fieldDef);
          }
        }
      }
      return prev;
    }, []);
    const bestMatch = possibleTypes.reduce((bestMatch, gqlTypeDef) => {
      if (bestMatch[1].length < gqlTypeDef[1].length) {
        return gqlTypeDef;
      }
      return bestMatch;
    });
    if (bestMatch) {
      return bestMatch[0].params.compiled;
    }
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
          gqlTypeDef.params = {
            ...gqlTypeDef.params,
            ...transformation.rootTransformation
          };
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
   * Apply the type Inheritance to GqlTypes
   */
  private applyInheritance() {
    this._gqlTypeDefs.map((gqlTypeDef) => {
      let superClass = Object.getPrototypeOf(gqlTypeDef.class);
      if (gqlTypeDef.params.extends) {
        superClass = gqlTypeDef.params.extends;
      }
      let superTypeDef = this.GetOneGqlTypeDef(superClass, gqlTypeDef.params.gqlType);
      if (!superTypeDef) {
        superTypeDef = this.GetGqlTypeDefs(superClass)[0];
      }
      // gqlTypeDef -> inheriter
      // superTypeDef -> inherited
      if (superTypeDef) {
        // Implements the superclass's interfaces to the inherited class
        superTypeDef.params.implements.map((toImplement) => {
          // No duplicate
          if (!gqlTypeDef.params.implements.includes(toImplement)) {
            gqlTypeDef.params.implements.push(toImplement);
          }
        });
      }

      // Copy the fields of the superclass to the inherited class
      this._fieldDefs.reduce<IDecorator<IField>[]>((prev, fieldDef) => {
        // Overrided
        const alreadyExists = prev.find((existing) => existing.key === fieldDef.key);
        if (
          (
            fieldDef.class === superClass ||
            gqlTypeDef.params.implements.includes(fieldDef.class)
          ) &&
          !alreadyExists
        ) {
          const newFieldDef = this.copyDecoratorType(
            fieldDef,
            {
              class: gqlTypeDef.class,
              originalClass: gqlTypeDef.class
            }
          );
          this._fieldDefs.push(newFieldDef);
          return [
            ...prev,
            newFieldDef
          ];
        }
        return prev;
      }, []);
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
      case "Subscription":
        fieldDef.class = this._subscriptionTypeDef.class;
        break;
    }
  }

  /**
   * Create an artificial field on runtime
   * @param name The field name
   * @param typeFn The field type
   * @param extraParams The field params
   */
  private createFieldDef(
    name: string,
    typeFn: Function,
    extraParams: Partial<IField>
  ): IDecorator<IField> {
    return DecoratorHelper.getAddFieldParams(
      () => name,
      name,
      () => typeFn,
      extraParams
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
        if (gqlTypeDef.class === fieldDef.class) {
          const gqlField: GraphQLFieldConfig<any, any> = {
            type: this.parseTypeToGql(
              fieldDef.params,
              gqlTypeDef
            ),
            deprecationReason: fieldDef.params.deprecationReason,
            description: fieldDef.params.description
          };
          if (fieldDef.params.resolveType === "Subscription") {
            const subFn = (payload, args, context, infos) => {
              let topics: string[] | string;
              if (typeof fieldDef.params.topics === "function") {
                topics = this.bindContext(
                  fieldDef,
                  fieldDef.params.topics
                )({
                  payload,
                  args,
                  pubSub: this._pubSub,
                  context,
                  infos
                });
              } else {
                topics = fieldDef.params.topics;
              }
              return this._pubSub.asyncIterator(topics);
            };
            if (fieldDef.params.subscribe) {
              gqlField.subscribe = async (payload, args, context, infos) => {
                return await this.bindContext(
                  fieldDef,
                  fieldDef.params.subscribe
                )({
                  payload,
                  args,
                  pubSub: this._pubSub,
                  context,
                  infos
                });
              };
            } else {
              if (fieldDef.params.filter) {
                gqlField.subscribe = withFilter(
                  subFn,
                  async (payload, args, context, infos) => {
                    return await this.bindContext(
                      fieldDef,
                      fieldDef.params.filter
                    )({
                      payload,
                      args,
                      pubSub: this._pubSub,
                      context,
                      infos
                    });
                  }
                );
              } else {
                gqlField.subscribe = subFn;
              }
            }
          }
          if (![GraphQLInputObjectType].includes(gqlTypeDef.params.gqlType)) {
            this.applyResolveToField(gqlField, fieldDef);
          }
          if (
            gqlTypeDef.params.gqlType === GraphQLInputObjectType &&
            fieldDef.params.defaultValue !== undefined
          ) {
            (gqlField as any as GraphQLInputFieldConfig).defaultValue = fieldDef.params.defaultValue;
          }
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
    gqlTypeDef?: IDecorator<IGqlType>
  ): GraphQLOutputType {
    if (typed.nullable === undefined) {
      if (this.Config.nullableByDefault !== undefined) {
        typed.nullable = this.Config.nullableByDefault;
      } else {
        typed.nullable = false;
      }
    }

    let finalType: GraphQLOutputType = undefined;
    const baseType = typed.type();

    if (gqlTypeDef) {
      let relation;

      // If the user force the GqlType
      if (typed.gqlType) {
        relation = this.GetOneGqlTypeDef(
          baseType,
          typed.gqlType
        );
      }

      // A field from an InterfaceType field try first to make a relation a an ObjectType.
      // Because an interface can have a relation to a type or an interface.
      // If the relation doesn't exists with an interface type try with an InterfaceType.
      if (!relation && gqlTypeDef.params.gqlType === GraphQLInterfaceType) {
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
        finalType = this.Config.dateMode === "isoDate" ? GQLISODateTime : GQLTimestamp;
        break;
      default:
        const enumRef = this._gqlTypeDefs.find((typeDef) =>
          typeDef.params.enumRef === baseType &&
          typeDef.params.enumRef !== undefined
        );
        if (enumRef) {
          finalType = enumRef.params.compiled;
        } else {
          if (baseType instanceof GraphQLScalarType) {
            finalType = baseType;
          } else {
            const foundType = this.Config.scalarsMap.find((association) =>
              association.type === baseType
            );
            if (foundType) {
              finalType = foundType.scalar;
            }
          }
        }
        break;
    }
    if (!finalType) {
      typed.noType = true;
      typed.nullable = true;
      typed.arrayDepth = 0;
      finalType = GraphQLBoolean;
    }
    for (let i = typed.arrayDepth - 1; i >= 0 ; i--) {
      if (i < typed.arrayDepth) {
        const nullable = typed.arrayNullable[i];
        if (nullable === undefined || !nullable) {
          finalType = GraphQLNonNull(finalType);
        }
      }
      finalType = GraphQLList(finalType);
    }
    if (!typed.nullable) {
      finalType = GraphQLNonNull(finalType);
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
                  type: this.parseTypeToGql(field.params, gqlTypeDef) as GraphQLInputType,
                  defaultValue: field.params.defaultValue,
                  description: field.params.description
                };
              }
            });
          } else {
            gqlTypeDef = this.GetOneGqlTypeDef(argType, GraphQLInputObjectType);
            prev[arg.name] = {
              type: this.parseTypeToGql(arg, gqlTypeDef) as GraphQLInputType,
              description: arg.description,
              defaultValue: arg.defaultValue
            };
          }
          return prev;
        }, {});
        gqlField.args = argMap;
      }

      let beforeMiddlewares = [];
      let afterMiddlewares = [];

      if (!this.Config.globalMiddlewaresExclude.includes(fieldDef.params.resolveType)) {
        const globalMiddlewares = this.Config.globalMiddlewares;
        const resolverMiddlewares = this._routingStorage.GetUsedMiddlewares(fieldDef, fieldDef.originalClass);
        const queryMiddlewares = this._routingStorage.GetUsedMiddlewares(fieldDef, fieldDef.params.function);

        beforeMiddlewares = this._routingStorage.GetBeforeMiddlewares([
          ...this._routingStorage.Config.globalMiddlewares,
          ...globalMiddlewares,
          ...resolverMiddlewares,
          ...queryMiddlewares
        ]);

        afterMiddlewares = this._routingStorage.GetAfterMiddlewares([
          ...queryMiddlewares,
          ...resolverMiddlewares,
          ...globalMiddlewares,
          ...this._routingStorage.Config.globalMiddlewares
        ]);
      }

      const mainFn = async (gqlContext: IContext, next: NextFunction) => {
        const bindedFn: Function = this.bindContext(
          fieldDef,
          fieldDef.params.function
        );
        const argsList = gqlContext.gql.args ? Array.from(Object.values(gqlContext.gql.args)) : [];
        if (gqlContext.gql.queryType === "Subscription") {
          argsList.push(gqlContext.gql.root);
        }
        return await bindedFn(
          ...argsList,
          gqlContext,
          next
        );
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
    const allMiddlewares = [
      ...beforeMiddlewares,
      main,
      ...afterMiddlewares
    ];
    return async(root, args, context, info) => {
      let mwIndex = -1;
      const argList = this.parseArgs(fieldDef, args);
      const returnType = fieldDef.params.type();
      const returnGqlType = this.GetOneGqlTypeDef<any>(returnType, GraphQLObjectType);
      // TODO?: Parse union type ?
      const baseResponse = returnGqlType ? new (returnGqlType.class as IClassType)() : {};
      const gqlContext: IContext = {
        gql: {
          args: argList,
          rawArgs: args,
          info,
          response: baseResponse,
          root,
          queryType: fieldDef.params.resolveType,
          pubSub: this._pubSub
        },
        apiType: "gql",
        ...context
      };

      const next = async () => {
        mwIndex++;
        if (mwIndex < allMiddlewares.length) {
          const returnedResponse = await allMiddlewares[mwIndex](
            gqlContext,
            next
          );
          if (gqlContext.response && gqlContext.response.body) {
            gqlContext.gql.response = gqlContext.response.body;
          }
          if (gqlContext.body) {
            gqlContext.gql.response = gqlContext.body;
          }
          if (returnedResponse) {
            gqlContext.gql.response = returnedResponse;
          }
          if (fieldDef.params.noType) {
            gqlContext.gql.response = null;
          }
        }
      };

      await next();
      return gqlContext.gql.response;
    };
  }

  /**
   * Parse the arguments of a query
   * @param fieldDef The queried field
   * @param args The field args
   */
  private parseArgs(fieldDef: IDecorator<IField>, args: Object) {
    const fieldArgs = fieldDef.params.args;
    if (fieldArgs) {
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
            fieldArg,
            groupedArg
          );
        } else {
          finalArg[fieldArg.name] = this.createFieldInstance(
            fieldArg,
            args[fieldArg.name]
          );
        }
        return finalArg;
      }, {});
      return parsedArgs;
    }
  }

  /**
   * If the field type is a class, create an instance of the class for this field
   * @param typeFn The field type
   * @param fieldValue The value of the field
   */
  private createFieldInstance(
    fieldDef: IHasType,
    fieldValue: any
  ) {
    if (fieldDef.type) {
      const fieldType = fieldDef.type();
      const fieldGqlTypeDef = this.GetOneGqlTypeDef(fieldType);
      if (fieldGqlTypeDef && fieldValue) {
        const parseArray = (values: any[] | any) => {
          if (Array.isArray(values)) {
            return values.map(parseArray);
          } else {
            if (fieldGqlTypeDef.params.gqlType === GraphQLEnumType) {
              return fieldGqlTypeDef.params.enumValues[fieldValue].value;
            } else {
              const instance = new (fieldType as IClassType)();
              Object.entries(values).map(([key, value]) => {
                const childField = this._fieldDefs.find((fieldDef) =>
                  fieldDef.class === fieldType &&
                  fieldDef.params.name === key
                );
                if (childField) {
                  instance[childField.key] = this.createFieldInstance(childField.params, value);
                }
              });
              return instance;
            }
          }
        };
        const parsed = parseArray(fieldValue);
        return parsed;
      }
    }
    return fieldValue;
  }
  //#endregion

  //#region Misc
  private async writeSchemaFile() {
    if (this.Config.emitSchemaFile) {
      const alert = "# DO NOT EDIT THIS FILE, IT'S GENERATED AT EACH APP STARTUP #";
      const data = `${alert}\n\n${printSchema(this._schema)}`;
      return new Promise((resolve, reject) => {
        writeFile(this.Config.emitSchemaFile, data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  }

  private prefix(...strings: string[]) {
    return strings.join("");
  }
  //#endregion
}
