import { IPackage } from "@types";
import { DecoratorStorage } from "@logic";

/**
 * Declare a RakkitPackge to show into front-end
 * It always called after Attribute decorator
 * @param params The RakkitPackage object with informations (description, icon, ...)
 */
export const Package = (params?: IPackage): Function => {
  return (target: Function): void => {
    DecoratorStorage.Instance.AddPackage({
      class: target,
      key: target.name,
      params: {
        ...params,
        attributes: []
      }
    });
  };
};
