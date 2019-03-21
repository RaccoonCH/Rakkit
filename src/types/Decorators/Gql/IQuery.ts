export interface IQuery {
  function: Function;
  flatArgs: boolean;
  args: () => Function;
}
