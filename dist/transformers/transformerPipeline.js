"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformerPipeline;

require("core-js/modules/web.dom-collections.iterator.js");

var _transformerFunctions = require("./transformerFunctions");

var _standardizeRecipe = _interopRequireDefault(require("../recipes/standardizeRecipe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformerPipeline(data, recipe) {
  recipe = (0, _standardizeRecipe.default)(recipe);
  const transformers = recipe.transformers;
  if (!transformers) return data;

  for (let transformer of transformers) {
    try {
      if (!transformer.column || !transformer.transformer) continue;
      const transformFunction = _transformerFunctions.transformerFunctions[transformer.transformer].transform;
      const argArray = getArgumentArray(transformer.transformer, transformer.arguments);

      for (let i = 0; i < data.length; i++) {
        const input = data[i][transformer.column];
        if (input == null) continue;
        const toColumn = transformer.new_column || transformer.column;
        data[i][toColumn] = transformFunction(...[input, ...argArray]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return data;
}

const getArgumentArray = (transformer, args) => {
  return _transformerFunctions.transformerFunctions[transformer].arguments.map(arg => {
    let value = args[arg.name] || arg.default;
    if (arg.type === "string_multiple" && !Array.isArray(value)) value = [value];
    return value;
  });
};