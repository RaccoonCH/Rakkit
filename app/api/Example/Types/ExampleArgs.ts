import { ArgsType, InputType, Field } from "type-graphql";
import { GraphqlUtils } from "@logic";
import ExampleModel from "@api/Example/Example.model.";

@InputType()
export abstract class ExampleType implements Pick<ExampleModel, "Id" | "Name" | "Text"> {
  @Field({ nullable: true })
  readonly Id: number;

  @Field({ nullable: true })
  readonly Name: string;

  @Field({ nullable: true })
  readonly Text: string;
}

@ArgsType()
export abstract class ExampleArgs extends GraphqlUtils.createArgsClass(ExampleModel) {}
