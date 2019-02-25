import { MetadataStorage } from "../../logic";

/**
 * Declare a router and mount it to the app main router
 * @param path The endpoint of the router
 */
export const Websocket = (): Function => {
  return (target: Function): void => {
    MetadataStorage.Instance.AddWebsocket({
      class: target,
      key: target.name,
      params: {
      }
    });
  };
};
