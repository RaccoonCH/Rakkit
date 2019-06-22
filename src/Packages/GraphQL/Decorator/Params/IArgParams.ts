import { IArg } from "../..";

export interface IArgParams extends Partial<Pick<IArg, "nullable" | "defaultValue" | "description" | "arrayNullable">>{
}
