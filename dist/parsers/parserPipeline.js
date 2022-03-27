"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parserPipeline;

require("core-js/modules/web.dom-collections.iterator.js");

var _parseHTML = _interopRequireDefault(require("./parseHTML"));

var _parseJSON = _interopRequireDefault(require("./parseJSON"));

var _parseCSV = _interopRequireDefault(require("./parseCSV"));

var _standardizeRecipe = _interopRequireDefault(require("../recipes/standardizeRecipe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parserPipeline(content, recipe) {
  var _recipe;

  let includeFull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let head = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  recipe = (0, _standardizeRecipe.default)(recipe);
  let data = [];
  if (!((_recipe = recipe) !== null && _recipe !== void 0 && _recipe.columns)) return [];
  const column_selectors = [];
  const column_names = {};

  for (let column of recipe.columns) {
    const column_selector_array = Array.isArray(column.selector) ? column.selector : [column.selector];
    if (column.name === "" || column_selector_array.length === 0) continue;

    for (let addColumnSelector of column_selector_array) {
      if (!column_selectors.includes(addColumnSelector)) column_selectors.push(addColumnSelector);
      if (!column_names[addColumnSelector]) column_names[addColumnSelector] = [];
      column_names[addColumnSelector].push(column.name);
    }
  }

  if (includeFull) {
    column_selectors.push("FULL_ROW_OBJECT");
    column_names["FULL_ROW_OBJECT"] = ["FULL ROW OBJECT"];
  }

  try {
    let rows_selectors = Array.isArray(recipe.rows_selector) ? recipe.rows_selector : [recipe.rows_selector];
    if (rows_selectors.length === 0) rows_selectors = [null];

    for (let rows_selector of rows_selectors) {
      let rows_selector_data;
      if (recipe.filetype === "json") rows_selector_data = (0, _parseJSON.default)(content.content, rows_selector, column_selectors, head);
      if (recipe.filetype === "html") rows_selector_data = (0, _parseHTML.default)(content.content, rows_selector, column_selectors, head);
      if (recipe.filetype === "csv") rows_selector_data = (0, _parseCSV.default)(content.content, rows_selector, column_selectors, head);

      for (let rawrow of rows_selector_data) {
        const row = {};

        for (let path of Object.keys(rawrow)) {
          for (let toColumn of column_names[path]) row[toColumn] = rawrow[path];
        }

        data.push(row);
      }
    }
  } catch (e) {
    console.log(e);
    data = null;
  }

  return data;
} // const transformFunctions = {
//   date: (value) => new Date(value),
//   epochDate: (value) => new Date(Math.round(value / 1000)),
// };
// YAML structure
// transform:
//     - input:      time
//       rename:     date
//       function:   int_to_date
//       epoch:      1970-01-01
//       unit:       miliseconds
//     - input:      date
//       rename:     Date
//       descrip:   High Heeled "Ruby" Slippers
//       size:      8
//       price:     133.7
//       quantity:  1
// OR THIS JSON
// {
//   "transform": [
//     {
//       "input": "time",
//       "rename": "date",
//       "int_to_date": null,
//       "string_to_date": {
//         "format": "%y-%m-%d"
//       }
//     }
//   ]
// }
//
// FOR THIS YAML
// transform:
// - input: time
//   rename: date
//   int_to_date:
//   string_to_date:
//     format: "%y-%m-%d"