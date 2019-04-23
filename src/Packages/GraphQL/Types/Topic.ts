export type Topic =
  string |
  string[] |
  ((args: object) => (string | string[] | Promise<string[] | string>));
