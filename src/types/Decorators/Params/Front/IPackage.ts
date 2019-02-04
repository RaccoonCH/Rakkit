import { IAttribute } from "./IAttribute";

export interface IPackage {
  name?: string;
  description?: string;
  requiredRole?: "default" | "admin";
  icon?: string;
  attributes?: IAttribute[];
}
