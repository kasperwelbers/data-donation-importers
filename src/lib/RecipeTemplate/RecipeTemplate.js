import React, { useEffect, useState } from "react";
import { Form, Segment, TextArea, Dropdown } from "semantic-ui-react";

const RecipeTemplate = ({ recipe, setRecipe }) => {
  const [fileNames, setFileNames] = useState("");

  const updateRecipe = (key, value) => {
    setRecipe((recipe) => ({ ...recipe, [key]: value }));
  };

  useEffect(() => {
    setFileNames(recipe.allowedFiles.join("\n"));
  }, [recipe]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let fnames = fileNames.split("\n");
      fnames = fnames.map((fname) => fname.trim());
      setRecipe((recipe) => ({ ...recipe, allowedFiles: fnames }));
    }, 500);
    return () => clearTimeout(timer);
  }, [fileNames, setRecipe]);

  return (
    <Segment>
      <h4>Data Import Recipe</h4>
      <Form>
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
            value={recipe.parser}
            onChange={(e, d) => updateRecipe("parser", d.value)}
            options={["json", "html", "csv"].map((o) => ({
              key: o,
              value: o,
              text: o,
            }))}
          />
        </Form.Field>
      </Form>
    </Segment>
  );
};

export default RecipeTemplate;
