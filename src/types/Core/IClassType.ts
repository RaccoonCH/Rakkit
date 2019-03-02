export interface IClassType<Class> extends Function {
  new(...args: any[]): Class;
}
