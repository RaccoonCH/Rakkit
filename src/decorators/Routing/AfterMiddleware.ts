import { MetadataStorage } from "../../logic";

/**
 * Declare a middleware that execute the function after the endpoint method
 */
export const AfterMiddleware = MetadataStorage.getAddMiddlewareDecorator("AFTER");
