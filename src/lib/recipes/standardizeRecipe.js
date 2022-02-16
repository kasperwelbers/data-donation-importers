export default function standardizeRecipe(recipe) {
  const asArray = (value) => (Array.isArray(value) ? value : [value]);
  recipe.file = asArray(recipe.file) || [];
  recipe.filetype = recipe.filetype || "json";
  recipe.rows_selector = asArray(recipe.rows_selector) || [];

  recipe.columns = recipe.columns || [];
  for (let i = 0; i < recipe.columns.length; i++) {
    recipe.columns[i].selector = asArray(recipe.columns[i].selector) || [];
  }

  recipe.transformers = recipe.transformers || [];

  return recipe;
}
