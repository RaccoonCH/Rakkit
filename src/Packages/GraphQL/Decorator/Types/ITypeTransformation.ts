import {
  IGqlType,
  IDecorator,
  GqlType,
  IField
} from "../../../..";

export interface ITypeTransformation<Type extends GqlType = any> {
  target: Function;
  fieldsTransformation: Partial<IDecorator<Partial<IField>>>;
  rootTransformation: Partial<IGqlType<Type>>;
  prefix?: string;
}
