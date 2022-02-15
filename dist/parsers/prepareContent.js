"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _papaparse = _interopRequireDefault(require("papaparse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const prepareContent = async (file, filetype, setContent) => {
  setContent({
    content: null,
    filetype,
    loading: true,
    message: ""
  });
  let content = null;

  try {
    const text = await file.read();
    if (filetype === "json") content = JSON.parse(text);
    if (filetype === "html") content = new DOMfiletype().parseFromString(text, "text/html");
    if (filetype === "csv") content = _papaparse.default.parse(text, {
      header: true
    }).data;
  } catch (e) {
    console.log(e);
  }

  if (content === null) {
    setContent({
      content,
      filetype,
      loading: false,
      message: "Failed to parse file as ".concat(filetype)
    });
  } else {
    setContent({
      content,
      filetype,
      loading: false,
      message: "parsed file as ".concat(filetype)
    });
  }
};

var _default = prepareContent;
exports.default = _default;