import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import anydate from "any-date-parser";
dayjs.extend(customParseFormat);

// add any transformer functions here.
// the transform function has as first argument the column on which the transformer is applied
// The arguments array is then passed after that (based on order, so the argument name is for the user sees it
// and does not need to match the actual argument in the transform function)

// argument types are currently either string, number, bool or option (in which case also an options array needs to be given)
// Add more types in the ArgInput componnent in CreatTransformers.js

// link can be added to an argument to show a link in the recipe menu (e.g., for documentation)

const replace = {
  label: "replace",
  description: "Replace a matched regular expression",
  arguments: [
    { name: "regex", type: "string", default: "" },
    { name: "replacement", type: "string", default: "" },
    { name: "case sensitive", type: "bool", default: false },
  ],
  transform: (x, regex, replacement, case_sensitive) => {
    const reg = new RegExp(regex, case_sensitive ? "g" : "gi");
    return x.replaceAll(reg, replacement);
  },
};

const int_to_date = {
  label: "date from integer",
  description: "Read a date formatted as [units] since UNIX epoch",
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
  description: "Transform string to date",
  arguments: [
    {
      name: "format",
      type: "string_multiple",
      link: "https://day.js.org/docs/en/parse/string-format",
      placeholder: "Add formats (one per line)",
      default: [],
    },
    {
      name: "auto parse",
      type: "bool",
      default: true,
    },
  ],
  transform: (x, format, auto_parse) => {
    const formats = [...format].filter((f) => f !== "");
    let date;
    if (!formats || formats.length === 0) {
      date = dayjs(x);
    } else {
      date = dayjs(x, formats);
    }
    if (date.isValid()) return date.toDate();
    if (auto_parse) date = anydate.fromString(x);
    return date instanceof Date ? date : `invalid date: ${x}`;
  },
};

const trim = {
  label: "trim",
  description: "remove leading and trailing whitespace",
  arguments: [],
  transform: (x) => {
    return x.trim();
  },
};

export const transformerFunctions = {
  replace,
  int_to_date,
  str_to_date,
  trim,
};
