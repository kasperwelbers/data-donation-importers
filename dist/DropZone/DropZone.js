"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DropZone;

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.test.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.string.includes.js");

var _react = _interopRequireWildcard(require("react"));

var _reactDropzone = require("react-dropzone");

var _jszip = _interopRequireDefault(require("jszip"));

var _File = _interopRequireDefault(require("./File.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const baseStyle = {
  alignItems: "center",
  textAlign: "center",
  padding: "20px",
  fontSize: "15px",
  textShadow: "0px 0px 10px #12263bf7",
  borderWidth: 3,
  borderRadius: "20px",
  borderColor: "black",
  borderStyle: "dashed",
  backgroundColor: "#2185d0",
  color: "white",
  outline: "none",
  cursor: "pointer",
  transition: "border .24s ease-in-out"
};
const focusedStyle = {};
const acceptStyle = {};
const rejectStyle = {};
/**
 *
 * @param {Array} allowedFiles An array with filenames. Only uploaded filenames that 'include' these names are accepted
 * @param {Function} setAcceptedFiles Callback for setting the acceptedFiles state. This is an array of File class instances.
 *
 * @param {bool} devmode  If TRUE, files that don't match allowedFiles are not blocked, but filtered afterwards. This is only
 *                        used for developing recipes (it lets us updated acceptedFiles without having to re-upload data)
 * @returns
 */

function DropZone(_ref) {
  let {
    allowedFiles,
    setAcceptedFiles,
    devmode
  } = _ref;
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject
  } = (0, _reactDropzone.useDropzone)(createValidator(allowedFiles));
  const style = (0, _react.useMemo)(() => _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, baseStyle), isFocused ? focusedStyle : {}), isDragAccept ? acceptStyle : {}), isDragReject ? rejectStyle : {}), [isFocused, isDragAccept, isDragReject]);
  (0, _react.useEffect)(() => {
    listFiles(acceptedFiles, setAcceptedFiles, allowedFiles, devmode);
  }, [acceptedFiles, setAcceptedFiles, allowedFiles, devmode]);
  return /*#__PURE__*/_react.default.createElement("div", getRootProps({
    style
  }), /*#__PURE__*/_react.default.createElement("input", getInputProps()), /*#__PURE__*/_react.default.createElement("p", null, "Drag a file or folder into this area, or click here to select a file"));
}

const listFiles = async (acceptedFiles, setAcceptedFiles, allowedFiles, devmode) => {
  const files = [];

  for (let af of acceptedFiles) {
    if (/\.zip$/.test(af.name.toLowerCase())) {
      const zippedfiles = await listZippedFiles(af, allowedFiles);

      for (let zfile of zippedfiles) files.push(zfile);
    } else {
      if (devmode && !fileIsAllowed(af.path, allowedFiles)) continue;
      files.push(new _File.default(af.name, af.path, af));
    }
  }

  setAcceptedFiles(files);
};

const listZippedFiles = async (file, allowedFiles) => {
  let newZip = new _jszip.default();
  const zipped = await newZip.loadAsync(file);
  const zippedfiles = Object.values(zipped.files);
  return zippedfiles.reduce((files, zfile) => {
    if (!fileIsAllowed(zfile.name, allowedFiles)) return files;
    const name = zfile.name.split("/").splice(-1)[0];
    files.push(new _File.default(name, zfile.name, zfile, zipped));
    return files;
  }, []);
};

const createValidator = (allowedFiles, devmode) => {
  if (!allowedFiles || devmode) return {};

  const validator = file => {
    if (/\.zip$/.test(file.name.toLowerCase())) return null; // zip files are processed and filtered in createFiles

    if (fileIsAllowed(file.path, allowedFiles)) return null;
    return {
      code: "file-not-allowed",
      message: "File doesn't match any of the allowed filenames"
    };
  };

  return {
    validator
  };
};

const fileIsAllowed = (path, allowedFiles) => {
  if (allowedFiles.length === 0) return true;

  for (let allowedFile of allowedFiles) {
    if (path.toLowerCase().includes(allowedFile.toLowerCase())) return true;
  }

  return false;
};