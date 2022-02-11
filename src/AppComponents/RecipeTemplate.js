import React, { useEffect, useState } from "react";
import { Form, Segment, TextArea, Dropdown, Input, Header, Divider } from "semantic-ui-react";
import RecipeSelector from "./RecipeSelector";
import { recipes } from "../recipes.js";
import CreateColumns from "./CreateColumns";
import SelectorDropdown from "./SelectorDropdown";

const new_recipe = {
  name: "New recipe",
  files: ["history"],
  filetype: "json",
  base_paths: ["Browser History"],
  columns: [
    { name: "URL", paths: ["url"] },
    { name: "Title", paths: ["title"] },
    { name: "transition", paths: ["page_transition"] },
    { name: "client_id", paths: ["client_id"] },
    { name: "Date", paths: ["time_usec"] },
  ],
};

const RECIPES = { new_recipe, ...recipes };

const RecipeTemplate = ({ recipe, setRecipe, content }) => {
  const [hints, setHints] = useState(null);

  useEffect(() => {
    findHints(content, setHints);
  }, [content]);

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

  const setFiles = (files) => {
    setRecipe((recipe) => ({ ...recipe, files }));
  };

  const setBasePaths = (base_paths) => {
    setRecipe((recipe) => ({ ...recipe, base_paths }));
  };

  if (!delayedRecipe || !delayedRecipe.name || !delayedRecipe.filetype || !delayedRecipe.files)
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
          File name <span style={{ color: "grey" }}>+ optional aliases</span>
        </label>

        <SelectorDropdown values={recipe.files} setValues={setFiles} />
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
      <Form.Field>
        <label>
          Base path <span style={{ color: "grey" }}>+ optional aliases</span>
        </label>
        <SelectorDropdown values={recipe.base_paths} setValues={setBasePaths} />
      </Form.Field>
      {/* <JsonForms recipe={recipe} setRecipe={setRecipe} />
        <Transform recipe={recipe} setRecipe={setRecipe} /> */}
      <CreateColumns recipe={recipe} setRecipe={setRecipe} />
    </>
  );
};

const JsonForms = ({ recipe, setRecipe }) => {
  const [keyString, setKeyString] = useState("");
  const [pathsString, setPathsString] = useState("");

  useEffect(() => {
    if (!recipe.parser === "json") return;
    setKeyString(recipe.parser?.key || "");
    setPathsString(recipe.parser?.paths ? recipe.parser.paths.join("\n") : "");
  }, [recipe]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let paths = pathsString.split("\n");
      //paths = paths.map((path) => path.trim());
      if (paths.length === 1 && paths[0] === "") paths = [];
      setRecipe((recipe) => ({
        ...recipe,
        parser: { ...recipe.parser, key: keyString, paths },
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [keyString, pathsString, setRecipe]);

  if (recipe.parser?.filetype !== "json") return null;

  return (
    <>
      <Form.Field>
        <label>Base path</label>
        <Input
          placeholder="key in JSON to look in"
          value={keyString}
          onChange={(e, d) => setKeyString(d.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Columns</label>
        <TextArea
          placeholder={`Create columns by giving the column name followed by one or multiple paths for finding the column.\n\nname: ["path","alternative"]\ndate: ["date","datum"]`}
          value={pathsString}
          onChange={(e, d) => setPathsString(d.value)}
          style={{ height: "150px" }}
        />
      </Form.Field>
    </>
  );
};

const Transform = ({ recipe, setRecipe }) => {
  const [transformString, setTransformString] = useState("");

  useEffect(() => {
    setTransformString(recipe?.parser?.transform ? recipe.parser.transform.join("\n") : "");
  }, [recipe]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let transform = transformString.split("\n");
      transform = transform.map((t) => t.trim());
      if (transform.length === 1 && transform[0] === "") transform = [];
      setRecipe((recipe) => ({
        ...recipe,
        parser: { ...recipe.parser, transform },
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [transformString, setRecipe]);

  return (
    <Form.Field>
      <label>Transform</label>
      <TextArea
        placeholder="Transformation rules"
        value={transformString}
        onChange={(e, d) => setTransformString(d.value)}
        style={{ height: "100px" }}
      />
    </Form.Field>
  );
};

const findHints = (content, setHints) => {
  switch (content.filetype) {
    case "json":
      setHints(findHintsJSON(content));
    //case "html": setHints(findHintsJSON(content))
    //case "csv": setHints(findHintsJSON(content))
    default:
      return null;
  }
};

const findHintsJSON = (content) => {};

export default RecipeTemplate;
