import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import standardizeRecipe from "../lib/recipes/standardizeRecipe.js";
import { recipes } from "../recipes.js";

const RECIPES = recipes.map((r) => standardizeRecipe(r));
const options = Object.keys(RECIPES).map((key) => {
  return { key, text: key, value: key };
});

const CookbookSelector = ({ setCookbook }) => {
  const [selected, setSelected] = useState(options.map((o) => o.value));

  useEffect(() => {
    const newcookbook = {};
    newcookbook.recipes = Object.keys(RECIPES).reduce((r, key) => {
      r.push({ ...RECIPES[key] });
      return r;
    }, []);
    newcookbook.files = newcookbook.recipes.reduce((files, r) => {
      files = [...files, ...r.file];
      return files;
    }, []);
    setCookbook(newcookbook);
  }, [selected, setCookbook]);

  return (
    <Dropdown
      selection
      multiple
      options={options}
      value={selected}
      onChange={(e, d) => setSelected(d.value)}
    />
  );
};

export default CookbookSelector;
