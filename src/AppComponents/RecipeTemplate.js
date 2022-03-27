import React, { useEffect, useState } from "react";
import {
  Form,
  Segment,
  Dropdown,
  Input,
  Header,
  Divider,
  Button,
  Popup,
  ButtonGroup,
} from "semantic-ui-react";
import RecipeSelector from "./RecipeSelector";
import { recipes } from "../recipes.js";
import CreateColumns from "./CreateColumns";
import ListInputs from "./ListInputs";
import SelectorHelp from "./SelectorHelp";
import CreateTransformers from "./CreateTransformers";
import YAML from "json-to-pretty-yaml";

const new_recipe = {
  name: "New recipe",
  file: [],
  filetype: "json",
  rows_selector: [""],
  columns: [],
};

const RECIPES = { new_recipe, ...recipes };
const DELAY = 1000;

const RecipeTemplate = ({ recipe, setRecipe }) => {
  const [delayedRecipe, setDelayedRecipe] = useState(recipe);

  useEffect(() => {
    setDelayedRecipe(recipe);
  }, [recipe]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecipe(delayedRecipe);
    }, DELAY);
    return () => clearTimeout(timer);
  }, [delayedRecipe, setRecipe]);

  return (
    <Segment>
      <Header textAlign="center">Data Import Recipes</Header>

      <Form>
        <Form.Field>
          <label>Select Recipe</label>
          <div style={{ display: "flex" }}>
            <RecipeSelector recipes={RECIPES} setRecipe={setRecipe} />
            <RawViewers recipe={recipe} />
          </div>
        </Form.Field>
        <RecipeForms recipe={delayedRecipe} setRecipe={setDelayedRecipe} />
      </Form>
    </Segment>
  );
};

const RawViewers = ({ recipe }) => {
  if (!recipe || Object.keys(recipe).length === 0) return null;

  const cleanRecipe = { ...recipe };
  cleanRecipe.columns = cleanRecipe.columns.filter(
    (col) => col.name !== "" && col.selector.length > 0
  );
  cleanRecipe.transformers = cleanRecipe?.transformers?.filter((t) => t.transformer !== null);

  return (
    <ButtonGroup>
      <Popup
        on="click"
        wide="very"
        position="bottom left"
        trigger={<Button secondary>JSON</Button>}
      >
        <Popup.Content>
          <xmp>{JSON.stringify(cleanRecipe, null, 2)}</xmp>
        </Popup.Content>
      </Popup>
      <Popup
        on="click"
        wide="very"
        position="bottom left"
        trigger={<Button secondary>YAML</Button>}
      >
        <Popup.Content>
          <xmp>{YAML.stringify(cleanRecipe)}</xmp>
        </Popup.Content>
      </Popup>
    </ButtonGroup>
  );
};

const RecipeForms = ({ recipe, setRecipe }) => {
  // all typed values are passed via delayedRecipe

  const setRecipeName = (e, d) => {
    setRecipe((recipe) => ({ ...recipe, name: d.value }));
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

  if (!recipe || !recipe.name || !recipe.filetype || !recipe.file) return null;

  console.log(recipe);
  const rowSelector = (
    <Form.Field>
      <label>
        Rows selector{" "}
        <span style={{ color: "grey", float: "right" }}>use multiple rows to add aliases</span>
      </label>
      <ListInputs values={recipe.rows_selector} setValues={setRowsSelector} />
    </Form.Field>
  );

  return (
    <>
      <Form.Field>
        <label>Name</label>
        <Input value={recipe.name} placeholder={"Name of the recipe"} onChange={setRecipeName} />
      </Form.Field>
      <Form.Field style={{ width: "100%" }}>
        <label>
          File selector{" "}
          <span style={{ color: "grey", float: "right" }}>use multiple rows to add aliases</span>
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
      <Header>Extract data</Header>
      <SelectorHelp filetype={recipe.filetype} />
      {recipe?.filetype === "csv" ? null : rowSelector}
      <CreateColumns recipe={recipe} setRecipe={setRecipe} />

      <Divider />
      <Header>Transform columns</Header>
      <CreateTransformers recipe={recipe} setRecipe={setRecipe} />
    </>
  );
};

export default RecipeTemplate;
