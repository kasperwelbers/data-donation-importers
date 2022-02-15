"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reparseAsUTF8 = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array-buffer.slice.js");

require("core-js/modules/es.typed-array.uint8-array.js");

require("core-js/modules/es.typed-array.set.js");

require("core-js/modules/es.typed-array.sort.js");

require("core-js/modules/es.typed-array.to-locale-string.js");

require("core-js/modules/es.json.stringify.js");

// reparseAsUTF8 stringifies an object, parses the string as UTF8
// and returns the JSON parsed result. This removes issues with
// UTF-8 donations, that JS assumes are UTF-16.
const reparseAsUTF8 = function reparseAsUTF8(object) {
  // drawn from https://stackoverflow.com/questions/52747566/what-encoding-facebook-uses-in-json-files-from-data-export
  function decode(s) {
    let d = new TextDecoder();
    let a = s.split("").map(r => r.charCodeAt());
    return d.decode(new Uint8Array(a));
  }

  let stringObj = JSON.stringify(object);
  let decodedString = decode(stringObj);
  return JSON.parse(decodedString);
};

exports.reparseAsUTF8 = reparseAsUTF8;