//import { reparseAsUTF8 } from "./reparseAsUTF8";
import { JSONPath } from "jsonpath-plus";

export default function parseJSON(content, rows_selector, column_selectors, head = false) {
  if (column_selectors.length === 0) return [];

  // JSONPATH: https://goessner.net/articles/JsonPath/
  const wrap = false;
  let objects = JSONPath({ path: rows_selector || "", json: content, wrap });
  if (head) objects = objects.slice(0, 5);
  if (!objects) return [];
  let data = objects.map((json) => {
    const row = {};
    for (let column_selector of column_selectors) {
      if (column_selector === "FULL_ROW_OBJECT") {
        row[column_selector] = JSON.stringify(json, null, 2);
        continue;
      }
      row[column_selector] = JSONPath({ path: column_selector, json, wrap });
    }
    return row;
  });

  // Ask Bob what this does. Currently breaks on some JSON, but its probably a smart idea (because Bob)
  // data = reparseAsUTF8(data);

  return data;
}
