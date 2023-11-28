"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCookbook;
require("core-js/modules/web.dom-collections.iterator.js");
var _standardizeRecipe = _interopRequireDefault(require("./standardizeRecipe"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Combine an array of recipes into a cookbook.
 * Includes an array of all files to include, that can be used as
 * allowedFiles in the dropzone
 * @param {*} recipes  An array of recipes
 * @returns
 */
function createCookbook(recipes) {
  const cookbook = {
    recipes: [],
    files: []
  };
  for (let recipe of recipes) {
    const standardizedRecipe = (0, _standardizeRecipe.default)(recipe);
    cookbook.recipes.push(standardizedRecipe);
    cookbook.files = [...cookbook.files, ...standardizedRecipe.file];
  }
  return cookbook;
}