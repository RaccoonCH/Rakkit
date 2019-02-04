import { Router as ExpressRouter } from "express";
import { join } from "path";
import { Middleware, Router, Route, Action, FileUtils } from "@logic";
import { Color } from "@misc";
import { IAppConfig } from "@types";
import { sync as GlobSync } from "glob";

// DEPRECATED
export class AppLoader {
  get RpApiOnlyNames(): string[] {
    return this._rpApiOnlyNames;
  }

  get RpNames(): string[] {
    return this._rpNames;
  }

  get ApiPath(): string {
    return this._apiPath;
  }

  get FilesExtension(): string {
    return this._filesExtenstion;
  }

  get Resolvers(): Function[] {
    return this._resolvers;
  }

  get ExpressRouter(): ExpressRouter {
    return this._expressRouter;
  }

  private get AppFileUtil(): FileUtils {
    return this._appFileUtil;
  }
  private _apiPath: string;
  private _filesExtenstion: string = "ts";
  private _resolvers: Function[] = [];
  private _appFileUtil: FileUtils;
  private _expressRouter: ExpressRouter = ExpressRouter();
  private _rpNames: string[] = [];
  private _rpApiOnlyNames: string[] = [];

  constructor()
  constructor(apiPath: string)
  constructor(filesExtension: string)
  constructor(apiPath: string, filesExtension: string)
  constructor(apiPath?: string, filesExtension?: string) {
    if (filesExtension) {
      this._filesExtenstion = filesExtension;
    }
    this._appFileUtil = new FileUtils(apiPath || "api");
  }

  LoadControllers(options: IAppConfig) {
    if (options.routers) {
      options.routers.map((controller) => {
        if (typeof controller === "string") {
          const filePaths = GlobSync(
            controller,
            { root: join(__dirname, "../../../app") }
          );
          filePaths.map(require);
        }
      });
    }
  }

  /**
   * It scan all dir into the API folder (each dir represent a RakkitPackage)
   * It automaticaly includes router, and middleware into the api
   * Each RakkitPackage is accessible with his endpoint
   * Example with a RakkitPackage named: Page
   * .../api/Page/myRouteDeclaredIntoTheRouter
   */
  Load(): string[] {
    const rpNames = [];
    const LoadRp = (rpName: string): void => {
      if (!this.rpExists(rpName)) {
        rpNames.push(rpName);
        const routerFile = this.getRpObjectPath(rpName, "router");
        const controllerFile = this.getRpObjectPath(rpName, "controller");
        const middlewareFile = this.getRpObjectPath(rpName, "middleware");
        const modelFile = this.getRpObjectPath(rpName, "model");

        const apiOnly = !this.AppFileUtil.FileExists(modelFile);
        if (apiOnly) {
          this._rpApiOnlyNames.push(rpName);
        }

        if (this.AppFileUtil.FileExists(controllerFile)) {

          // If the controller file exists, add the class into resolvers for type-graphql
          this.AppFileUtil.FileExists(controllerFile) && this.Resolvers.push(require(controllerFile).default);

          if (this.AppFileUtil.FileExists(routerFile)) {
            // Load middlewares if middleware file exists
            const middlewares: Middleware = this.AppFileUtil.FileExists(middlewareFile) && require(middlewareFile).default;

            // Import router config file and create a new Express router to parse the config file into an Express Router
            const rakkitRouter: Router = require(routerFile).default;
            const apiRouter = ExpressRouter();

            // Load "before" middlewares
            middlewares.Before && middlewares.Before.forEach((rakkitBeforeMiddleware: Action) => apiRouter.use(rakkitBeforeMiddleware));

            // Parsing the Router config file into the Express Router object
            // It's possible to declare routes with an Array or an Object: {method: string, route: string, functions: Function[] | Function}
            rakkitRouter.Routes.forEach((rakkitRouter: Route) => {
              // apiRouter.get('/...', () => {...})
              apiRouter[rakkitRouter.Method](rakkitRouter.Route, ...rakkitRouter.Actions);
            });

            // Load "after" middlewares
            middlewares.After && middlewares.After.forEach((rakkitAfterMiddleware: Action) => apiRouter.use(rakkitAfterMiddleware));

            // Import API with the right route name .../api/page (for example)
            this.ExpressRouter.use(`/${rakkitRouter.Name || rpName.toLocaleLowerCase()}`, apiRouter);
          }

          console.log("✅  RP:", Color(`${rpName.toLocaleLowerCase()}`, "fg.green"), apiOnly ? " - API only" : "");
        } else {
          console.log(`❌  RP: ${rpName} - ${Color("the controller is required", "fg.red")}`);
        }
      }
    };

    // Load all RakkitPackage
    this.AppFileUtil.ScanDir(LoadRp);
    this._rpNames = [
      ...this.RpNames,
      ...rpNames
    ];
    return rpNames;
  }

  /**
   * Get the RakkitPackageObject absolute path from the root dir
   * @param rpName The RakkitPackage name
   * @param rpObjectName The RakkitPackageObject name (controller, router, model, args, ...)
   */
  private getRpObjectPath(rpName: string, rpObjectName: string): string {
    return this.AppFileUtil.GetFilePath(
      join(rpName, `${rpName + rpObjectName.charAt(0).toLocaleUpperCase() + rpObjectName.slice(1).toLocaleLowerCase()}.${this.FilesExtension}`)
    );
  }

  private rpExists(rpName: string) {
    return this.RpNames.indexOf(rpName) >= 0;
  }
}
