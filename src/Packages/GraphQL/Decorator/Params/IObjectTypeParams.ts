import {
  IGqlTypeParams
} from "../..";

export interface IObjectTypeParams extends IGqlTypeParams {
  implements?: Function[];
}
