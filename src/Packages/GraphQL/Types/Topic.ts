export type Topic =
  string |
  string[] |
  ((args: any) => (string | string[] | Promise<string[] | string>));
