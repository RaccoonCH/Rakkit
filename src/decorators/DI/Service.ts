import { ClassType } from "class-transformer/ClassTransformer";
import { DecoratorStorage } from "../../logic";

export const Service = (): Function => {
  return (target: Function): void => {
    DecoratorStorage.Instance.AddService({
      class: target,
      key: target.name,
      params: {
        instance: new (target as ClassType<any>)()
      }
    });
  };
};
