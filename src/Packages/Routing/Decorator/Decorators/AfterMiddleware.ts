import { DecoratorHelper } from "../../Helpers/DecoratorHelper";

/**
 * Declare a middleware that execute the function after the endpoint method
 */
export const AfterMiddleware = DecoratorHelper.getAddMiddlewareDecorator("AFTER");
