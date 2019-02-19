import { FrontType } from "../..";

export class RPassword extends FrontType {
  readonly maskText: string = "rakkit";

  constructor(maskText?: string) {
    super("password");
    this.maskText = maskText;
  }
}
