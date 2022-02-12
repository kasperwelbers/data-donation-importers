import React, { useEffect, useState } from "react";
import { Grid, Segment } from "semantic-ui-react";
import DropZone from "./lib/DropZone/DropZone";
import RecipeTemplate from "./AppComponents/RecipeTemplate";
import DataViewer from "./AppComponents/DataViewer";
import FileDropdown from "./AppComponents/FileDropdown";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [recipe, setRecipe] = useState({});
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const file = acceptedFiles.find((af) => af.path === selected);
    if (!file) {
      setContent({});
      return;
    }
    setLoading(true);
    file
      .parse(recipe.filetype)
      .then(setContent)
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [recipe.filetype, acceptedFiles, selected]);

  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={4}>
        <Grid.Row>
          <RecipeTemplate recipe={recipe} setRecipe={setRecipe} content={content} />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={12}>
        <Segment style={{ display: "flex", flexDirection: "column" }}>
          <DropZone allowedFiles={recipe.file} setAcceptedFiles={setAcceptedFiles} devmode />
          <br />
          <FileDropdown
            acceptedFiles={acceptedFiles}
            selected={selected}
            setSelected={setSelected}
          />
          <br />

          <DataViewer content={content} recipe={recipe} loading={loading} />
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
