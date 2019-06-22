export interface IResolveType {
  resolveType?: (value: any) => String | Function | Promise<String | Function>;
}
