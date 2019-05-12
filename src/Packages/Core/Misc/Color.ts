const textCustom = {
  fg: {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37
  },

  bg: {
    black: 40,
    red: 41,
    green: 42,
    yellow: 43,
    blue: 44,
    magenta: 45,
    cyan: 46,
    white: 47
  },

  cmd: {
    reset: 0,
    bright: 1,
    dim: 2,
    underscore: 4,
    blink: 5,
    reverse: 7,
    hidden: 8
  }
};

/**
 * Colorize a text into the console
 * @param text The text to colorize
 * @param params The color params
 */
export const Color = (text, ...params: string[]): string => {
  let resText = "";
  params.forEach(p => {
    const v = p.split(".");
    resText += getCode(textCustom[v[0]][v[1]]);
  });
  resText += text + getCode(textCustom.cmd.reset);
  return resText;
};

const getCode = (code: number): string => {
  return `\x1b[${code}m`;
};
