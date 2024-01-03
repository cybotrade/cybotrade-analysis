"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/has-flag@3.0.0";
exports.ids = ["vendor-chunks/has-flag@3.0.0"];
exports.modules = {

/***/ "(rsc)/../../node_modules/.pnpm/has-flag@3.0.0/node_modules/has-flag/index.js":
/*!******************************************************************************!*\
  !*** ../../node_modules/.pnpm/has-flag@3.0.0/node_modules/has-flag/index.js ***!
  \******************************************************************************/
/***/ ((module) => {

eval("\nmodule.exports = (flag, argv)=>{\n    argv = argv || process.argv;\n    const prefix = flag.startsWith(\"-\") ? \"\" : flag.length === 1 ? \"-\" : \"--\";\n    const pos = argv.indexOf(prefix + flag);\n    const terminatorPos = argv.indexOf(\"--\");\n    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2hhcy1mbGFnQDMuMC4wL25vZGVfbW9kdWxlcy9oYXMtZmxhZy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBQSxPQUFPQyxPQUFPLEdBQUcsQ0FBQ0MsTUFBTUM7SUFDdkJBLE9BQU9BLFFBQVFDLFFBQVFELElBQUk7SUFDM0IsTUFBTUUsU0FBU0gsS0FBS0ksVUFBVSxDQUFDLE9BQU8sS0FBTUosS0FBS0ssTUFBTSxLQUFLLElBQUksTUFBTTtJQUN0RSxNQUFNQyxNQUFNTCxLQUFLTSxPQUFPLENBQUNKLFNBQVNIO0lBQ2xDLE1BQU1RLGdCQUFnQlAsS0FBS00sT0FBTyxDQUFDO0lBQ25DLE9BQU9ELFFBQVEsQ0FBQyxLQUFNRSxDQUFBQSxrQkFBa0IsQ0FBQyxJQUFJLE9BQU9GLE1BQU1FLGFBQVk7QUFDdkUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWIvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2hhcy1mbGFnQDMuMC4wL25vZGVfbW9kdWxlcy9oYXMtZmxhZy9pbmRleC5qcz82YmFiIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gKGZsYWcsIGFyZ3YpID0+IHtcblx0YXJndiA9IGFyZ3YgfHwgcHJvY2Vzcy5hcmd2O1xuXHRjb25zdCBwcmVmaXggPSBmbGFnLnN0YXJ0c1dpdGgoJy0nKSA/ICcnIDogKGZsYWcubGVuZ3RoID09PSAxID8gJy0nIDogJy0tJyk7XG5cdGNvbnN0IHBvcyA9IGFyZ3YuaW5kZXhPZihwcmVmaXggKyBmbGFnKTtcblx0Y29uc3QgdGVybWluYXRvclBvcyA9IGFyZ3YuaW5kZXhPZignLS0nKTtcblx0cmV0dXJuIHBvcyAhPT0gLTEgJiYgKHRlcm1pbmF0b3JQb3MgPT09IC0xID8gdHJ1ZSA6IHBvcyA8IHRlcm1pbmF0b3JQb3MpO1xufTtcbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiZmxhZyIsImFyZ3YiLCJwcm9jZXNzIiwicHJlZml4Iiwic3RhcnRzV2l0aCIsImxlbmd0aCIsInBvcyIsImluZGV4T2YiLCJ0ZXJtaW5hdG9yUG9zIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/.pnpm/has-flag@3.0.0/node_modules/has-flag/index.js\n");

/***/ })

};
;