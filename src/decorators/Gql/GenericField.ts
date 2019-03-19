import {
  MetadataStorage,
  IGeneric
} from "../..";

export function GenericField(description?: string) {
  return (target: Object, key: string): void => {
    const reflectType: Function = Reflect.getMetadata("design:type", target, key);
    MetadataStorage.Instance.Gql.AddField({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        generic: true,
        description,
        nullable: false,
        type: () => undefined,
        deprecationReason: undefined,
        isArray: Array.isArray(reflectType.prototype)
      }
    });
  };
}
