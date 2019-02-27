import { IDiId } from "../..";

export interface IService<Instance> extends IDiId {
  instance?: Instance;
}
