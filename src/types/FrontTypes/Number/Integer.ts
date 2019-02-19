import  { FrontType, INumber } from "../..";

export class RInteger extends FrontType implements INumber {
  readonly min?: number;
  readonly max?: number;

  constructor(
    min?: number,
    max?: number
  ) {
    super("int", "number");
    this.min = min;
    this.max = max;
  }
}
