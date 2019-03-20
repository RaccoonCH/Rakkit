import {
  MetadataStorage,
  INullable
} from "../../..";

export function Nullable() {
  return (target: Object, key: string): void => {
    MetadataStorage.Instance.Gql.AddFieldSetter<INullable>({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        nullable: true
      }
    });
  };
}
