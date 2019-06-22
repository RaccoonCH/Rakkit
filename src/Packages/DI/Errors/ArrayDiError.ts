export class ArrayDiError extends Error {
  name = "ArrayDiError";

  constructor(target: Function, propertyName: string) {
    super(
      `Verify your injection declaration: "${target.name}.${propertyName}". ` +
      "Your array declaration isn't correct"
    );
  }
}
