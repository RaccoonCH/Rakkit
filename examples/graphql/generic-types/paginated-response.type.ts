import {
  IClassType,
  Field,
  ObjectType,
  Int
} from "../../../src";

export default function PaginatedResponse<TItem>(TItemClass: IClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(type => [TItemClass])
    items: TItem[];

    @Field(type => Int)
    total: number;

    @Field()
    hasMore: boolean;
  }
  return PaginatedResponseClass as any;
}
