import { MetadataStorage } from "../../logic";

/**
 * Declare a router and mount it to the app main router
 * @param path The endpoint of the router
 */
export function Router(path: string): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Rest.AddRouter({
      originalClass: target,
      class: target,
      key: target.name,
      category: "rest",
      params: {
        path: path.replace(/^\/|\/$/g, ""), // Remove first and last "/"
        endpoints: []
        // extends: params.extends,
      }
    });
  };
}
