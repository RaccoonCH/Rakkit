import { IContext } from "@types";

export type AuthChecker<ContextType = {}, RoleType = string> = (
  resolverData: IContext,
  roles: RoleType[],
) => boolean | Promise<boolean>;

export type AuthMode = "error" | "null";
