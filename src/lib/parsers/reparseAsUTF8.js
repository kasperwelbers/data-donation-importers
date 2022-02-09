// reparseAsUTF8 stringifies an object, parses the string as UTF8
// and returns the JSON parsed result. This removes issues with
// UTF-8 donations, that JS assumes are UTF-16.
export const reparseAsUTF8 = function (object) {
  // drawn from https://stackoverflow.com/questions/52747566/what-encoding-facebook-uses-in-json-files-from-data-export
  function decode(s) {
    let d = new TextDecoder();
    let a = s.split("").map((r) => r.charCodeAt());
    return d.decode(new Uint8Array(a));
  }

  let stringObj = JSON.stringify(object);
  let decodedString = decode(stringObj);
  return JSON.parse(decodedString);
};
