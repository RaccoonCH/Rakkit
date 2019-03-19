import {
  MetadataStorage,
  IDeprecation
} from "../..";

export function Deprecated(reason?: string) {
  return (target: Object, key: string): void => {
    MetadataStorage.Instance.Gql.AddFieldSetter<IDeprecation>({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        deprecationReason: reason || "Deprecated"
      }
    });
  };
}
