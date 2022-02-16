import standardizeRecipe from "./standardizeRecipe";

/**
 * Combine an array of recipes into a cookbook.
 * Includes an array of all files to include, that can be used as
 * allowedFiles in the dropzone
 * @param {*} recipes  An array of recipes
 * @returns
 */
export default function createCookbook(recipes) {
  const cookbook = { recipes: [], files: [] };
  for (let recipe of recipes) {
    const standardizedRecipe = standardizeRecipe(recipe);
    cookbook.recipes.push(standardizedRecipe);
    cookbook.files = [...cookbook.files, ...standardizedRecipe.file];
  }
  return cookbook;
}
