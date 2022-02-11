//import { reparseAsUTF8 } from "./reparseAsUTF8";

export default function parseJSON(content, base_path, paths) {
  if (paths.length === 0) return [];

  let objects = findBasePath(content, null, base_path);
  let data = findPaths(paths, objects);

  // Ask Bob what this does. Currently breaks on some JSON, but its probably a smart idea (because Bob)
  // data = reparseAsUTF8(data);

  return data;
}

export const findBasePath = function (objects, prepath, in_key) {
  if (in_key) {
    // If this is a nested key (using '.' notation, e.g. "level1key.level2key")
    if (/(?<!\\)\./.test(in_key)) {
      // check of non-escaped dot
      let [current_key, next_key] = in_key.split(/(?<!\\)\.(.+)/);

      // if there is already a prepath
      if (typeof prepath !== undefined || prepath !== null) {
        return findBasePath(objects[current_key], prepath + "." + current_key, next_key);
      }
      return findBasePath(objects[current_key], current_key, next_key);
    }
    return findBasePath(objects[in_key], prepath);
  }
  return objects;
};

// findBasePath selects the starting point for recursive parsing
// for each object in the file and returns the resulting objects.
const findPaths = function (paths, objects) {
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
const objReader = function (spec, o, parentKey) {
  let flat_obj = {};

  // if the object is the endpoint of a spec,
  if (!spec) return o;

  for (let option of spec) {
    let key, childKeys, index;
    // split on first non-escaped dot to separate key and child keys
    [key, childKeys] = option.split(/(?<!\\)\.(.+)/);

    // split on first non-escaped left square bracket, to separate key from index
    [key, index] = key.split(/(?<!\\)\[(.+)/);
    index = index ? Number(index.replace("]", "")) : null;

    //[key, index] = option.split();

    let val = o[key];
    if (val && index !== null) val = val[index];
    if (!val) continue;

    let newkey = key;
    if (parentKey) newkey = parentKey + "." + newkey;
    if (index !== null) newkey = newkey + `[${index}]`;

    const childOptions = childKeys ? [childKeys] : null;

    if (Array.isArray(val)) {
      if (childKeys) newkey = newkey + "." + childKeys;
      const resultsArray = val.map((c) => objReader(childOptions, c));
      flat_obj[newkey] = resultsArray;
      continue;
    }

    if (typeof val == "object" && val != null) {
      flat_obj = Object.assign(flat_obj, objReader(childOptions, val, newkey));
      continue;
    }

    if (childKeys) continue;

    flat_obj[newkey] = val;
  }

  return flat_obj;
};
