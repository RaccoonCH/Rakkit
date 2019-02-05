import { ArgsType, Field, InputType } from "type-graphql";
import { GraphqlUtils } from "@logic";
import CultureModel from "@api/Culture/Culture.model";

@InputType()
export class CultureType implements Pick<CultureModel, "LangCode" | "CountryCode"> {
  @Field({ nullable: true })
  readonly LangCode: string;

  @Field({ nullable: true })
  readonly CountryCode: string;
}

@ArgsType()
export class CultureArgs extends GraphqlUtils.createArgsClass(CultureType) {}
