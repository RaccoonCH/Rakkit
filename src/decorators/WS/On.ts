import { MetadataStorage } from "../../logic";

/**
 * Subscribe to a socket.io event
 */
export const On = (message: "connection" | string): Function => {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.AddOn({
      class: target.constructor,
      key,
      params: {
        message,
        function: descriptor.value
      }
    });
  };
};
