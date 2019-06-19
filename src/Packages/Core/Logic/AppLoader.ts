import { sync as GlobSync } from "glob";
import {
  ClassOrString
} from "../../..";

export class AppLoader {
  LoadControllers(options: IAppConfig) {
    this.load(options.rest.routers);
    this.load(options.ws.websockets);
    this.load(options.gql.resolvers);
  }

  private load(items: ClassOrString[]) {
    if (items) {
      items.map((controller) => {
        if (typeof controller === "string") {
          const filePaths = GlobSync(controller);
          filePaths.map(require);
        } else {
          controller;
        }
      });
    }
  }
}
