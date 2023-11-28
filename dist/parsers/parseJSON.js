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
  if (column_selectors.length === 0) return [];

  // JSONPATH: https://goessner.net/articles/JsonPath/
  const wrap = false;
  let objects = (0, _jsonpathPlus.JSONPath)({
    path: rows_selector || "$.",
    json: content,
    wrap
  });
  if (head) objects = objects.slice(0, 50);
  if (!objects) return [];
  let data = objects.map(json => {
    const row = {};
    for (let column_selector of column_selectors) {
      if (column_selector === "FULL_ROW_OBJECT") {
        row[column_selector] = JSON.stringify(json, null, 2);
        continue;
      }
      // const value =
      row[column_selector] = (0, _jsonpathPlus.JSONPath)({
        path: column_selector,
        json,
        wrap
      });
    }
    return row;
  });

  // Ask Bob what this does. Currently breaks on some JSON, but its probably a smart idea (because Bob)
  // data = reparseAsUTF8(data);

  return data;
}