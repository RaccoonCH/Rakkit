import {
  Query,
  Arg,
  Int,
  Resolver,
  InputType,
  Field,
  FlatArgs,
  FieldResolver,
  IClassType,
  Service,
  IContext
} from "../../../../src";

import { Resource } from "./resource";
import { ResourceService, ResourceServiceFactory } from "./resource.service";

@InputType()
export class GetAllArgs {
  @Field(type => Int, { defaultValue: 0 })
  skip: number = 0;

  @Field(type => Int, { defaultValue: 10 })
  take: number = 10;
}

export function ResourceResolver<TResource extends Resource>(
  ResourceCls: IClassType,
  resources: TResource[]
) {
  const resourceName = ResourceCls.name.toLocaleLowerCase();

  // `isAbstract` decorator option is mandatory to prevent multiple registering in schema
  @Resolver(of => ResourceCls, { isAbstract: true })
  abstract class ResourceResolverClass {
    protected resourceService: ResourceService<TResource>;

    constructor(factory: ResourceServiceFactory) {
      this.resourceService = factory.create(resources);
    }

    @Query(returns => ResourceCls, { name: `${resourceName}` })
    protected async getOne(@Arg("id", type => Int) id: number) {
      return this.resourceService.getOne(id);
    }

    @Query(returns => [ResourceCls], { name: `${resourceName}s` })
    protected async getAll(@FlatArgs() { skip, take }: GetAllArgs) {
      const all = this.resourceService.getAll(skip, take);
      return all;
    }

    // dynamically created field with resolver for all child resource classes
    @FieldResolver({ name: "uuid" })
    protected getUuid(context: IContext<any, Resource>): string {
      return `${resourceName}_${context.gql.root.id}`;
    }
  }

  return ResourceResolverClass as any;
}
