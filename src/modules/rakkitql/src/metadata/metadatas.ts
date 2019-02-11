import { getMetadataStorage } from "./getMetadataStorage";

export class Metadatas {
  static get Fields() {
    return this.returnArr(getMetadataStorage().fields);
  }

  static get GenericFields() {
    return this.returnArr(getMetadataStorage().genericFields);
  }

  static get InputTypes() {
    return this.returnArr(getMetadataStorage().inputTypes);
  }

  static get ObjectTypes() {
    return this.returnArr(getMetadataStorage().objectTypes);
  }

  static get Args() {
    return this.returnArr(getMetadataStorage().args);
  }

  static get Subscritpions() {
    return this.returnArr(getMetadataStorage().subscriptions);
  }

  static get Queries() {
    return this.returnArr(getMetadataStorage().queries);
  }

  static get Middlewares() {
    return this.returnArr(getMetadataStorage().middlewares);
  }

  static get GenericTypes() {
    return this.returnArr(getMetadataStorage().genericTypes);
  }

  static get FieldResolvers() {
    return this.returnArr(getMetadataStorage().fieldResolvers);
  }

  static get ObjectArgs() {
    return this.returnArr(getMetadataStorage().objectArgs);
  }

  static get InterfaceTypes() {
    return this.returnArr(getMetadataStorage().interfaceTypes);
  }

  static get Mutations() {
    return this.returnArr(getMetadataStorage().mutations);
  }

  static get Params() {
    return this.returnArr(getMetadataStorage().params);
  }

  static get WrapperTypes() {
    return this.returnArr(getMetadataStorage().wrapperTypes);
  }

  static get SubTypes() {
    return this.returnArr(getMetadataStorage().subTypes);
  }

  static get ResolverClasses() {
    return this.returnArr(getMetadataStorage().resolverClasses);
  }

  static get Unions() {
    return this.returnArr(getMetadataStorage().unions);
  }

  static get AuthorizedFields() {
    return this.returnArr(getMetadataStorage().authorizedFields);
  }

  static get ArgumentTypes() {
    return this.returnArr(getMetadataStorage().argumentTypes);
  }

  static get Enums() {
    return this.returnArr(getMetadataStorage().enums);
  }

  private static returnArr<Type>(arr: Type[]) {
    return arr as ReadonlyArray<Type>;
  }
}
