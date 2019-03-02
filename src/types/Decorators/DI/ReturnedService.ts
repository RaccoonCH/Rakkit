import { IService, InstanceOf, IDecorator } from "../..";

export type ReturnedService<InstanceType> = Required<IDecorator<IService<InstanceOf<InstanceType>>>>;
