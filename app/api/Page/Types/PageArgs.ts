import { ArgsType, Field, InputType } from "type-graphql";
import { GraphqlUtils } from "@logic";
import { CultureType } from "@api/Culture/Types";
import { PageModel } from "../Page.model";

@InputType()
export class PageType implements Pick<PageModel, "Url" | "Title"> {
  @Field({ nullable: true })
  readonly Url: string;

  @Field({ nullable: true })
  readonly Title: string;

  @Field(type => CultureType, { nullable: true })
  readonly Culture: CultureType;
}

@ArgsType()
export class PageArgs extends GraphqlUtils.createArgsClass(PageType) {}
