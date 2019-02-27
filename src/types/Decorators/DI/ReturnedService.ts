import { IService, InstanceOf } from "../..";

export type ReturnedService<InstanceType> = Required<IService<InstanceOf<InstanceType>>>;
