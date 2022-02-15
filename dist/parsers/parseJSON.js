"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseJSON;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.json.stringify.js");

var _jsonpathPlus = require("jsonpath-plus");

//import { reparseAsUTF8 } from "./reparseAsUTF8";
function parseJSON(content, rows_selector, column_selectors) {
  let head = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (column_selectors.length === 0) return []; // JSONPATH: https://goessner.net/articles/JsonPath/

  const wrap = false;
  let objects = (0, _jsonpathPlus.JSONPath)({
    path: rows_selector || "$.",
    json: content,
    wrap
  });
  if (head) objects = objects.slice(0, 5);
  if (!objects) return [];
  let data = objects.map(json => {
    const row = {};

    for (let column_selector of column_selectors) {
      if (column_selector === "FULL_ROW_OBJECT") {
        row[column_selector] = JSON.stringify(json, null, 2);
        continue;
      }

      row[column_selector] = (0, _jsonpathPlus.JSONPath)({
        path: column_selector,
        json,
        wrap
      });
    }

    return row;
  }); //let objects = findBasePath(content, null, rows_selector);
  //let data = findcolumn_selectors(column_selectors, objects);
  // Ask Bob what this does. Currently breaks on some JSON, but its probably a smart idea (because Bob)
  // data = reparseAsUTF8(data);

  return data;
} // The following is a modified version of Bob's approach.
// Keeping it for now till certain JSONpaths works well
// const findBasePath = function (objects, prepath, in_key) {
//   if (in_key) {
//     // If this is a nested key (using '.' notation, e.g. "level1key.level2key")
//     if (/(?<!\\)\./.test(in_key)) {
//       // check of non-escaped dot
//       let [current_key, next_key] = in_key.split(/(?<!\\)\.(.+)/);
//       // if there is already a prepath
//       if (typeof prepath !== undefined || prepath !== null) {
//         return findBasePath(objects[current_key], prepath + "." + current_key, next_key);
//       }
//       return findBasePath(objects[current_key], current_key, next_key);
//     }
//     return findBasePath(objects[in_key], prepath);
//   }
//   return objects;
// };
// // findBasePath selects the starting point for recursive parsing
// // for each object in the file and returns the resulting objects.
// const findPaths = function (column_selectors, objects) {
//   if (Array.isArray(objects)) {
//     // in case the contents is just one array of values,
//     // instead of an array of objects
//     if (column_selectors.length === 0) {
//       let entries = [];
//       let i = 0;
//       while (i < objects.length) {
//         entries.push({
//           index: i,
//           value: objects[i],
//         });
//         i++;
//       }
//       return entries;
//     } else {
//       // extract the whitelisted column_selectors from all objects
//       // in the array contained in the file
//       return objects.map((obj) => objReader(column_selectors, obj));
//     }
//   }
//   // If the objects is actually one object (not an array)
//   return [objReader(column_selectors, objects)];
// };
// // objReader recursively parses JSON objects to extract
// // the whitelisted fields and returns a flattened representation.
// const objReader = function (spec, o, parentKey) {
//   let flat_obj = {};
//   // if the object is the endpoint of a spec,
//   if (!spec) return o;
//   for (let option of spec) {
//     let key, childKeys, index;
//     // split on first non-escaped dot to separate key and child keys
//     [key, childKeys] = option.split(/(?<!\\)\.(.+)/);
//     // split on first non-escaped left square bracket, to separate key from index
//     [key, index] = key.split(/(?<!\\)\[(.+)/);
//     index = index ? Number(index.replace("]", "")) : null;
//     //[key, index] = option.split();
//     let val = o[key];
//     if (val && index !== null) val = val[index];
//     if (!val) continue;
//     let newkey = key;
//     if (parentKey) newkey = parentKey + "." + newkey;
//     if (index !== null) newkey = newkey + `[${index}]`;
//     const childOptions = childKeys ? [childKeys] : null;
//     if (Array.isArray(val)) {
//       if (childKeys) newkey = newkey + "." + childKeys;
//       const resultsArray = val.map((c) => objReader(childOptions, c));
//       flat_obj[newkey] = resultsArray;
//       continue;
//     }
//     if (typeof val == "object" && val != null) {
//       flat_obj = Object.assign(flat_obj, objReader(childOptions, val, newkey));
//       continue;
//     }
//     if (childKeys) continue;
//     flat_obj[newkey] = val;
//   }
//   return flat_obj;
// };