import  { FrontType } from "../..";

export class RDate extends FrontType {
  readonly placeholder: string;
  readonly format: string;

  constructor(
    placeholder?: string,
    format?: string
  ) {
    super("date");
    this.format = format;
    this.placeholder = placeholder;
  }
}
