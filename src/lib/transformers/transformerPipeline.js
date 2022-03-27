import { transformerFunctions } from "./transformerFunctions";
import standardizeRecipe from "../recipes/standardizeRecipe";

export default function transformerPipeline(data, recipe) {
  recipe = standardizeRecipe(recipe);

  const transformers = recipe.transformers;
  if (!transformers) return data;

  for (let transformer of transformers) {
    try {
      if (!transformer.column || !transformer.transformer) continue;
      const transformFunction = transformerFunctions[transformer.transformer].transform;
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
  return transformerFunctions[transformer].arguments.map((arg) => {
    let value = args[arg.name] ?? arg.default;
    if (arg.type === "string_multiple" && !Array.isArray(value)) value = [value];
    return value;
  });
};
