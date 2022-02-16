const google_takeout_browsing_history = {
  name: "Google Takeout Browsing History",
  file: ["BrowserHistory.json", "BrausingHistörie.jsön"],
  filetype: "json",
  rows_selector: "Browser History",
  columns: [
    { name: "title", selector: "title" },
    { name: "url", selector: "url" },
    { name: "time", selector: "time_usec" },
    { name: "transition", selector: "page_transition" },
  ],
  transformers: [
    {
      transformer: "int_to_date",
      column: "time",
      new_column: "date",
      arguments: { unit: "microsecond" },
    },
  ],
};

const google_takeout_youtube_history_json = {
  name: "Google Takeout Youtube History (json)",
  file: ["watch-history.json", "kijkgeschiedenis.json"],
  filetype: "json",
  rows_selector: "$.",
  columns: [
    { name: "title", selector: "title" },
    { name: "title_url", selector: "titleUrl" },
    { name: "channel", selector: "subtitles[0].name" },
    { name: "channel_url", selector: "subtitles[0].url" },
    { name: "raw_date", selector: "time" },
  ],
  transformers: [
    { column: "raw_date", transformer: "replace", arguments: { regex: "watched " } },
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: {},
    },
  ],
};

const google_takeout_youtube_history_html = {
  name: "Google Takeout Youtube History (html)",
  file: ["watch-history.html", "kijkgeschiedenis.html"],
  filetype: "html",
  rows_selector: ".mdl-grid > .outer-cell",
  columns: [
    { name: "title", selector: "a" },
    { name: "title_url", selector: "a @href" },
    { name: "channel", selector: "a:nth-of-type(2)" },
    { name: "channel_url", selector: "a:nth-of-type(2) @href" },
    { name: "raw_date", selector: ".content-cell @TEXT" },
  ],
  transformers: [
    { transformer: "replace", column: "raw_date", arguments: { regex: "watched " } },
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: { format: ["D MMM YYYY, hh:mm:ss"] },
    },
  ],
};

export const recipes = {
  google_takeout_youtube_history_json,
  google_takeout_youtube_history_html,
  google_takeout_browsing_history,
};
