import  { FrontType, INumber } from "../..";

export class RDouble extends FrontType implements INumber {
  readonly precision?: number;
  readonly min?: number;
  readonly max?: number;

  constructor(
    precision?: number,
    min?: number,
    max?: number
  ) {
    super("double", "number");
    this.precision = precision;
    this.min = min;
    this.max = max;
  }
}
