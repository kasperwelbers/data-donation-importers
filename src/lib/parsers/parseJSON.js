//import { reparseAsUTF8 } from "./reparseAsUTF8";

export default function parseJSON(content, recipe) {
  const parser = recipe.parser;
  if (!parser?.paths || parser.paths.length === 0) return null;

  let data = fileReader(parser.paths, content, null, parser.key);

  // Ask Bob what this does. Currently breaks on some JSON, but its probably a smart idea (because Bob)
  // data = reparseAsUTF8(data);

  return data;
}

// fileReader selects the starting point for recursive parsing
// for each object in the file and returns the resulting objects.
const fileReader = function (paths, objects, prepath, in_key) {
  // in case the data is nested in an object
  // rather than an array
  if (in_key) {
    // If this is a nested key (using '.' notation, e.g. "level1key.level2key")
    if (in_key.search("\\.") > 0) {
      let key_array = in_key.split(".");
      in_key = key_array.shift(1);
      let next_key = key_array.join(".");

      // if there is already a prepath
      if (typeof prepath !== undefined || prepath !== null) {
        return fileReader(paths, objects[in_key], prepath + "." + in_key, next_key);
      }
      return fileReader(paths, objects[in_key], in_key, next_key);
    }
    return fileReader(paths, objects[in_key], prepath);
  }

  if (Array.isArray(objects)) {
    // in case the contents is just one array of values,
    // instead of an array of objects
    if (paths.length === 0) {
      let entries = [];
      let i = 0;
      while (i < objects.length) {
        entries.push({
          index: i,
          value: objects[i],
        });
        i++;
      }
      return entries;
    } else {
      // extract the whitelisted paths from all objects
      // in the array contained in the file
      return objects.map((obj) => objReader(paths, obj));
    }
  }

  // If the objects is actually one object (not an array)
  return [objReader(paths, objects)];
};

// objReader recursively parses JSON objects to extract
// the whitelisted fields and returns a flattened representation.
const objReader = function (spec, o, prev) {
  let flat_obj = {};

  let options = spec.map((p) => p.split(".").shift(1));

  // if the object is the endpoint of a spec,
  if (Array.isArray(spec) && spec.length === 1 && spec[0] === "") {
    return o;
  }

  for (let k of Object.keys(o)) {
    if (options.filter((o) => o === k).length === 0) {
      continue;
    }

    let newkey = [prev, k].filter((e) => typeof e != "undefined").join(".");

    let val = o[k];
    let sub_spec = spec
      .filter((s) => s.startsWith(k))
      .map((s) => s.substring(k.length + 1, s.length));

    if (Array.isArray(val)) {
      flat_obj[newkey] = val.map((c) => objReader(sub_spec, c));
      continue;
    }

    if (typeof val == "object" && val != null) {
      flat_obj = Object.assign(flat_obj, objReader(sub_spec, val, k));

      continue;
    }

    flat_obj[k] = val;
  }

  return flat_obj;
};
