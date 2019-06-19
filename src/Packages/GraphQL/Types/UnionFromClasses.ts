import { ArrayElements } from "..";

export type UnionFromClasses<TClassesArray extends any[]> = InstanceType<ArrayElements<TClassesArray>>;
