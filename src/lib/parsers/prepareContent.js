import Papa from "papaparse";

const prepareContent = async (file, filetype, setContent) => {
  setContent({ content: null, filetype, loading: true, message: "" });

  let content = null;
  try {
    const text = await file.read();
    if (filetype === "json") content = JSON.parse(text);
    if (filetype === "html") content = new DOMfiletype().parseFromString(text, "text/html");
    if (filetype === "csv") content = Papa.parse(text, { header: true }).data;
  } catch (e) {
    console.log(e);
  }

  if (content === null) {
    setContent({
      content,
      filetype,
      loading: false,
      message: `Failed to parse file as ${filetype}`,
    });
  } else {
    setContent({ content, filetype, loading: false, message: `parsed file as ${filetype}` });
  }
};

export default prepareContent;
