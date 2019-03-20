import {
  MetadataStorage,
  IPartial
} from "../../..";

export function Partial() {
  return (target: Object, key: string): void => {
    MetadataStorage.Instance.Gql.AddFieldSetter<IPartial>({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        partial: true
      }
    });
  };
}
