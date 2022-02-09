export default class File {
  constructor(name, path, blob, zipped = null) {
    this.name = name;
    this.path = path;
    this.blob = blob;
    this.zipped = zipped;
  }

  read() {
    // If file is zipped, we have included the JSZip zipped object,
    // which lets us unzip the file given the path
    if (this.zipped) {
      return this.zipped.file(this.path).async("text");
    }

    // If file is not zipped, use FileReader API, but return as promise
    // for consistency
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsText(this.blob);
    });
  }
}
