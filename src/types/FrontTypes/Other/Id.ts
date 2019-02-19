import { FrontType } from "../..";

export class RId extends FrontType {
  readonly placeholder: string;

  constructor(placeholder?: string) {
    super("id");
    this.placeholder = placeholder;
  }
}
