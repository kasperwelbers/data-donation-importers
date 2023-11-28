import parseHTML from "./parseHTML";
import parseJSON from "./parseJSON";
import parseCSV from "./parseCSV";
import standardizeRecipe from "../recipes/standardizeRecipe";

export default function parserPipeline(content, recipe, head = false) {
  recipe = standardizeRecipe(recipe);
  let data = [];
  if (!recipe?.columns) return [];

  const column_selectors = [];
  const column_names = {};
  for (let column of recipe.columns) {
    const column_selector_array = Array.isArray(column.selector)
      ? column.selector
      : [column.selector];
    if (column.name === "" || column_selector_array.length === 0) continue;
    for (let addColumnSelector of column_selector_array) {
      if (!column_selectors.includes(addColumnSelector)) column_selectors.push(addColumnSelector);
      if (!column_names[addColumnSelector]) column_names[addColumnSelector] = [];
      column_names[addColumnSelector].push(column.name);
    }
  }

  if (recipe.raw_row_data) {
    column_selectors.push("FULL_ROW_OBJECT");
    column_names["FULL_ROW_OBJECT"] = ["_RAW_DATA"];
  }

  try {
    let rows_selectors = Array.isArray(recipe.rows_selector)
      ? recipe.rows_selector
      : [recipe.rows_selector];
    if (rows_selectors.length === 0) rows_selectors = [null];
    for (let rows_selector of rows_selectors) {
      let rows_selector_data;
      if (recipe.filetype === "json")
        rows_selector_data = parseJSON(content.content, rows_selector, column_selectors, head);
      if (recipe.filetype === "html")
        rows_selector_data = parseHTML(content.content, rows_selector, column_selectors, head);
      if (recipe.filetype === "csv")
        rows_selector_data = parseCSV(content.content, rows_selector, column_selectors, head);

      for (let rawrow of rows_selector_data) {
        const row = {};
        for (let path of Object.keys(rawrow)) {
          for (let toColumn of column_names[path]) {
            // if already has value, dont' overwrite
            // this also prevents overwriting with an empty match (in case of aliases)
            if (row[toColumn]) continue;
            row[toColumn] = rawrow[path];
          }
        }
        data.push(row);
      }
    }
  } catch (e) {
    console.log(e);
    data = null;
  }

  return data;
}
