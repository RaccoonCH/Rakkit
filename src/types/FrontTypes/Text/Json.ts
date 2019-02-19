import { FrontType, IText } from "../..";

export class Json extends FrontType implements IText {
  readonly placeholder: string;

  constructor(placeholder?: string) {
    super("json", "text");
    this.placeholder = placeholder;
  }
}
