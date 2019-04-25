import { IGqlObject } from "../..";

export interface ICreateParams extends Partial<Pick<IGqlObject, "description" | "name">> {
}
