import React, { useEffect, useState } from "react";
import { Container, Segment, Loader, Dimmer, Message, Header } from "semantic-ui-react";

import ReactJson from "react-json-view";
import { DOMInspector, TableInspector } from "react-inspector";
import Papa from "papaparse";
import FullDataTable from "./FullDataTable";

const DataViewer = ({ file, parser }) => {
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
    prepareContent(file, parser, setContent, setLoading, setMessage);
  }, [file, parser]);

  return (
    <Container style={{ overflow: "auto", flex: "1 1 auto", width: "100%" }}>
      <Message>{message}</Message>
      <Header textAlign="center">Raw data</Header>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <RenderRaw content={content} />
    </Container>
  );
};

const RenderRaw = ({ content }) => {
  if (!content?.content) return null;
  switch (content.parser) {
    case "json":
      return <ReactJson collapsed collapseStringsAfterLength={30} src={content.content} />;
    case "html":
      return <DOMInspector data={content.content} />;
    case "csv":
      return <FullDataTable fullData={content.content} />;
    default:
      return null;
  }
};

const prepareContent = async (file, parser, setContent, setLoading, setMessage) => {
  setLoading(true);

  let content = null;
  try {
    const text = await file.read();
    console.log(parser);
    if (parser === "json") content = JSON.parse(text);
    if (parser === "html") content = new DOMParser().parseFromString(text, "text/html");
    if (parser === "csv") content = Papa.parse(text).data;
  } catch (e) {
    console.log(e);
  }

  console.log(content);
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
