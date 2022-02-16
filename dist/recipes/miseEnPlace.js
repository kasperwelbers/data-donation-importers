"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.promise.js");

var _parserPipeline = _interopRequireDefault(require("../parsers/parserPipeline"));

var _transformerPipeline = _interopRequireDefault(require("../transformers/transformerPipeline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      const matchedFiles = files.filter(f => f.path.toLowerCase().includes(path.toLowerCase()));
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
    if (this.files.length === 0) return {
      data: [],
      status: "no files"
    };

    for (let file of this.files) {
      try {
        let data = await file.parse(this.recipe.filetype);
        data = (0, _parserPipeline.default)(data, this.recipe);
        data = (0, _transformerPipeline.default)(data, this.recipe);
        return {
          data,
          status: "success"
        };
      } catch (e) {
        console.log("Could not cook ".concat(this.recipe.name, " with ").concat(file.name));
      }
    }

    return {
      data: [],
      status: "failed"
    };
  }

}

var _default = miseEnPlace;
exports.default = _default;