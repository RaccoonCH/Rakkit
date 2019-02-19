import { UnauthorizedError, ForbiddenError } from "../errors";
import { AuthChecker, AuthMode } from "../interfaces";
import { HandlerFunction } from "../../../../types";

export function AuthMiddleware(
  authChecker: AuthChecker<any, any>,
  authMode: AuthMode,
  roles: any[],
): HandlerFunction {
  return async (action, next) => {
    const accessGranted = await authChecker(action, roles);
    if (!accessGranted) {
      if (authMode === "null") {
        return null;
      } else if (authMode === "error") {
        throw roles.length === 0 ? new UnauthorizedError() : new ForbiddenError();
      }
    }
    return next();
  };
}
