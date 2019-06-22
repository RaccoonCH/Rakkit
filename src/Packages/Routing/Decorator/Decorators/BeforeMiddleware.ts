import { DecoratorHelper } from "../../Helpers/DecoratorHelper";

/**
 * Declare a middleware that execute the function before the endpoint method
 */
export const BeforeMiddleware = DecoratorHelper.getAddMiddlewareDecorator("BEFORE");
