import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const ListInputs = ({ values, setValues, message }) => {
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
      {/* <SearchPopup /> */}
    </div>
  );
};

// The idea here was to add a search popup for getting hints about what selectors to use
// but maybe that's really overdoing it. Instead, could show hints based on raw data

// const SearchPopup = ({}) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef();
//   let options = [];
//   let hints = ["test", "dit", "ok"];
//   if (hints && hints.length > 0) {
//     options = hints.map((h) => ({ key: h, text: h, value: h }));
//   }

//   return (
//     <Popup
//       open={open}
//       onOpen={() => {
//         setTimeout(() => (ref.current ? ref.current.click() : null), 50);
//       }}
//       position="bottom left"
//       style={{ padding: "0" }}
//       trigger={
//         <Icon
//           name="search"
//           onClick={() => {
//             setOpen(!open);
//           }}
//           style={{ cursor: "pointer", position: "absolute", right: 0 }}
//         />
//       }
//     >
//       <Ref innerRef={ref}>
//         <Dropdown
//           search
//           selection
//           fluid
//           options={options}
//           autoComplete={"on"}
//           selectOnNavigation={false}
//           selectOnBlur={false}
//           noResultsMessage={"type to search"}
//           style={{ width: "200px" }}
//         />
//       </Ref>
//     </Popup>
//   );
// };

export default ListInputs;
