import { DecoratorCategory } from "..";

export interface IDecorator<Type = any> {
  key: string;
  class: Function;
  params: Type;
  category: DecoratorCategory;
}
