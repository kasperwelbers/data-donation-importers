"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformerPipeline;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.reduce.js");

var _transformerFunctions = require("./transformerFunctions");

var _standardizeRecipe = _interopRequireDefault(require("../recipes/standardizeRecipe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformerPipeline(data, recipe) {
  recipe = (0, _standardizeRecipe.default)(recipe);
  const transformers = recipe.transformers;
  if (!transformers) return data;
  if (!data) return data;
  const remove = new Array(data.length).fill(false);

  for (let transformer of transformers) {
    try {
      if (!transformer.transformer) continue;
      const transformFunction = _transformerFunctions.transformerFunctions[transformer.transformer];
      if (transformFunction.input === "column" && !transformer.column) continue;
      const argArray = getArgumentArray(transformer.transformer, transformer.arguments);

      for (let i = 0; i < data.length; i++) {
        let input = data[i];
        if (transformFunction.input === "column") input = input[transformer.column];

        if (transformFunction.action === "mutate") {
          const toColumn = transformer.new_column || transformer.column || "".concat(transformer.transformer, " OUTPUT");

          try {
            data[i][toColumn] = transformFunction.func(...[input, ...argArray]);
          } catch (e) {
            console.log(e);
            data[i][toColumn] = null;
          }
        }

        if (transformFunction.action === "filter") {
          try {
            const filter = transformFunction.func(...[input, ...argArray]);
            remove[i] = remove[i] || !filter;
          } catch (e) {
            console.log(e);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return remove.reduce((output, rm, index) => {
    if (!rm) output.push(data[index]);
    return output;
  }, []);
}

const getArgumentArray = (transformer, args) => {
  return _transformerFunctions.transformerFunctions[transformer].arguments.map(arg => {
    var _args$arg$name;

    let value = (_args$arg$name = args[arg.name]) !== null && _args$arg$name !== void 0 ? _args$arg$name : arg.default;
    if (arg.type === "string_multiple" && !Array.isArray(value)) value = [value];
    return value;
  });
};