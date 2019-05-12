import { MetadataBuilder } from "../../../Packages/Core/Logic/MetadataBuilder";
import {
  IDecorator,
  IOn,
  IWebsocket,
  MetadataStorage
} from "../../..";

export class WsMetadataBuilder extends MetadataBuilder {
  private _websockets: Map<Function, IDecorator<IWebsocket>> = new Map();
  private _ons: IDecorator<IOn>[] = [];

  get Ons() {
    return this._ons as ReadonlyArray<IDecorator<IOn>>;
  }

  get Websockets() {
    return this._websockets as ReadonlyMap<Function, IDecorator<IWebsocket>>;
  }

  AddWebsocket(item: IDecorator<IWebsocket>) {
    item.params.namespace = this.normalizePath(item.params.namespace);
    MetadataStorage.Instance.Di.AddService(item);
    this._websockets.set(item.class, item);
  }

  AddOn(item: IDecorator<IOn>) {
    this._ons.push(item);
  }

  Build() {
    this._ons.map((item) => {
      const wsClass = this._websockets.get(item.class);
      const duplicates = this._ons.filter((on) => {
        const onClass = this._websockets.get(on.class);
        return (
          item.params.event === on.params.event &&
          wsClass.params.namespace === onClass.params.namespace
        );
      });
      if (duplicates.length > 1) {
        throw new Error(`The "${item.params.event}" @On event with the namespace "${wsClass.params.namespace}" already exists`);
      }
      item.params.function = this.bindContext(wsClass, item.params.function);
      wsClass.params.ons.push(item);
    });
  }
}
