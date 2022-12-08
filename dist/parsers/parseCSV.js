"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseHTML;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.json.stringify.js");

function parseHTML(content, rows_selector, column_selectors) {
  let head = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (column_selectors.length === 0) return [];
  const rows = head ? content.slice(0, 50) : content;
  return rows.map(row => {
    const selectedRow = {};

    for (let column of column_selectors) {
      if (column === "FULL_ROW_OBJECT") {
        selectedRow[column] = JSON.stringify(row);
        continue;
      }

      if (row[column]) selectedRow[column] = row[column];
    }

    return selectedRow;
  });
}