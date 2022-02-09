import React, { useState } from "react";
import { Grid, Segment } from "semantic-ui-react";
import DropZone from "./lib/DropZone/DropZone";
import RecipeTemplate from "./lib/RecipeTemplate/RecipeTemplate";
import DataViewer from "./AppComponents/DataViewer";
import FileDropdown from "./AppComponents/FileDropdown";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [recipe, setRecipe] = useState({ allowedFiles: [], parser: "json" });

  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={4}>
        <Grid.Row>
          <RecipeTemplate recipe={recipe} setRecipe={setRecipe} />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={12}>
        <Segment style={{ display: "flex", flexDirection: "column" }}>
          <DropZone
            allowedFiles={recipe.allowedFiles}
            setAcceptedFiles={setAcceptedFiles}
            devmode
          />
          <br />
          <FileDropdown
            acceptedFiles={acceptedFiles}
            selected={selected}
            setSelected={setSelected}
          />
          <br />

          <DataViewer
            file={acceptedFiles.find((af) => af.path === selected)}
            parser={recipe.parser}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
