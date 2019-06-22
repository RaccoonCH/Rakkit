import { MetadataStorage } from "../../../..";

/**
 * Declare a router and mount it to the app main router
 * @param path The endpoint of the router
 */
export function Websocket(namespace?: string): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Ws.AddWebsocket({
      originalClass: target,
      class: target,
      key: target.name,
      category: "ws",
      params: {
        namespace,
        ons: []
      }
    });
  };
}
