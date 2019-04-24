import { Rakkit, ObjectType, Field, MetadataStorage } from "../src";
import { gql } from "apollo-server-koa";

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  it("Should create an object type", async () => {
    @ObjectType("SimpleType", {
      description: "a simple type"
    })
    class SimpleObjectType {
      @Field()
      field: string;
    }

    const value = gql`
      """a simple type"""
      type SimpleType {
        field: String!
      }
    `;

    await Rakkit.start();

    expect("...").toBe("...");
  });
});
