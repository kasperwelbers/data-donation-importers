import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import tokenize from "./functions/tokenize";
import { compileExpression } from "filtrex";
import anydate from "any-date-parser";
dayjs.extend(customParseFormat);

// add any transformer functions here.
// the transform function has as first argument the column on which the transformer is applied
// The arguments array is then passed after that (based on order, so the argument name is for the user sees it
// and does not need to match the actual argument in the transform function)

// argument types are currently either string, number, bool or option (in which case also an options array needs to be given)
// Add more types in the ArgInput componnent in CreatTransformers.js

// link can be added to an argument to show a link in the recipe menu (e.g., for documentation)

// input can be
// - column: user needs to specify a specific input column
// - row: x will be an entire row (an object)

// action can be
// - mutate: the input value will be mutated and assigned to the input column or specified output column
// - filter: the return value must be a bool, and if false the row will be skipped

const replace = {
  label: "replace",
  description: "Replace a matched regular expression",
  input: "column",
  action: "mutate",
  arguments: [
    { name: "regex", type: "string", default: "" },
    { name: "replacement", type: "string", default: "" },
    { name: "case sensitive", type: "bool", default: false },
  ],
  func: (x, regex, replacement, case_sensitive) => {
    const reg = new RegExp(regex, case_sensitive ? "g" : "gi");
    return x.replaceAll(reg, replacement);
  },
};

const int_to_date = {
  label: "date from integer",
  description: "Read a date formatted as [units] since UNIX epoch",
  input: "column",
  action: "mutate",
  arguments: [
    {
      name: "unit",
      type: "option",
      options: ["microsecond", "millisecond", "second"],
      default: "millisecond",
    },
  ],
  func: (x, unit) => {
    if (unit === "microsecond") x = x / 1000;
    if (unit === "second") x = x * 1000;
    return new Date(x);
  },
};

const str_to_date = {
  label: "date from string",
  description: "Transform string to date",
  input: "column",
  action: "mutate",
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
  func: (x, format, auto_parse) => {
    const formats = [...format].filter((f) => f !== "");
    let date;
    if (!formats || formats.length === 0) {
      date = dayjs(x);
    } else {
      date = dayjs(x, formats);
    }
    if (date.isValid()) return date.toDate();
    if (auto_parse) date = anydate.fromString(x);
    return date instanceof Date ? date : `${x} (raw)`;
  },
};

const trim = {
  label: "trim",
  description: "remove leading and trailing whitespace",
  input: "column",
  action: "mutate",
  arguments: [],
  func: (x) => {
    return x.trim();
  },
};

const url_to_domain = {
  label: "domain from URL",
  description: "Extract the domain from a URL",
  input: "column",
  action: "mutate",
  arguments: [{ name: "rm prefix", type: "bool", default: true }],
  func: (x, rm_prefix) => {
    let domain;
    try {
      const url = new URL(x);
      domain = url.hostname;
    } catch (_) {
      domain = x;
    }
    if (rm_prefix) {
      domain = domain.replace(/www[0-9]*\./, "");
      domain = domain.replace(/^m\./, "");
    }
    return domain.trim();
  },
};

const mutate_expression = {
  label: "Mutate expression",
  description: "Create a column with an expression",
  input: "row",
  action: "mutate",
  arguments: [
    {
      name: "expression",
      type: "string",
      default: "",
      link: "https://www.npmjs.com/package/filtrex",

      placeholder: `floor(time / 1000) + " seconds"`,
    },
  ],
  func: (x, expression) => {
    const myExp = compileExpression(expression);
    return myExp(x);
  },
};

const filter = {
  label: "filter rows",
  description: "Use an expression to select (or remove) rows",
  input: "row",
  action: "filter",
  arguments: [
    {
      name: "expression",
      type: "string",
      default: "",
      link: "https://www.npmjs.com/package/filtrex",

      placeholder: "column1 > 5 and column2 == 'example'",
    },
    { name: "rm selected", type: "bool", default: false },
  ],
  func: (x, expression, rm_selected) => {
    const myfilter = compileExpression(expression);
    const f = myfilter(x);
    return rm_selected ? !f : f;
  },
};

const filter_regex = {
  label: "filter rows (regex)",
  description: "Use a regular expression to select rows",
  input: "column",
  action: "filter",
  arguments: [
    {
      name: "regex",
      type: "string",
      default: "",
    },
    { name: "rm selected", type: "bool", default: false },
    { name: "case sensitive", type: "bool", default: false },
  ],
  func: (x, expression, rm_selected, case_sensitive) => {
    const r = RegExp(expression, case_sensitive ? "g" : "gi");
    const f = r.test(x);
    return rm_selected ? !f : f;
  },
};

const tokenize_string = {
  label: "Tokenize",
  description: "Tokenize a string",
  input: "column",
  action: "mutate",
  arguments: [],
  func: (x) => {
    return tokenize(x);
  },
};

export const transformerFunctions = {
  replace,
  int_to_date,
  str_to_date,
  trim,
  url_to_domain,
  filter,
  filter_regex,
  mutate_expression,
  tokenize_string,
};
