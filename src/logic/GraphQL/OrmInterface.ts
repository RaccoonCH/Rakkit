import { getConnection, ObjectType, SelectQueryBuilder } from "typeorm";
import { IRelationQuery, QueryArgs } from "@types";

const queryModelName = "model";
interface ComposeQueryOptions extends QueryArgs {
  readonly relations?: (string | IRelationQuery)[];
}

export class OrmInterface<Entity> {
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

  async GetManyAndCount(options?: ComposeQueryOptions) {
    return this.parse(await this.ComposeQuery(options).getManyAndCount(), true);
  }

  async GetMany(options?: ComposeQueryOptions) {
    return this.parse(await this.ComposeQuery(options).getMany(), false);
  }

  Query(options?: ComposeQueryOptions) {
    if (options.count) {
      return this.GetManyAndCount(options);
    }
    return this.GetMany(options);
  }

  /**
   * Compose a TypeORM query from a GraphQL query
   * @param where The where conditions
   * @param options The other options
   */
  ComposeQuery(options?: ComposeQueryOptions): SelectQueryBuilder<Entity> {
    const queryBuilder = getConnection().createQueryBuilder(this.Model, queryModelName);
    const relationArgs = new Map();
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

    return queryBuilder;
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

  private parse(items: Object[], count = false) {
    if (count) {
      return {
        items: items[0],
        count: items[1]
      };
    }
    return { items };
  }
}
