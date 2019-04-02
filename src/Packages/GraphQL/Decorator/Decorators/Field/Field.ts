import {
  MetadataStorage,
  TypeFn,
  IFieldParams,
  DecoratorHelper
} from "../../../../..";

export function Field();
export function Field(type: TypeFn);
export function Field(params: IFieldParams);
export function Field(type: TypeFn, params: IFieldParams);
export function Field(typeOrParams?: IFieldParams | TypeFn, params?: IFieldParams) {
  const isType = typeof typeOrParams === "function";
  const definedType = isType ? typeOrParams as TypeFn : undefined;
  const definedParams: IFieldParams = isType ? params : typeOrParams as IFieldParams;
  return (target: Object, key: string): void => {
    const reflectType: TypeFn = () => Reflect.getMetadata("design:type", target, key);
    const finalType = definedType || reflectType;
    const isArray = Array.isArray(reflectType().prototype);
    MetadataStorage.Instance.Gql.AddField(
      DecoratorHelper.getAddFieldParams(
        target.constructor,
        key,
        finalType,
        isArray,
        definedParams
      )
    );
  };
}
