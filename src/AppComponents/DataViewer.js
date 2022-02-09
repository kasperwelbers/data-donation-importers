import React, { useEffect, useState } from "react";
import { Container, Segment, Loader, Dimmer, Message, Header } from "semantic-ui-react";

import ReactJson from "react-json-view";
import { DOMInspector } from "react-inspector";
import Papa from "papaparse";
import FullDataTable from "./FullDataTable";
import parserPipeline from "../lib/parsers/parserPipeline";

const DataViewer = ({ file, recipe }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!file) {
      setContent(null);
      setLoading(null);
      setMessage("");
      return;
    }
    prepareContent(file, recipe.parser.filetype, setContent, setLoading, setMessage);
  }, [file, recipe.parser?.filetype]);

  return (
    <Container style={{ overflow: "auto", flex: "1 1 auto", width: "100%" }}>
      {message ? <Message>{message}</Message> : null}

      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <Segment style={{ height: "40vh", overflow: "auto" }}>
        <RenderRaw content={content} />
      </Segment>
      <br />
      <RenderProcessed content={content} recipe={recipe} />
    </Container>
  );
};

const RenderRaw = ({ content }) => {
  if (!content?.content) return null;
  switch (content.parser) {
    case "json":
      return (
        <>
          <Header textAlign="center">Raw JSON</Header>
          <ReactJson name={null} collapseStringsAfterLength={30} src={content.content} />
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

const prepareContent = async (file, parser, setContent, setLoading, setMessage) => {
  setLoading(true);

  let content = null;
  try {
    const text = await file.read();
    if (parser === "json") content = JSON.parse(text);
    if (parser === "html") content = new DOMParser().parseFromString(text, "text/html");
    if (parser === "csv") content = Papa.parse(text, { header: true }).data;
  } catch (e) {
    console.log(e);
  }

  if (content === null) {
    setMessage(`Failed to parse file as ${parser}`);
    setContent({ content, parser });
  } else {
    setMessage(`parsed file as ${parser}`);
    setContent({ content, parser });
  }
  setLoading(false);
};

export default DataViewer;
