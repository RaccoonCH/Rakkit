import {
  MetadataStorage,
  TypeFn,
  IFieldParams,
  DecoratorHelper,
  IField
} from "../../../../..";

export function Field();
export function Field(type: TypeFn);
export function Field(params: IFieldParams);
export function Field(type: TypeFn, params: IFieldParams);
export function Field(typeOrParams?: IFieldParams | TypeFn, params?: IFieldParams) {
  const isType = typeof typeOrParams === "function";
  const definedType = isType ? typeOrParams as TypeFn : undefined;
  const definedParams: Partial<IField> = (isType ? params : typeOrParams as Partial<IField>) || {};
  return (target: Object, key: string, descriptor?: PropertyDescriptor): void => {
    let reflectType: TypeFn = () => Reflect.getMetadata("design:type", target, key);
    if (descriptor) {
      definedParams.resolveType = "Field";
      definedParams.function = descriptor.value;
      reflectType = () => Reflect.getMetadata("design:returntype", target, key);
    }
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
