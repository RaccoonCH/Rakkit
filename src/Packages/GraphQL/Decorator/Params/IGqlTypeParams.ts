import { IGqlObjectParams } from "../..";

export interface IGqlTypeParams extends Partial<IGqlObjectParams> {
  extends?: Function;
  isAbstract?: boolean;
}
