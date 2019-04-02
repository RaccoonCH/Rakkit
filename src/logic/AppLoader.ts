import { sync as GlobSync } from "glob";
import {
  IAppConfig,
  ClassOrString
} from "..";

export class AppLoader {
  LoadControllers(options: IAppConfig) {
    this.load(options.routers);
    this.load(options.websockets);
    this.load(options.resolvers);
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
