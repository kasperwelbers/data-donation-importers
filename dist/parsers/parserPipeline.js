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
    column_names["FULL_ROW_OBJECT"] = ["_ROW_DATA"];
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
          for (let toColumn of column_names[path]) {
            // if already has value, dont' overwrite
            // this also prevents overwriting with an empty match (in case of aliases)
            if (row[toColumn]) continue;
            row[toColumn] = rawrow[path];
          }
        }

        data.push(row);
      }
    }
  } catch (e) {
    console.log(e);
    data = null;
  }

  return data;
}