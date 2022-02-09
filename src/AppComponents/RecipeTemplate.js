import React, { useEffect, useState } from "react";
import { Form, Segment, TextArea, Dropdown, Input, Header } from "semantic-ui-react";
import RecipeSelector from "./RecipeSelector";
import { recipes } from "../recipes.js";

const RecipeTemplate = ({ recipe, setRecipe }) => {
  const [name, setName] = useState("");
  const [fileNames, setFileNames] = useState("");
  const [fileType, setFileType] = useState("json");

  const setRecipeName = (value) => {
    setRecipe((recipe) => ({ ...recipe, name: value }));
  };

  const setParserSetting = (key, value) => {
    setRecipe((recipe) => ({ ...recipe, parser: { ...recipe.parser, [key]: value } }));
  };

  useEffect(() => {
    setFileNames(recipe.files?.join("\n") || "");
    setFileType(recipe.parser?.filetype);
    setName(recipe.name || "");
  }, [recipe]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let fnames = fileNames.split("\n");
      fnames = fnames.map((fname) => fname.trim());
      if (fnames.length === 1 && fnames[0] === "") fnames = [];
      setRecipe((recipe) => ({ ...recipe, files: fnames }));
    }, 500);
    return () => clearTimeout(timer);
  }, [fileNames, setRecipe]);

  return (
    <Segment>
      <Header textAlign="center">Data Import Recipes</Header>

      <Form>
        <Form.Field>
          <label>Select Recipe</label>
          <RecipeSelector recipes={recipes} setRecipe={setRecipe} />
        </Form.Field>
        <Form.Field>
          <label>Name</label>
          <Input
            value={name}
            placeholder={"Name of the recipe"}
            onChange={(e, d) => setRecipeName(d.value)}
          />
        </Form.Field>
        <Form.Field style={{ width: "100%" }}>
          <label>File names</label>
          <TextArea
            placeholder="Type string to match filename. Use multiple rows for aliases"
            value={fileNames}
            onChange={(e, d) => setFileNames(d.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Parser</label>
          <Dropdown
            selection
            value={fileType}
            onChange={(e, d) => setParserSetting("filetype", d.value)}
            options={["json", "html", "csv"].map((o) => ({
              key: o,
              value: o,
              text: o,
            }))}
          />
        </Form.Field>
        <JsonForms recipe={recipe} setRecipe={setRecipe} />
        <Transform recipe={recipe} setRecipe={setRecipe} />
      </Form>
    </Segment>
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
        <label>Key</label>
        <Input
          placeholder="key in JSON to look in"
          value={keyString}
          onChange={(e, d) => setKeyString(d.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Paths</label>
        <TextArea
          placeholder="Paths to filter on"
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

export default RecipeTemplate;
