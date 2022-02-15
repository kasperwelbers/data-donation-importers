"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformerFunctions = void 0;

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/esnext.string.replace-all.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.trim.js");

var _dayjs = _interopRequireDefault(require("dayjs"));

var _customParseFormat = _interopRequireDefault(require("dayjs/plugin/customParseFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import advancedFormat from "dayjs/plugin/advancedFormat";
// import timezone from "dayjs/plugin/timezone";
_dayjs.default.extend(_customParseFormat.default); // dayjs.extend(advancedFormat);
// dayjs.extend(timezone);
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
  arguments: [{
    name: "regex",
    type: "string",
    default: ""
  }, {
    name: "replacement",
    type: "string",
    default: ""
  }, {
    name: "case sensitive",
    type: "bool",
    default: false
  }],
  transform: (x, regex, replacement, case_sensitive) => {
    const reg = new RegExp(regex, case_sensitive ? "g" : "gi");
    return x.replaceAll(reg, replacement);
  }
};
const int_to_date = {
  label: "date from integer",
  description: "Read a date formatted as [units] since UNIX epoch",
  arguments: [{
    name: "unit",
    type: "option",
    options: ["microsecond", "millisecond", "second"],
    default: "millisecond"
  }],
  transform: (x, unit) => {
    if (unit === "microsecond") x = x / 1000;
    if (unit === "second") x = x * 1000;
    return new Date(x);
  }
};
const str_to_date = {
  label: "date from string",
  description: "Transform a string to a date",
  arguments: [{
    name: "format",
    type: "string_multiple",
    link: "https://day.js.org/docs/en/parse/string-format",
    placeholder: "Specify how to parse date. Add rows for alternatives",
    default: []
  }],
  transform: (x, format) => {
    const formats = [...format].filter(f => f !== "");
    if (!formats || formats.length === 0) return (0, _dayjs.default)(x).toDate() || x;
    return (0, _dayjs.default)(x, formats).toDate() || x;
  }
};
const trim = {
  label: "trim",
  description: "remove leading and trailing whitespace",
  arguments: [],
  transform: x => {
    return x.trim();
  }
};
const transformerFunctions = {
  replace,
  int_to_date,
  str_to_date,
  trim
};
exports.transformerFunctions = transformerFunctions;