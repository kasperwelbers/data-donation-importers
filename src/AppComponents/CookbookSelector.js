import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import createCookbook from "../lib/recipes/createCookbook.js";
import { recipes } from "../recipes.js";

const options = Object.keys(recipes).map((key) => {
  return { key, text: key, value: key };
});

const CookbookSelector = ({ setCookbook }) => {
  const [selected, setSelected] = useState(options.map((o) => o.value));

  useEffect(() => {
    const recipesArray = selected.map((key) => recipes[key]);
    const newcookbook = createCookbook(recipesArray);
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
