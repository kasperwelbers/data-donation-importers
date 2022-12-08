import React, { useState } from "react";
import { Button, Message } from "semantic-ui-react";

const SelectorHelp = ({ filetype }) => {
  const [details, setDetails] = useState(false);

  let help = {};
  if (filetype === "json") help = jsonHelp();
  if (filetype === "html") help = htmlHelp();
  if (filetype === "csv") help = csvHelp();

  return (
    <Message style={{ position: "relativel" }}>
      <Button
        onClick={() => setDetails(!details)}
        style={{
          padding: "2px",
          position: "absolute",
          top: "2px",
          right: "0",
          visibility: help.details ? "visible" : "hidden",
        }}
      >
        {details ? "hide details" : "show details"}
      </Button>
      {help.short}
      {details ? help.details : ""}
    </Message>
  );
};

const jsonHelp = () => {
  const short = (
    <>
      For JSON files, use{" "}
      <a href="https://goessner.net/articles/JsonPath/" target="_blank" rel="noopener noreferrer">
        JsonPath
      </a>{" "}
      selectors
    </>
  );
  const details = (
    <>
      <br />
      <br />
      Use <b>Rows selector</b> to select an array in the data. Each item will become a row. With the{" "}
      <b>column selectors</b> you then select specific values in these array items.
    </>
  );
  return { short, details };
};

const csvHelp = () => {
  const short = <>For CSV files, you only need to provide the column names</>;
  const details = null;
  return { short, details };
};

const htmlHelp = () => {
  const short = (
    <>
      For HTML files, use{" "}
      <a
        href="https://www.w3schools.com/cssref/css_selectors.asp"
        target="_blank"
        rel="noopener noreferrer"
      >
        CCS selectors
      </a>{" "}
    </>
  );
  const details = (
    <>
      <br />
      <br />
      The CCS selector in <b>Rows selector</b> should select a list of nodes. Each node will become
      a row. With the <b>column selectors</b> you can select specific children of these nodes to use
      as values.
      <br />
      <br />
      By default, the textContent of a selected node is extracted. To extract an attribute, add{" "}
      <b>@[attribute]</b> (e.g., a@href). Also, use <b>@TEXT</b> to only get the text content of the
      selected node (exluding the children). With <b>@OUTER</b> and <b>@INNER</b> you get the full
      outerHTML and innerHTML.
    </>
  );
  return { short, details };
};

export default SelectorHelp;
