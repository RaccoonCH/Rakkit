import { FrontType, IText } from "../../../types";

export class RShorttext extends FrontType implements IText {
  readonly placeholder: string;

  constructor(placeholder?: string) {
    super("short", "text");
    this.placeholder = placeholder;
  }
}
