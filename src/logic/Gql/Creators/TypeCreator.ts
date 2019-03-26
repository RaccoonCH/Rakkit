import { MetadataStorage, DecoratorHelper } from "../..";

export class TypeCreator {
  private static get _gqlMetdataStorage() {
    return MetadataStorage.Instance.Gql;
  }

  static createRequired(classType: Function) {

  }

  static createUnion(classType: Function) {

  }
}
