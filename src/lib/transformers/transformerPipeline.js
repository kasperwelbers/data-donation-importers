import { transformerFunctions } from "./transformerFunctions";
import standardizeRecipe from "../recipes/standardizeRecipe";

export default function transformerPipeline(data, recipe) {
  recipe = standardizeRecipe(recipe);

  const transformers = recipe.transformers;
  if (!transformers) return data;
  if (!data) return data;

  const remove = new Array(data.length).fill(false);

  for (let transformer of transformers) {
    try {
      if (!transformer.transformer) continue;
      const transformFunction = transformerFunctions[transformer.transformer];
      if (transformFunction.input === "column" && !transformer.column) continue;

      const argArray = getArgumentArray(transformer.transformer, transformer.arguments);
      for (let i = 0; i < data.length; i++) {
        let input = data[i];
        if (transformFunction.input === "column") input = input[transformer.column];

        if (transformFunction.action === "mutate") {
          const toColumn =
            transformer.new_column || transformer.column || `${transformer.transformer} OUTPUT`;
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
  return transformerFunctions[transformer].arguments.map((arg) => {
    let value = args[arg.name] ?? arg.default;
    if (arg.type === "string_multiple" && !Array.isArray(value)) value = [value];
    return value;
  });
};
