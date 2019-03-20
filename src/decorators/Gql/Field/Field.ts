import {
  MetadataStorage,
  TypeFn
} from "../../..";

export function Field();
export function Field(type: TypeFn);
export function Field(description: string);
export function Field(type: TypeFn, description: string);
export function Field(typeOrDescription?: string | TypeFn, description?: string) {
  const isType = typeof typeOrDescription === "function";
  const definedType = isType ? typeOrDescription as Function : undefined;
  const definedDescription: string = isType ? description : typeOrDescription as string;
  return (target: Object, key: string, descriptor?: PropertyDescriptor): void => {
    const reflectType = () => Reflect.getMetadata("design:type", target, key) as Function;
    const finalType: Function = definedType || reflectType;
    const isArray = Array.isArray(reflectType().prototype);
    MetadataStorage.Instance.Gql.AddField({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        partial: false,
        type: finalType,
        description: definedDescription,
        deprecationReason: undefined,
        nullable: false,
        isArray
      }
    });
  };
}
