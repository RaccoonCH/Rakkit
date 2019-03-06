import {
  HttpMethod,
  MiddlewareExecutionTime,
  RestBuilder,
  DiBuilder,
  WsBuilder
} from "../..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _restMetadata: RestBuilder;
  private _diMetadata: DiBuilder;
  private _wsMetadata: WsBuilder;

  get Rest() {
    return this._restMetadata;
  }

  get Ws() {
    return this._wsMetadata;
  }

  get Di() {
    return this._diMetadata;
  }

  static get Instance() {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }

  constructor() {
    this._restMetadata = new RestBuilder();
    this._diMetadata = new DiBuilder();
    this._wsMetadata = new WsBuilder();
  }

  static getAddEndpointDecorator(method: HttpMethod) {
    return (endpoint?: string): Function => {
      return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
        this.Instance.Rest.AddEndpoint({
          class: target.constructor,
          key,
          category: "rest",
          params: {
            endpoint: endpoint || "/",
            method,
            functions: [descriptor.value]
          }
        });
      };
    };
  }

  static getAddMiddlewareDecorator(executionTime: MiddlewareExecutionTime) {
    return (): Function => {
      return (target: Function, key: string, descriptor: PropertyDescriptor): void => {
        const isClass = !key;
        const finalKey = isClass ? target.name : key;
        const finalFunc = isClass ? target : descriptor.value;
        this.Instance.Rest.AddMiddleware({
          class: finalFunc,
          key: finalKey,
          category: "rest",
          params: {
            executionTime,
            function: finalFunc,
            isClass
          }
        });
      };
    };
  }

  async BuildAll() {
    this._restMetadata.Build();
    this._diMetadata.Build();
    this._wsMetadata.Build();
  }
}
