import {
  RestMetadataBuilder,
  DiMetadataBuilder,
  WsMetadataBuilder,
  GqlMetadataBuilder,
  RoutingMetadataBuilder
} from "..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _restMetadata: RestMetadataBuilder;
  private _diMetadata: DiMetadataBuilder;
  private _wsMetadata: WsMetadataBuilder;
  private _gqlMetadata: GqlMetadataBuilder;
  private _routingMetadata: RoutingMetadataBuilder;

  get Rest() {
    return this._restMetadata;
  }

  get Ws() {
    return this._wsMetadata;
  }

  get Di() {
    return this._diMetadata;
  }

  get Gql() {
    return this._gqlMetadata;
  }

  get Routing() {
    return this._routingMetadata;
  }

  static get Instance() {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }

  constructor() {
    this.Clear();
  }

  Clear() {
    this._routingMetadata = new RoutingMetadataBuilder();
    this._restMetadata = new RestMetadataBuilder();
    this._diMetadata = new DiMetadataBuilder();
    this._wsMetadata = new WsMetadataBuilder();
    this._gqlMetadata = new GqlMetadataBuilder();
  }

  async BuildAll() {
    this._routingMetadata.Build();
    this._restMetadata.Build();
    this._diMetadata.Build();
    this._wsMetadata.Build();
    this._gqlMetadata.Build();
  }
}
