import { MetadataStorage } from "../../logic";

/**
 * Subscribe to a socket.io event
 */
export function On(event: string);
export function On(event: "connection");
export function On(event: "connection" | string): Function {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        event,
        function: descriptor.value
      }
    });
  };
}
