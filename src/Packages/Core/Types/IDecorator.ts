import { DecoratorCategory } from "../../..";

export interface IDecorator<Type = any> {
  key: string;
  originalClass: Function;
  class: Function;
  params: Type;
  category: DecoratorCategory;
}
