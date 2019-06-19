export type ArrayElements<TArray extends any[]> = TArray extends Array<infer TElement>
  ? TElement
  : never;
