import { transformerFunctions } from "./transformerFunctions";

export default function transformerPipeline(data, recipe) {
  const transformers = recipe.transformers;

  for (let transformer of transformers) {
    try {
      if (!transformer.column || !transformer.transformer) continue;
      const transform = transformerFunctions[transformer.transformer].transform;
      for (let i = 0; i < data.length; i++) {
        const argArray = [data[i][transformer.column], ...transformer.arguments];
        if (argArray[0] == null) continue;
        data[i][transformer.column] = transform(...argArray);
      }
    } catch (e) {
      console.log(e);
    }
  }
  return data;
}
