"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

const STOPWORDS = ["and", "or", "not", "the", "it", "de", "het", "een"]; // etc

const STOPWORDS_LOOKUP = STOPWORDS.reduce((obj, sw) => {
  obj[sw] = true;
  return obj;
}, {});
/**
 * Quick and dirty word tokenization, with very basic stopword filtering
 * Probably should replace this with a proper lightweight NLP package
 * @param {string} text The text to tokenize
 * @returns An array of the (filtered) tokens
 */

const tokenize = text => {
  return text.split(/\W+/).filter(token => {
    token = token.toLowerCase();
    if (token.length <= 1) return false; // also drop single chars and empty

    if (STOPWORDS_LOOKUP[token]) return false;
    return true;
  });
};

var _default = tokenize;
exports.default = _default;