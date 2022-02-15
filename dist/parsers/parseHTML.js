"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseHTML;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.string.trim.js");

function parseHTML(content, rows_selector, column_selectors) {
  let head = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (column_selectors.length === 0) return [];
  let elements = Array.from(content.querySelectorAll(rows_selector));
  if (head) elements = elements.slice(0, 5);
  if (!elements || elements.length === 0) return [];
  let data = elements.map(el => {
    const row = {};

    for (let column_selector of column_selectors) {
      if (column_selector === "FULL_ROW_OBJECT") {
        row[column_selector] = el.outerHTML;
        continue;
      }

      let [selector, extractor] = column_selector.split("@");
      const selected = selector === "" ? el : el.querySelector(selector);
      if (!selected) continue;

      if (!extractor) {
        row[column_selector] = selected.textContent;
      } else {
        if (extractor === "OUTER") {
          row[column_selector] = selected.outerHTML;
        } else if (extractor === "INNER") {
          row[column_selector] = selected.innerHTML;
        } else if (extractor === "TEXT") {
          row[column_selector] = extractTEXT(selected);
        } else {
          var _selected$attributes, _selected$attributes$;

          row[column_selector] = (_selected$attributes = selected.attributes) === null || _selected$attributes === void 0 ? void 0 : (_selected$attributes$ = _selected$attributes[extractor]) === null || _selected$attributes$ === void 0 ? void 0 : _selected$attributes$.textContent;
        }
      }
    }

    return row;
  });
  return data;
}

const extractTEXT = el => {
  const text = [];

  for (let child of el.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE) continue;
    text.push(child.textContent.trim());
  }

  return text.join(" ");
};