import React, { useEffect } from "react";
import { Dropdown } from "semantic-ui-react";

const FileDropdown = ({ acceptedFiles, selected, setSelected }) => {
  const items = acceptedFiles.map((f) => {
    return {
      key: f.name,
      text: f.name,
      value: f.path,
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
    if (acceptedFiles.length > 0 && !acceptedFiles.find((af) => af.path === selected))
      setSelected(acceptedFiles[0].path);
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
          {acceptedFiles.length !== 1 ? "s" : ""}
        </h4>
      </div>
    </div>
  );
};

export default FileDropdown;
