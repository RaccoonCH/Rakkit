import { MetadataStorage } from "../../logic";
/**
 * Declare a middleware that execute the function before the endpoint method
 */
export const BeforeMiddleware = MetadataStorage.getAddMiddlewareDecorator("BEFORE");
