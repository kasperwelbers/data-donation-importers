import Papa from "papaparse";

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

  async parse(filetype) {
    let content = null;
    try {
      const text = await this.read();
      if (filetype === "json") content = JSON.parse(text);
      if (filetype === "html") content = new DOMParser().parseFromString(text, "text/html");
      if (filetype === "csv") content = Papa.parse(text, { header: true }).data;
    } catch (e) {
      console.log(this.name, e);
    }

    if (content === null) {
      return { content, filetype, message: `Failed to parse file as ${filetype}` };
    } else {
      return { content, filetype, message: `parsed file as ${filetype}` };
    }
  }
}
