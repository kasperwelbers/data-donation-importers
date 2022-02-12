import parseHTML from "./parseHTML";
import parseJSON from "./parseJSON";

export default function parserPipeline(content, recipe, includeFull = false) {
  let data = [];
  if (!recipe?.columns) return [];

  const column_selectors = [];
  const column_names = {};
  console.log(recipe);
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
  console.log(column_selectors);

  if (includeFull) {
    column_selectors.push("FULL_ROW_OBJECT");
    column_names["FULL_ROW_OBJECT"] = ["FULL ROW OBJECT"];
  }

  try {
    let rows_selectors = Array.isArray(recipe.rows_selector)
      ? recipe.rows_selector
      : [recipe.rows_selector];
    if (rows_selectors.length === 0) rows_selectors = [null];
    for (let rows_selector of rows_selectors) {
      let rows_selector_data;
      if (recipe.filetype === "json")
        rows_selector_data = parseJSON(content.content, rows_selector, column_selectors);
      if (recipe.filetype === "html")
        rows_selector_data = parseHTML(content.content, rows_selector, column_selectors);

      for (let rawrow of rows_selector_data) {
        const row = {};
        for (let path of Object.keys(rawrow)) {
          for (let toColumn of column_names[path]) row[toColumn] = rawrow[path];
        }
        data.push(row);
      }
    }
    data = applyTransformations(data, recipe);
  } catch (e) {
    console.log(e);
    data = null;
  }

  return data;
}

const applyTransformations = (data, recipe) => {
  if (!recipe?.parser?.transform) return data;

  // for (let t of recipe.parser.transform) {
  //   let name, transform, func, column;
  //   [name, transform] = t.split(/=(.+)/).map((parts) => parts.trim());
  //   const hasfunction = /^[a-zA-Z]+\(.+\)$/.test(transform);
  //   // if (hasfunction) {
  //   //   [func, column] =
  //   // }
  //   console.log(name, transform);
  // }
  // console.log(data, recipe);
  return data;
};

// const transformFunctions = {
//   date: (value) => new Date(value),
//   epochDate: (value) => new Date(Math.round(value / 1000)),
// };

// YAML structure

// transform:
//     - input:      time
//       rename:     date
//       function:   int_to_date
//       epoch:      1970-01-01
//       unit:       miliseconds

//     - input:      date
//       rename:     Date
//       descrip:   High Heeled "Ruby" Slippers
//       size:      8
//       price:     133.7
//       quantity:  1

// OR THIS JSON
// {
//   "transform": [
//     {
//       "input": "time",
//       "rename": "date",
//       "int_to_date": null,
//       "string_to_date": {
//         "format": "%y-%m-%d"
//       }
//     }
//   ]
// }
//
// FOR THIS YAML
// transform:
// - input: time
//   rename: date
//   int_to_date:
//   string_to_date:
//     format: "%y-%m-%d"
