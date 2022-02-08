import React, { useEffect, useState } from "react";
import { Grid, Segment, Dropdown, Loader, Dimmer } from "semantic-ui-react";
import DropZone from "./lib/DropZone/DropZone";
import RecipeTemplate from "./lib/RecipeTemplate/RecipeTemplate";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [allowedFiles, setAllowedFiles] = useState([]);

  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={4}>
        <Grid.Row>
          <RecipeTemplate setAllowedFiles={setAllowedFiles} />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={12}>
        <Segment
          style={{ height: "90vh", display: "flex", flexDirection: "column" }}
        >
          <DropZone
            allowedFiles={allowedFiles}
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
          <PrintFile selected={selected} />
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

const PrintFile = ({ selected }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(null);
    setLoading(true);
    if (selected) {
      selected
        .read()
        .then(setContent)
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } else {
      setContent(null);
      setLoading(false);
    }
  }, [selected]);

  return (
    <Segment style={{ overflow: "auto", flex: "1 1 auto" }}>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      {content}
    </Segment>
  );
};

const FileDropdown = ({ acceptedFiles, selected, setSelected }) => {
  const items = acceptedFiles.map((f) => {
    return {
      key: f.name,
      text: f.name,
      value: f,
      content: (
        <>
          {f.name}
          <br />
          <span style={{ color: "grey" }}>{f.path.replace(f.name, "")}</span>
        </>
      ),
    };
  });

  useEffect(() => {
    if (acceptedFiles.length > 0 && !acceptedFiles.includes(selected))
      setSelected(acceptedFiles[0]);
    if (acceptedFiles.length === 0) setSelected(null);
  }, [acceptedFiles, selected, setSelected]);

  return (
    <div style={{ display: "flex" }}>
      <Dropdown
        labeled
        selection
        value={selected}
        onChange={(e, d) => setSelected(d.value)}
        options={items}
        style={{ flex: "0 0 auto", width: "300px" }}
      />
      <div style={{ flex: "1 1 auto", paddingLeft: "10px", paddingTop: "8px" }}>
        <h4>
          Recipe matched {acceptedFiles.length} file
          {acceptedFiles.length > 1 ? "s" : ""}
        </h4>
      </div>
    </div>
  );
};
