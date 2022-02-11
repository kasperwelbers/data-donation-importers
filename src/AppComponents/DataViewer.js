import React, { useEffect, useState } from "react";
import { Container, Segment, Loader, Dimmer, Message, Header, Button } from "semantic-ui-react";

import ReactJson from "react-json-view";
import { DOMInspector } from "react-inspector";
import FullDataTable from "./FullDataTable";
import parserPipeline from "../lib/parsers/parserPipeline";

const DataViewer = ({ content, recipe, loading }) => {
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
  const [processed, setProcessed] = useState(null);

  useEffect(() => {
    setProcessed(parserPipeline(content, recipe));
  }, [content, recipe, setProcessed]);

  if (!processed) return null;
  return (
    <>
      <Header textAlign="center">Processed data</Header>
      <FullDataTable fullData={processed} />
    </>
  );
};

export default DataViewer;
