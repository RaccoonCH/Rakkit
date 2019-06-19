import { IArg } from "../..";

export interface IArgParams extends Partial<Pick<IArg, "name" | "nullable" | "flat" | "defaultValue" | "description" | "arrayNullable">>{
}
