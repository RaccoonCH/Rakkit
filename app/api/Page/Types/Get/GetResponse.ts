import { ObjectType, Field } from "type-graphql";
import { PageModel } from "@api/Page/Page.model";

@ObjectType()
export class PageGetResponse {
  @Field({ nullable: true })
  count?: number;

  @Field(type => [PageModel])
  items: Array<PageModel>;
}
