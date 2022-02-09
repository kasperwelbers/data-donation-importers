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
