import { FrontType, IAttribute } from "@types";
import { DecoratorStorage } from "@logic";

/**
 * Pupulate the attributes into an object,
 * it's a temp variable because it's called before Package decorator
 * It always called before Package decorator
 * @param type The front-end type, it describe how the datas will be displayed
 */
export const Attribute = (
  type: FrontType,
  params: IAttribute = {
    isEditable: true,
    isInHeader: true,
    isSearchable: false,
    placeOrder: 0
  }
): Function => {
  return (target: Object, key: string): void => {
    DecoratorStorage.Instance.AddAttribute({
      class: target.constructor,
      key,
      params: {
        type,
        ...params
      }
    });
  };
};
