import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";

const RecipeSelector = ({ recipes, setRecipe }) => {
  const [selected, setSelected] = useState(recipes ? Object.keys(recipes)[0] : "new_recipe");

  useEffect(() => {
    setRecipe(recipes[selected]);
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

export default RecipeSelector;
