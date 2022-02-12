import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";

const RecipeSelector = ({ recipes, setRecipe }) => {
  const [selected, setSelected] = useState(recipes ? Object.keys(recipes)[0] : "new_recipe");

  useEffect(() => {
    const selectedRecipe = recipes[selected];
    setRecipe(standardizeRecipe(selectedRecipe));
  }, [selected, recipes, setRecipe]);

  const options = Object.keys(recipes).map((key) => {
    return { key, value: key, text: recipes[key].name };
  });

  return (
    <Dropdown
      selection
      fluid
      value={selected}
      options={options}
      onChange={(e, d) => setSelected(d.value)}
      style={{ background: "rgb(33, 133, 208)", color: "white" }}
    />
  );
};

const standardizeRecipe = (recipe) => {
  const asArray = (value) => (Array.isArray(value) ? value : [value]);
  recipe.file = asArray(recipe.file) || [];
  recipe.filetype = recipe.filetype || "json";
  recipe.rows_selector = asArray(recipe.rows_selector) || [];
  recipe.columns = asArray(recipe.columns) || [];
  for (let i = 0; i < recipe.columns.length; i++) {
    recipe.columns[i].selector = asArray(recipe.columns[i].selector) || [];
  }

  return recipe;
};

export default RecipeSelector;
