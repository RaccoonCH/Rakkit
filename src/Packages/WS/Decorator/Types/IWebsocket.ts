import {
  IOn,
  IDecorator
} from "../../../..";

export interface IWebsocket {
  namespace: string;
  ons: IDecorator<IOn>[];
}
