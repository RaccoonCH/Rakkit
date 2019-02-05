import { ArgsType, Field, InputType } from "rakkitql";
import { GraphqlUtils } from "@logic";
import _MODEL_FILE_ from "./_MODEL_FILE_";

@InputType()
export class _ARGS_NAME_ implements Pick<_MODEL_FILE_, "Id" | "Name"> {
  @Field({ nullable: true })
  public readonly Id: number;

  @Field({ nullable: true })
  public readonly Name: string;
}

@ArgsType()
export class _ARGS_NAME_Args extends GraphqlUtils.createArgsClass(_MODEL_FILE_) {}
