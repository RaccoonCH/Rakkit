import { FrontType } from "../..";

export class RImage extends FrontType {
  readonly placeholder: string;
  readonly sizeUnit: string;
  readonly maxSize: number;
  readonly acceptedMime: string[];

  constructor(
    acceptedMime?: string[],
    sizeUnit?: string,
    maxSize?: number,
    placeholder?: string
  ) {
    super("image");
    this.placeholder = placeholder;
    this.acceptedMime = acceptedMime;
    this.sizeUnit = sizeUnit;
    this.maxSize = maxSize;
  }
}
