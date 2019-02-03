export abstract class FrontType {
  readonly name: string;
  readonly subject: string;

  constructor(typeName: string, typeSubject?: string) {
    this.name = typeName;
    this.subject = typeSubject || "other";
  }
}
