import { getConnection, ObjectType, SelectQueryBuilder, getMetadataArgsStorage } from "typeorm";
import { FieldNode, SelectionNode } from "graphql";
import { IRelationQuery, GetResponse, IComposeQueryOptions, ICompiledFieldNode } from "@types";

const queryModelName = "model";

export class TypeormInterface<Entity> {
  private _model: ObjectType<Entity>;

  get Model() {
    return this._model;
  }
  set Model(val: ObjectType<Entity>) {
    this._model = val;
  }

  constructor(model: ObjectType<Entity>) {
    this.Model = model;
  }

  async GetManyAndCount(
    options?: IComposeQueryOptions,
    fields?: ReadonlyArray<FieldNode>
  ): Promise<GetResponse<Entity>> {
    return this.parse(await (await this.ComposeQuery(options, fields)).getManyAndCount(), true);
  }

  async GetMany(
    options?: IComposeQueryOptions,
    fields?: ReadonlyArray<FieldNode>
  ): Promise<GetResponse<Entity>> {
    return this.parse(await (await this.ComposeQuery(options, fields)).getMany(), false);
  }

  Query(
    options?: IComposeQueryOptions,
    fields?: ReadonlyArray<FieldNode>
  ) {
    if (options.count) {
      return this.GetManyAndCount(options, fields);
    }
    return this.GetMany(options, fields);
  }

  /**
   * Compose a TypeORM query from a GraphQL query
   * @param options The other options
   * @param fields Fields to select
   */
  async ComposeQuery(
    options?: IComposeQueryOptions,
    fields?: ReadonlyArray<FieldNode>
  ): Promise<SelectQueryBuilder<Entity>> {
    const conn = getConnection();
    const queryBuilder = conn.createQueryBuilder(this.Model, queryModelName);
    const relationArgs = new Map();
    const selectedFields = await this.compileFields(fields);

    let selectsCount = 0;
    let conditionOperator: "or" | "and" = "and";

    if (options) {
      conditionOperator = options.conditionOperator;

      if (options.orderBy) {
        queryBuilder.orderBy(
          this.getQueryFieldName(options.orderBy.field),
          options.orderBy.direction
        );
      } else {
        queryBuilder.orderBy(this.getQueryFieldName("Id"), "ASC");
      }

      if (options.skip !== undefined) {
        queryBuilder.skip(options.skip);
      }

      if (options.limit !== undefined) {
        queryBuilder.take(options.limit);
      }

      if (options.first) {
        queryBuilder.take(options.first);
      }

      if (options.last) {
        if (!options.orderBy) {
          queryBuilder.orderBy(this.getQueryFieldName("Id"), "DESC");
        } else {
          // Reverse the orderBy parameter
          queryBuilder.orderBy(
            this.getQueryFieldName(options.orderBy.field),
            options.orderBy.direction === "ASC" ? "DESC" : "ASC"
          );
        }
        queryBuilder.take(options.last);
      }

      if (options.relations) {
        // Add relations to the query
        options.relations.map((relation: string | IRelationQuery) => {
          // Convert the relation parameters to a generic object
          let relationObj: IRelationQuery;
          if (typeof relation === "string") {
            relationObj = {
              select: true,
              forArg: relation,
              table: relation
            };
          } else {
            relationObj = relation;
          }
          if (relationObj.table) {
            // Culture.Example => Culture_Example
            const pathProps = relationObj.table.split(".");
            const newAliasName = pathProps.join("_");
            if (relationObj.forArg) {
              relationArgs.set(relationObj.forArg, newAliasName);
            }
            try {
              queryBuilder.expressionMap.findAliasByName(newAliasName);
            } catch (err) {
              const queryFieldName = this.getQueryFieldName(relationObj.table);
              if (relationObj.select) {
                queryBuilder.innerJoinAndSelect(queryFieldName, newAliasName);
              } else {
                queryBuilder.innerJoin(queryFieldName, newAliasName);
              }
            }
          }
        });
      }
    }

    const selectFields = (field: ICompiledFieldNode, parent: string = queryModelName) => {
      const completeFieldName = `${parent}_${field.name}`;
      const fieldPath = `${parent}.${field.name}`;
      if (selectsCount === 0) {
        queryBuilder.select(fieldPath, completeFieldName);
      } else {
        queryBuilder.addSelect(fieldPath, completeFieldName);
      }
      field.fields.map((subField) => {
        selectFields(subField, field.name);
      });
      selectsCount++;
    };
    // Select the primary key to get datas
    const { primaryColumns } = conn.getMetadata(this.Model);
    selectFields({
      name: primaryColumns[0].databaseName,
      fields: []
    });
    selectedFields.map((field) => {
      selectFields(field);
    });

    const parseObjToQuery = (obj: Object, mainField: string = queryModelName, parentProp: string = null) => {
      Object.getOwnPropertyNames(obj).map((prop: string) => {
        const value = obj[prop];

        // Ignore the GraphQL query parameter if the value is not given (= undefined)
        if (value !== undefined) {
          const propPath = this.getQueryFieldName(prop, parentProp, true);

          // If the given value is a relation, join the table and add the conditions into the where
          const relationValue = relationArgs.get(propPath);
          if (relationValue) {
            parseObjToQuery(value, relationValue, propPath);
          } else if (!relationValue && typeof value !== "object") {
            // Add the where condition to the query
            const whereCondition = this.getConditionString(mainField, prop);
            const whereValueToReplace = { [prop]: value };
            if (queryBuilder.expressionMap.wheres.length > 0) {
              if (conditionOperator === "or") {
                queryBuilder.orWhere(whereCondition, whereValueToReplace);
              } else {
                queryBuilder.andWhere(whereCondition, whereValueToReplace);
              }
            } else {
              queryBuilder.where(whereCondition, whereValueToReplace);
            }
          }
        }
      });
    };

    if (options.where) {
      parseObjToQuery(options.where);
    }

    console.log(queryBuilder.getSql());
    console.log(await queryBuilder.getRawAndEntities());

    return queryBuilder;
  }

  private async compileFields(fields?: ReadonlyArray<FieldNode>): Promise<ICompiledFieldNode[]> {
    if (fields) {
      return await fields.reduce(async (arr, field) => {
        return [
          ...await arr,
          await this.compileFieldNode(field)
        ];
      }, Promise.resolve([]));
    }
    return [];
  }

  private async compileFieldNode(field: FieldNode | SelectionNode): Promise<ICompiledFieldNode> {
    const fieldNode = field as FieldNode;
    let compiledSubFieldNodes: ICompiledFieldNode[] = [];
    if (fieldNode.selectionSet) {
      compiledSubFieldNodes = await Promise.all(fieldNode.selectionSet.selections.map((field) => {
        return this.compileFieldNode(field);
      }));
    }
    return {
      name: fieldNode.name.value,
      fields: compiledSubFieldNodes
    };
  }

  private getQueryFieldName(fieldName: string, mainField: string = null, noBase?: boolean): string {
    const fieldProps = fieldName.split(".");
    const basic = (mainField) => mainField ? `${mainField}.${fieldName}` : fieldName;
    if (mainField) {
      return basic(mainField);
    } else {
      return fieldProps.length > 1 ? fieldName : basic(noBase ? null : queryModelName);
    }
  }

  private getConditionString(mainField: string, subField: string): string {
    return `${this.getQueryFieldName(subField, mainField)} = :${subField}`;
  }

  private parse(items: any[], count = false) {
    if (count) {
      return {
        items: items[0],
        count: items[1]
      };
    }
    return { items };
  }
}
