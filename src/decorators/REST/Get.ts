import { MetadataStorage } from "../../logic";

/**
 * Declare a GET endpoint
 */
export const Get = MetadataStorage.getAddEndpointDecorator("GET");
