export interface IType<T> extends Function {
  new (...args: any[]): T;
}
