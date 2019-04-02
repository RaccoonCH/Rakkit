import {
  IGqlType,
  IDecorator,
  GqlType,
  IField
} from "../../../..";

export interface ITypeTransformation<Type extends GqlType = any> {
  target: Function;
  gqlType?: Type;
  fieldsTransformation?: Partial<IDecorator<Partial<IField>>>;
  rootTransformation?: Partial<IDecorator<Partial<IGqlType<Type>>>>;
}
