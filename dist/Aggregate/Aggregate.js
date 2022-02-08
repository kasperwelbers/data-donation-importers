"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Aggregate;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {class}  amcat  An Amcat connection class, as obtained with amcat4auth
 * @param {string} index The name of an index
 * @param {object} query An object with query components (q, params, filter)
 */
function Aggregate(_ref) {
  let {
    amcat,
    index,
    query
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("pre", null, "Aggregate");
}