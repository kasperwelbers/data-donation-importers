import parserPipeline from "../parsers/parserPipeline";
import transformerPipeline from "../transformers/transformerPipeline";

/**
 * Mise en place means to put everything in place, ready to start cooking.
 * Given a cookbook and a list of accepted files (from the dropzone),
 * this function returns an array of MEP (Mise En Place) objects, that contain
 * a recipe and the files that match its file selector. When you run the cook method,
 * the recipe will be tried on each of the files, and the first success is returned.
 *
 * The reason for this thin MEP class wrapper is just that it makes it easy to cook the
 * recipes one-by-one. This limits the amount of data that the client will have to
 * keep in memory.
 */
const miseEnPlace = (cookbook, files) => {
  const meps = [];
  for (let recipe of cookbook.recipes) {
    let recipeFiles = [];
    for (let path of recipe.file) {
      const matchedFiles = files.filter((f) => f.path.toLowerCase().includes(path.toLowerCase()));
      recipeFiles = [...recipeFiles, ...matchedFiles];
    }
    meps.push(new MEP(recipe, recipeFiles));
  }
  return meps;
};

class MEP {
  constructor(recipe, files) {
    this.recipe = recipe;
    this.files = files;
  }

  async cook() {
    for (let file of this.files) {
      try {
        let data = await file.parse(this.recipe.filetype);
        data = parserPipeline(data, this.recipe);
        data = transformerPipeline(data, this.recipe);
        return data;
      } catch (e) {
        console.log(`Could not cook ${this.recipe.name} with ${file.name}`);
      }
    }
    return null;
  }
}

export default miseEnPlace;
