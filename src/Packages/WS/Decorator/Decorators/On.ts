import { MetadataStorage } from "../../../..";

/**
 * Subscribe to a socket.io event
 */
export function On(event: string);
export function On(event: "disconnect");
export function On(event: "connection");
export function On(event: string): Function {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.Ws.AddOn({
      originalClass: target.constructor,
      class: target.constructor,
      key,
      category: "ws",
      params: {
        event,
        function: descriptor.value
      }
    });
  };
}
