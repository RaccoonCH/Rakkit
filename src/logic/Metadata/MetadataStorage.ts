import {
  RestBuilder,
  DiBuilder,
  WsBuilder,
  GqlBuilder,
  RoutingBuilder
} from "../..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _restMetadata: RestBuilder;
  private _diMetadata: DiBuilder;
  private _wsMetadata: WsBuilder;
  private _gqlMetadata: GqlBuilder;
  private _routingMetadata: RoutingBuilder;

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
    this._routingMetadata = new RoutingBuilder();
    this._restMetadata = new RestBuilder();
    this._diMetadata = new DiBuilder();
    this._wsMetadata = new WsBuilder();
    this._gqlMetadata = new GqlBuilder();
  }

  async BuildAll() {
    this._routingMetadata.Build();
    this._restMetadata.Build();
    this._diMetadata.Build();
    this._wsMetadata.Build();
    this._gqlMetadata.Build();
  }
}
