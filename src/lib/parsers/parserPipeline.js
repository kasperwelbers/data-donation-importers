import parseJSON from "./parseJSON";

export default function parserPipeline(content, recipe) {
  let data = [];
  if (!recipe?.columns) return [];

  const paths = [];
  const pathToName = {};
  for (let column of recipe.columns) {
    if (column.name === "" || column.paths.length === 0) continue;
    for (let addPath of column.paths) {
      if (!paths.includes(addPath)) paths.push(addPath);
      if (!pathToName[addPath]) pathToName[addPath] = [];
      pathToName[addPath].push(column.name);
    }
  }

  try {
    //let key = recipe.parser.key
    //let paths = recipe.parser.paths.reduce((arr, column)).

    const base_paths = recipe.base_paths.length === 0 ? [null] : recipe.base_paths;
    for (let base_path of base_paths) {
      let base_path_data;
      if (recipe.filetype === "json") base_path_data = parseJSON(content.content, base_path, paths);
      for (let rawrow of base_path_data) {
        const row = {};
        for (let path of Object.keys(rawrow)) {
          for (let toColumn of pathToName[path]) row[toColumn] = rawrow[path];
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
