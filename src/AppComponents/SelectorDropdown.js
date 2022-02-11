import React, { useEffect, useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button, Dropdown, Icon, Popup, Ref, TextArea } from "semantic-ui-react";

const SelectorDropdown = ({ values, setValues, message, hints }) => {
  let options = values.map((value) => ({
    key: value,
    text: value,
    value,
  }));
  if (hints && hints.length > 0) {
    const addOptions = hints.map((h) => ({ key: h, text: h, value: h }));
    options = [...options, ...addOptions];
  }

  return (
    <Dropdown
      fluid
      selection
      allowAdditions
      search
      multiple
      value={values}
      options={options}
      onAddItem={(e, d) => (d.onClick = () => console.log("test"))}
      onChange={(e, d) => setValues(d.value)}
      noResultsMessage={message || "Type to add new"}
    />
  );
};

const ListInputs = ({ values, setValues, message, hints }) => {
  const [string, setString] = useState("");

  useEffect(() => {
    setString(values.join("\n"));
  }, [values]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (string === values.join("\n")) return;
      setValues(string.split("\n"));
    }, 500);
    return () => clearTimeout(timer);
  }, [string, setValues, values]);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <TextareaAutosize
        value={string}
        onChange={(e) => setString(e.target.value)}
        placeholder={message}
        rows={1}
      />
      <SearchPopup />
    </div>
  );
};

const SearchPopup = ({}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  let options = [];
  let hints = ["test", "dit", "ok"];
  if (hints && hints.length > 0) {
    options = hints.map((h) => ({ key: h, text: h, value: h }));
  }

  return (
    <Popup
      open={open}
      onOpen={() => {
        setTimeout(() => (ref.current ? ref.current.click() : null), 50);
      }}
      position="bottom left"
      style={{ padding: "0" }}
      trigger={
        <Icon
          name="search"
          onClick={() => {
            setOpen(!open);
          }}
          style={{ cursor: "pointer", position: "absolute", right: 0 }}
        />
      }
    >
      <Ref innerRef={ref}>
        <Dropdown
          search
          selection
          fluid
          options={options}
          autoComplete={"on"}
          selectOnNavigation={false}
          noResultsMessage={"type to search"}
          style={{ width: "200px" }}
        />
      </Ref>
    </Popup>
  );
};

export default ListInputs;
