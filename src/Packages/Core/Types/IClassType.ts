export interface IClassType<Class = any> extends Function {
  new(...args: any[]): Class;
}
