import { IDiId } from "../..";

export interface IService<Instance = any> extends IDiId {
  instance?: Instance;
}
