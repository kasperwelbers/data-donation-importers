const google_takeout_browsing_history = {
  name: "Google Takeout Browsing History",
  files: ["BrowserHistory.json"],
  parser: {
    filetype: "json",
    key: "Browser History",
    paths: ["page_transition", "title", "url", "client_id", "time_usec"],
  },
};

const google_takeout_youtube_history_json = {
  name: "Google Takeout Youtube History (json)",
  files: ["watch-history.json"],
  parser: {
    filetype: "json",
    key: "",
    paths: ["header", "title", "titleUrl", "subtitles.name", "subtitles.url", "time"],
  },
};

const new_recipe = {
  name: "New recipe",
  allowedFiles: [],
  parser: { filetype: "json" },
};

export const recipes = {
  google_takeout_youtube_history_json,
  google_takeout_browsing_history,
  new_recipe,
};
