export interface IDecorator<Type> {
  key: string;
  class: Function;
  params: Type;
}
