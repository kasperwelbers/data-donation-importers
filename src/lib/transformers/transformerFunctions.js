const replace = {
  label: "replace",
  arguments: [
    { name: "pattern", type: "string", default: "" },
    { name: "replacement", type: "string", default: "" },
    { name: "regex", type: "bool", default: false },
  ],
  transform: (x, pattern, replacement, regex) => {
    const p = regex ? new RegExp(pattern, "g") : pattern;
    return x.replaceAll(p, replacement);
  },
};

const int_to_date = {
  label: "date from integer",
  arguments: [
    {
      name: "unit",
      type: "option",
      options: ["microsecond", "millisecond", "second"],
      default: "millisecond",
    },
  ],
  transform: (x, unit) => {
    if (unit === "microsecond") x = x / 1000;
    if (unit === "second") x = x * 1000;
    return new Date(x);
  },
};

const str_to_date = {
  label: "date from string",
  arguments: [],
  transform: (x) => {
    return new Date(Date.parse(x));
  },
};

export const transformerFunctions = {
  replace,
  int_to_date,
  str_to_date,
};
