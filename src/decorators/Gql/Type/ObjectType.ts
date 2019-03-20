import { DecoratorHelper } from "../../../logic";

export function ObjectType(...interfaces: Function[]): Function {
  return (target: Function): void => {
    DecoratorHelper.getAddTypeFunction(target, "ObjectType", interfaces);
  };
}
