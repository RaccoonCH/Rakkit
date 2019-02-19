import {
  ReflectMetadataMissingError,
  getMetadataStorage
} from "../../../../../src/modules/rakkitql";

describe("Reflect metadata", () => {
  it("should throw ReflectMetadataMissingError when no polyfill provided", async () => {
    try {
      getMetadataStorage();
    } catch (err) {
      expect(err).toBeInstanceOf(ReflectMetadataMissingError);
      expect(err.message).toContain("metadata");
      expect(err.message).toContain("polyfill");
    }
  });
});
