import React, { useEffect, useState } from "react";
import { Form, Segment, TextArea } from "semantic-ui-react";

export default function RecipeTemplate({ setAllowedFiles }) {
  const [fileNames, setFileNames] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      let fnames = fileNames.split("\n");
      fnames = fnames.map((fname) => fname.trim());
      setAllowedFiles(fnames);
    }, 500);
    return () => clearTimeout(timer);
  }, [fileNames, setAllowedFiles]);

  return (
    <Segment>
      <h4>Data Import Recipe</h4>
      <Form>
        <Form.Group>
          <Form.Field style={{ width: "100%" }}>
            <label>File names</label>
            <TextArea
              placeholder="One or multiple file names"
              value={fileNames}
              onChange={(e, d) => setFileNames(d.value)}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  );
}
