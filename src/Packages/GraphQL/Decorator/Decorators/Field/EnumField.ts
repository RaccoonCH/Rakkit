import {
  MetadataStorage,
  IEnumFieldParams,
  DecoratorHelper
} from "../../../../..";

export function EnumField(value: any);
export function EnumField(value: any, params: IEnumFieldParams);
export function EnumField(value: any, params?: IEnumFieldParams) {
  return (target: Object, key: string): void => {
    MetadataStorage.Instance.Gql.AddField(
      DecoratorHelper.getAddFieldParams(
        target.constructor,
        key,
        () => Reflect.getMetadata("design:type", target, key),
        {
          ...(params || {}),
          enumValue: value
        }
      )
    );
  };
}
