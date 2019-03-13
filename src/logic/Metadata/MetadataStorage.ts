import {
  RestBuilder,
  DiBuilder,
  WsBuilder,
  GqlBuilder
} from "../..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _restMetadata: RestBuilder;
  private _diMetadata: DiBuilder;
  private _wsMetadata: WsBuilder;
  private _gqlMetadata: GqlBuilder;

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
    this._gqlMetadata = new GqlBuilder();
  }

  async BuildAll() {
    this._restMetadata.Build();
    this._diMetadata.Build();
    this._wsMetadata.Build();
    this._gqlMetadata.Build();
  }
}
