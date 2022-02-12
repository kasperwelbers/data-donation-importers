import React, { useEffect, useState } from "react";
import { Form, Segment, Dropdown, Input, Header, Divider } from "semantic-ui-react";
import RecipeSelector from "./RecipeSelector";
import { recipes } from "../recipes.js";
import CreateColumns from "./CreateColumns";
import ListInputs from "./ListInputs";
import SelectorHelp from "./SelectorHelp";

const new_recipe = {
  name: "New recipe",
  file: ["history"],
  filetype: "json",
  rows_selector: ["Browser History"],
  columns: [
    { name: "URL", selector: ["url"] },
    { name: "Title", selector: ["title"] },
    { name: "transition", selector: ["page_transition"] },
    { name: "client_id", selector: ["client_id"] },
    { name: "Date", selector: ["time_usec"] },
  ],
};

const RECIPES = { new_recipe, ...recipes };

const RecipeTemplate = ({ recipe, setRecipe }) => {
  console.log(recipe);
  return (
    <Segment>
      <Header textAlign="center">Data Import Recipes</Header>

      <Form>
        <Form.Field>
          <label>Select Recipe</label>
          <RecipeSelector recipes={RECIPES} setRecipe={setRecipe} />
        </Form.Field>
        <RecipeForms recipe={recipe} setRecipe={setRecipe} />
      </Form>
    </Segment>
  );
};

const RecipeForms = ({ recipe, setRecipe }) => {
  // all typed values are passed via delayedRecipe
  const [delayedRecipe, setDelayedRecipe] = useState(recipe);

  useEffect(() => {
    setDelayedRecipe(recipe);
  }, [recipe]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecipe(delayedRecipe);
    }, 500);
    return () => clearTimeout(timer);
  }, [delayedRecipe, setRecipe]);

  const setRecipeName = (e, d) => {
    setDelayedRecipe((recipe) => ({ ...recipe, name: d.value }));
  };

  const setFileType = (e, d) => {
    setRecipe((recipe) => ({ ...recipe, filetype: d.value }));
  };

  const setFile = (file) => {
    setRecipe((recipe) => ({ ...recipe, file }));
  };

  const setRowsSelector = (rows_selector) => {
    setRecipe((recipe) => ({ ...recipe, rows_selector }));
  };

  if (!delayedRecipe || !delayedRecipe.name || !delayedRecipe.filetype || !delayedRecipe.file)
    return null;

  return (
    <>
      <Form.Field>
        <label>Name</label>
        <Input
          value={delayedRecipe.name}
          placeholder={"Name of the recipe"}
          onChange={setRecipeName}
        />
      </Form.Field>
      <Form.Field style={{ width: "100%" }}>
        <label>
          File selector <span style={{ color: "grey" }}>+ optional aliases</span>
        </label>

        <ListInputs values={recipe.file} setValues={setFile} />
      </Form.Field>
      <Form.Field>
        <label>File type</label>
        <Dropdown
          selection
          value={recipe.filetype}
          onChange={setFileType}
          options={["json", "html", "csv"].map((o) => ({
            key: o,
            value: o,
            text: o,
          }))}
        />
      </Form.Field>

      <Divider />
      <Header>Extracting columns</Header>
      <SelectorHelp filetype={recipe.filetype} />
      <Form.Field>
        <label>
          Rows selector <span style={{ color: "grey" }}>+ optional aliases</span>
        </label>
        <ListInputs values={recipe.rows_selector} setValues={setRowsSelector} />
      </Form.Field>
      {/* <JsonForms recipe={recipe} setRecipe={setRecipe} />
        <Transform recipe={recipe} setRecipe={setRecipe} /> */}
      <CreateColumns recipe={recipe} setRecipe={setRecipe} />
    </>
  );
};

export default RecipeTemplate;
