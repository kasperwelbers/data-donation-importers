import React, { useEffect, useState } from "react";
import {
  Container,
  Segment,
  Loader,
  Dimmer,
  Message,
  Header,
  Button,
  Checkbox,
} from "semantic-ui-react";

import ReactJson from "react-json-view";
import { DOMInspector } from "react-inspector";
import FullDataTable from "./FullDataTable";
import parserPipeline from "../lib/parsers/parserPipeline";
import transformerPipeline from "../lib/transformers/transformerPipeline";

const DataViewer = ({ content, recipe, loading, updateRecipeIn }) => {
  const [showRaw, setShowRaw] = useState(false);

  if (!recipe || !content?.content) return null;

  return (
    <Container style={{ overflow: "auto", flex: "1 1 auto", width: "100%" }}>
      <div style={{ display: "flex" }}>
        <Button
          content={showRaw ? "Hide raw data" : "Show raw data"}
          primary
          onClick={() => setShowRaw(!showRaw)}
        />
        {content.message ? <Message style={{ margin: "0" }}>{content.message}</Message> : null}
      </div>
      <Dimmer active={loading || false}>
        <Loader />
      </Dimmer>

      {showRaw ? (
        <Segment style={{ height: "40vh", overflow: "auto" }}>
          <RenderRaw content={content} />
        </Segment>
      ) : null}
      <br />
      <RenderProcessed content={content} recipe={recipe} />
    </Container>
  );
};

const RenderRaw = ({ content }) => {
  if (!content?.content) return null;
  switch (content.filetype) {
    case "json":
      return (
        <>
          <Header textAlign="center">Raw JSON</Header>
          <ReactJson
            name={null}
            displayArrayKeys={false}
            enableClipboard={false}
            collapseStringsAfterLength={30}
            src={content.content}
          />
        </>
      );
    case "html":
      return (
        <>
          <Header textAlign="center">Raw HTML</Header>
          <DOMInspector data={content.content} />
        </>
      );
    case "csv":
      return (
        <>
          <Header textAlign="center">Raw CSV</Header>
          <FullDataTable fullData={content.content} />
        </>
      );
    default:
      return null;
  }
};

const RenderProcessed = ({ content, recipe }) => {
  const [data, setData] = useState(null);
  const [head, setHead] = useState(true);

  useEffect(() => {
    let data = parserPipeline(content, recipe, head);
    data = transformerPipeline(data, recipe);
    setData(data);
  }, [content, recipe, head, setData]);

  if (!data) return null;

  return (
    <>
      <Header textAlign="center">
        Processed data <br />
        <span style={{ marginLeft: "10px", color: "grey", fontSize: "12px" }}>
          <Checkbox
            checked={head}
            toggle
            label="only process first 50 (be carefull when testing filters)"
            onChange={(e, d) => setHead(d.checked)}
            style={{ transform: "scale(0.7)" }}
          />
        </span>
      </Header>

      <FullDataTable fullData={data} />
    </>
  );
};

export default DataViewer;
