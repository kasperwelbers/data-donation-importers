import parseJSON from "./parseJSON";

export default function parserPipeline(content, recipe) {
  let data;
  try {
    if (content?.parser === "json") data = parseJSON(content.content, recipe);

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
