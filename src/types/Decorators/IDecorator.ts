export interface IDecorator<Type> {
  key: string;
  class: Object;
  params: Type;
}
