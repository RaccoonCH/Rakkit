import { DecoratorHelper } from "../../logic";

/**
 * Declare a middleware that execute the function after the endpoint method
 */
export const AfterMiddleware = DecoratorHelper.getAddMiddlewareDecorator("AFTER");
