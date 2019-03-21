import {
  MetadataStorage,
  TypeFn,
  IFieldParams
} from "../../..";

export function Field();
export function Field(type: TypeFn);
export function Field(params: IFieldParams);
export function Field(type: TypeFn, params: IFieldParams);
export function Field(typeOrParams?: IFieldParams | TypeFn, params?: IFieldParams) {
  const isType = typeof typeOrParams === "function";
  const definedType = isType ? typeOrParams as Function : undefined;
  const definedParams: IFieldParams = isType ? params : typeOrParams as IFieldParams;
  return (target: Object, key: string, descriptor?: PropertyDescriptor): void => {
    const reflectType = () => Reflect.getMetadata("design:type", target, key) as Function;
    const finalType: Function = definedType || reflectType;
    const isArray = Array.isArray(reflectType().prototype);
    MetadataStorage.Instance.Gql.AddField({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        function: undefined,
        partial: false,
        required: false,
        type: finalType,
        deprecationReason: undefined,
        nullable: false,
        isArray,
        ...definedParams
      }
    });
  };
}
