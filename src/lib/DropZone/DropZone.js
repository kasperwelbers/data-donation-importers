import React, { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import File from "./File.js";

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
  transition: "border .24s ease-in-out",
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
export default function DropZone({ allowedFiles, setAcceptedFiles, devmode }) {
  const { getRootProps, getInputProps, acceptedFiles, isFocused, isDragAccept, isDragReject } =
    useDropzone(createValidator(allowedFiles));

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    listFiles(acceptedFiles, setAcceptedFiles, allowedFiles, devmode);
  }, [acceptedFiles, setAcceptedFiles, allowedFiles, devmode]);

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <p>Drag a file or folder into this area, or click here to select a file</p>
    </div>
  );
}

const listFiles = async (acceptedFiles, setAcceptedFiles, allowedFiles, devmode) => {
  const files = [];
  for (let af of acceptedFiles) {
    if (/\.zip$/.test(af.name.toLowerCase())) {
      const zippedfiles = await listZippedFiles(af, allowedFiles);
      for (let zfile of zippedfiles) files.push(zfile);
    } else {
      if (devmode && !fileIsAllowed(af.path, allowedFiles)) continue;
      files.push(new File(af.name, af.path, af));
    }
  }

  setAcceptedFiles(files);
};

const listZippedFiles = async (file, allowedFiles) => {
  let newZip = new JSZip();
  const zipped = await newZip.loadAsync(file);
  const zippedfiles = Object.values(zipped.files);
  return zippedfiles.reduce((files, zfile) => {
    if (!fileIsAllowed(zfile.name, allowedFiles)) return files;
    const name = zfile.name.split("/").splice(-1)[0];
    files.push(new File(name, zfile.name, zfile, zipped));
    return files;
  }, []);
};

const createValidator = (allowedFiles, devmode) => {
  if (!allowedFiles || devmode) return {};

  const validator = (file) => {
    if (/\.zip$/.test(file.name.toLowerCase())) return null; // zip files are processed and filtered in createFiles
    if (fileIsAllowed(file.path, allowedFiles)) return null;
    return {
      code: "file-not-allowed",
      message: "File doesn't match any of the allowed filenames",
    };
  };

  return { validator };
};

const fileIsAllowed = (path, allowedFiles) => {
  if (allowedFiles.length === 0) return true;
  for (let allowedFile of allowedFiles) {
    if (path.toLowerCase().includes(allowedFile.toLowerCase())) return true;
  }
  return false;
};
