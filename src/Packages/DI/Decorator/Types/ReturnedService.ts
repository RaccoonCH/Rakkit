import {
  IService,
  InstanceOf,
  IDecorator
} from "../../../..";

export type ReturnedService<InstanceType = any> = Required<IDecorator<IService<InstanceOf<InstanceType>>>>;
