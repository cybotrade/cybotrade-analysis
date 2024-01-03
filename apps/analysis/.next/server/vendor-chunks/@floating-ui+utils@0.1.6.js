"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@floating-ui+utils@0.1.6";
exports.ids = ["vendor-chunks/@floating-ui+utils@0.1.6"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs":
/*!********************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   alignments: () => (/* binding */ alignments),\n/* harmony export */   clamp: () => (/* binding */ clamp),\n/* harmony export */   createCoords: () => (/* binding */ createCoords),\n/* harmony export */   evaluate: () => (/* binding */ evaluate),\n/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),\n/* harmony export */   floor: () => (/* binding */ floor),\n/* harmony export */   getAlignment: () => (/* binding */ getAlignment),\n/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),\n/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),\n/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),\n/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),\n/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),\n/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),\n/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),\n/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),\n/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),\n/* harmony export */   getSide: () => (/* binding */ getSide),\n/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),\n/* harmony export */   max: () => (/* binding */ max),\n/* harmony export */   min: () => (/* binding */ min),\n/* harmony export */   placements: () => (/* binding */ placements),\n/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),\n/* harmony export */   round: () => (/* binding */ round),\n/* harmony export */   sides: () => (/* binding */ sides)\n/* harmony export */ });\nconst sides = [\n    \"top\",\n    \"right\",\n    \"bottom\",\n    \"left\"\n];\nconst alignments = [\n    \"start\",\n    \"end\"\n];\nconst placements = /*#__PURE__*/ sides.reduce((acc, side)=>acc.concat(side, side + \"-\" + alignments[0], side + \"-\" + alignments[1]), []);\nconst min = Math.min;\nconst max = Math.max;\nconst round = Math.round;\nconst floor = Math.floor;\nconst createCoords = (v)=>({\n        x: v,\n        y: v\n    });\nconst oppositeSideMap = {\n    left: \"right\",\n    right: \"left\",\n    bottom: \"top\",\n    top: \"bottom\"\n};\nconst oppositeAlignmentMap = {\n    start: \"end\",\n    end: \"start\"\n};\nfunction clamp(start, value, end) {\n    return max(start, min(value, end));\n}\nfunction evaluate(value, param) {\n    return typeof value === \"function\" ? value(param) : value;\n}\nfunction getSide(placement) {\n    return placement.split(\"-\")[0];\n}\nfunction getAlignment(placement) {\n    return placement.split(\"-\")[1];\n}\nfunction getOppositeAxis(axis) {\n    return axis === \"x\" ? \"y\" : \"x\";\n}\nfunction getAxisLength(axis) {\n    return axis === \"y\" ? \"height\" : \"width\";\n}\nfunction getSideAxis(placement) {\n    return [\n        \"top\",\n        \"bottom\"\n    ].includes(getSide(placement)) ? \"y\" : \"x\";\n}\nfunction getAlignmentAxis(placement) {\n    return getOppositeAxis(getSideAxis(placement));\n}\nfunction getAlignmentSides(placement, rects, rtl) {\n    if (rtl === void 0) {\n        rtl = false;\n    }\n    const alignment = getAlignment(placement);\n    const alignmentAxis = getAlignmentAxis(placement);\n    const length = getAxisLength(alignmentAxis);\n    let mainAlignmentSide = alignmentAxis === \"x\" ? alignment === (rtl ? \"end\" : \"start\") ? \"right\" : \"left\" : alignment === \"start\" ? \"bottom\" : \"top\";\n    if (rects.reference[length] > rects.floating[length]) {\n        mainAlignmentSide = getOppositePlacement(mainAlignmentSide);\n    }\n    return [\n        mainAlignmentSide,\n        getOppositePlacement(mainAlignmentSide)\n    ];\n}\nfunction getExpandedPlacements(placement) {\n    const oppositePlacement = getOppositePlacement(placement);\n    return [\n        getOppositeAlignmentPlacement(placement),\n        oppositePlacement,\n        getOppositeAlignmentPlacement(oppositePlacement)\n    ];\n}\nfunction getOppositeAlignmentPlacement(placement) {\n    return placement.replace(/start|end/g, (alignment)=>oppositeAlignmentMap[alignment]);\n}\nfunction getSideList(side, isStart, rtl) {\n    const lr = [\n        \"left\",\n        \"right\"\n    ];\n    const rl = [\n        \"right\",\n        \"left\"\n    ];\n    const tb = [\n        \"top\",\n        \"bottom\"\n    ];\n    const bt = [\n        \"bottom\",\n        \"top\"\n    ];\n    switch(side){\n        case \"top\":\n        case \"bottom\":\n            if (rtl) return isStart ? rl : lr;\n            return isStart ? lr : rl;\n        case \"left\":\n        case \"right\":\n            return isStart ? tb : bt;\n        default:\n            return [];\n    }\n}\nfunction getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {\n    const alignment = getAlignment(placement);\n    let list = getSideList(getSide(placement), direction === \"start\", rtl);\n    if (alignment) {\n        list = list.map((side)=>side + \"-\" + alignment);\n        if (flipAlignment) {\n            list = list.concat(list.map(getOppositeAlignmentPlacement));\n        }\n    }\n    return list;\n}\nfunction getOppositePlacement(placement) {\n    return placement.replace(/left|right|bottom|top/g, (side)=>oppositeSideMap[side]);\n}\nfunction expandPaddingObject(padding) {\n    return {\n        top: 0,\n        right: 0,\n        bottom: 0,\n        left: 0,\n        ...padding\n    };\n}\nfunction getPaddingObject(padding) {\n    return typeof padding !== \"number\" ? expandPaddingObject(padding) : {\n        top: padding,\n        right: padding,\n        bottom: padding,\n        left: padding\n    };\n}\nfunction rectToClientRect(rect) {\n    return {\n        ...rect,\n        top: rect.y,\n        left: rect.x,\n        right: rect.x + rect.width,\n        bottom: rect.y + rect.height\n    };\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BmbG9hdGluZy11aSt1dGlsc0AwLjEuNi9ub2RlX21vZHVsZXMvQGZsb2F0aW5nLXVpL3V0aWxzL2Rpc3QvZmxvYXRpbmctdWkudXRpbHMubWpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU1BLFFBQVE7SUFBQztJQUFPO0lBQVM7SUFBVTtDQUFPO0FBQ2hELE1BQU1DLGFBQWE7SUFBQztJQUFTO0NBQU07QUFDbkMsTUFBTUMsYUFBYSxXQUFXLEdBQUVGLE1BQU1HLE1BQU0sQ0FBQyxDQUFDQyxLQUFLQyxPQUFTRCxJQUFJRSxNQUFNLENBQUNELE1BQU1BLE9BQU8sTUFBTUosVUFBVSxDQUFDLEVBQUUsRUFBRUksT0FBTyxNQUFNSixVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDeEksTUFBTU0sTUFBTUMsS0FBS0QsR0FBRztBQUNwQixNQUFNRSxNQUFNRCxLQUFLQyxHQUFHO0FBQ3BCLE1BQU1DLFFBQVFGLEtBQUtFLEtBQUs7QUFDeEIsTUFBTUMsUUFBUUgsS0FBS0csS0FBSztBQUN4QixNQUFNQyxlQUFlQyxDQUFBQSxJQUFNO1FBQ3pCQyxHQUFHRDtRQUNIRSxHQUFHRjtJQUNMO0FBQ0EsTUFBTUcsa0JBQWtCO0lBQ3RCQyxNQUFNO0lBQ05DLE9BQU87SUFDUEMsUUFBUTtJQUNSQyxLQUFLO0FBQ1A7QUFDQSxNQUFNQyx1QkFBdUI7SUFDM0JDLE9BQU87SUFDUEMsS0FBSztBQUNQO0FBQ0EsU0FBU0MsTUFBTUYsS0FBSyxFQUFFRyxLQUFLLEVBQUVGLEdBQUc7SUFDOUIsT0FBT2QsSUFBSWEsT0FBT2YsSUFBSWtCLE9BQU9GO0FBQy9CO0FBQ0EsU0FBU0csU0FBU0QsS0FBSyxFQUFFRSxLQUFLO0lBQzVCLE9BQU8sT0FBT0YsVUFBVSxhQUFhQSxNQUFNRSxTQUFTRjtBQUN0RDtBQUNBLFNBQVNHLFFBQVFDLFNBQVM7SUFDeEIsT0FBT0EsVUFBVUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2hDO0FBQ0EsU0FBU0MsYUFBYUYsU0FBUztJQUM3QixPQUFPQSxVQUFVQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDaEM7QUFDQSxTQUFTRSxnQkFBZ0JDLElBQUk7SUFDM0IsT0FBT0EsU0FBUyxNQUFNLE1BQU07QUFDOUI7QUFDQSxTQUFTQyxjQUFjRCxJQUFJO0lBQ3pCLE9BQU9BLFNBQVMsTUFBTSxXQUFXO0FBQ25DO0FBQ0EsU0FBU0UsWUFBWU4sU0FBUztJQUM1QixPQUFPO1FBQUM7UUFBTztLQUFTLENBQUNPLFFBQVEsQ0FBQ1IsUUFBUUMsY0FBYyxNQUFNO0FBQ2hFO0FBQ0EsU0FBU1EsaUJBQWlCUixTQUFTO0lBQ2pDLE9BQU9HLGdCQUFnQkcsWUFBWU47QUFDckM7QUFDQSxTQUFTUyxrQkFBa0JULFNBQVMsRUFBRVUsS0FBSyxFQUFFQyxHQUFHO0lBQzlDLElBQUlBLFFBQVEsS0FBSyxHQUFHO1FBQ2xCQSxNQUFNO0lBQ1I7SUFDQSxNQUFNQyxZQUFZVixhQUFhRjtJQUMvQixNQUFNYSxnQkFBZ0JMLGlCQUFpQlI7SUFDdkMsTUFBTWMsU0FBU1QsY0FBY1E7SUFDN0IsSUFBSUUsb0JBQW9CRixrQkFBa0IsTUFBTUQsY0FBZUQsQ0FBQUEsTUFBTSxRQUFRLE9BQU0sSUFBSyxVQUFVLFNBQVNDLGNBQWMsVUFBVSxXQUFXO0lBQzlJLElBQUlGLE1BQU1NLFNBQVMsQ0FBQ0YsT0FBTyxHQUFHSixNQUFNTyxRQUFRLENBQUNILE9BQU8sRUFBRTtRQUNwREMsb0JBQW9CRyxxQkFBcUJIO0lBQzNDO0lBQ0EsT0FBTztRQUFDQTtRQUFtQkcscUJBQXFCSDtLQUFtQjtBQUNyRTtBQUNBLFNBQVNJLHNCQUFzQm5CLFNBQVM7SUFDdEMsTUFBTW9CLG9CQUFvQkYscUJBQXFCbEI7SUFDL0MsT0FBTztRQUFDcUIsOEJBQThCckI7UUFBWW9CO1FBQW1CQyw4QkFBOEJEO0tBQW1CO0FBQ3hIO0FBQ0EsU0FBU0MsOEJBQThCckIsU0FBUztJQUM5QyxPQUFPQSxVQUFVc0IsT0FBTyxDQUFDLGNBQWNWLENBQUFBLFlBQWFwQixvQkFBb0IsQ0FBQ29CLFVBQVU7QUFDckY7QUFDQSxTQUFTVyxZQUFZL0MsSUFBSSxFQUFFZ0QsT0FBTyxFQUFFYixHQUFHO0lBQ3JDLE1BQU1jLEtBQUs7UUFBQztRQUFRO0tBQVE7SUFDNUIsTUFBTUMsS0FBSztRQUFDO1FBQVM7S0FBTztJQUM1QixNQUFNQyxLQUFLO1FBQUM7UUFBTztLQUFTO0lBQzVCLE1BQU1DLEtBQUs7UUFBQztRQUFVO0tBQU07SUFDNUIsT0FBUXBEO1FBQ04sS0FBSztRQUNMLEtBQUs7WUFDSCxJQUFJbUMsS0FBSyxPQUFPYSxVQUFVRSxLQUFLRDtZQUMvQixPQUFPRCxVQUFVQyxLQUFLQztRQUN4QixLQUFLO1FBQ0wsS0FBSztZQUNILE9BQU9GLFVBQVVHLEtBQUtDO1FBQ3hCO1lBQ0UsT0FBTyxFQUFFO0lBQ2I7QUFDRjtBQUNBLFNBQVNDLDBCQUEwQjdCLFNBQVMsRUFBRThCLGFBQWEsRUFBRUMsU0FBUyxFQUFFcEIsR0FBRztJQUN6RSxNQUFNQyxZQUFZVixhQUFhRjtJQUMvQixJQUFJZ0MsT0FBT1QsWUFBWXhCLFFBQVFDLFlBQVkrQixjQUFjLFNBQVNwQjtJQUNsRSxJQUFJQyxXQUFXO1FBQ2JvQixPQUFPQSxLQUFLQyxHQUFHLENBQUN6RCxDQUFBQSxPQUFRQSxPQUFPLE1BQU1vQztRQUNyQyxJQUFJa0IsZUFBZTtZQUNqQkUsT0FBT0EsS0FBS3ZELE1BQU0sQ0FBQ3VELEtBQUtDLEdBQUcsQ0FBQ1o7UUFDOUI7SUFDRjtJQUNBLE9BQU9XO0FBQ1Q7QUFDQSxTQUFTZCxxQkFBcUJsQixTQUFTO0lBQ3JDLE9BQU9BLFVBQVVzQixPQUFPLENBQUMsMEJBQTBCOUMsQ0FBQUEsT0FBUVcsZUFBZSxDQUFDWCxLQUFLO0FBQ2xGO0FBQ0EsU0FBUzBELG9CQUFvQkMsT0FBTztJQUNsQyxPQUFPO1FBQ0w1QyxLQUFLO1FBQ0xGLE9BQU87UUFDUEMsUUFBUTtRQUNSRixNQUFNO1FBQ04sR0FBRytDLE9BQU87SUFDWjtBQUNGO0FBQ0EsU0FBU0MsaUJBQWlCRCxPQUFPO0lBQy9CLE9BQU8sT0FBT0EsWUFBWSxXQUFXRCxvQkFBb0JDLFdBQVc7UUFDbEU1QyxLQUFLNEM7UUFDTDlDLE9BQU84QztRQUNQN0MsUUFBUTZDO1FBQ1IvQyxNQUFNK0M7SUFDUjtBQUNGO0FBQ0EsU0FBU0UsaUJBQWlCQyxJQUFJO0lBQzVCLE9BQU87UUFDTCxHQUFHQSxJQUFJO1FBQ1AvQyxLQUFLK0MsS0FBS3BELENBQUM7UUFDWEUsTUFBTWtELEtBQUtyRCxDQUFDO1FBQ1pJLE9BQU9pRCxLQUFLckQsQ0FBQyxHQUFHcUQsS0FBS0MsS0FBSztRQUMxQmpELFFBQVFnRCxLQUFLcEQsQ0FBQyxHQUFHb0QsS0FBS0UsTUFBTTtJQUM5QjtBQUNGO0FBRXlXIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmxvYXRpbmctdWkrdXRpbHNAMC4xLjYvbm9kZV9tb2R1bGVzL0BmbG9hdGluZy11aS91dGlscy9kaXN0L2Zsb2F0aW5nLXVpLnV0aWxzLm1qcz83NDFhIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNpZGVzID0gWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXTtcbmNvbnN0IGFsaWdubWVudHMgPSBbJ3N0YXJ0JywgJ2VuZCddO1xuY29uc3QgcGxhY2VtZW50cyA9IC8qI19fUFVSRV9fKi9zaWRlcy5yZWR1Y2UoKGFjYywgc2lkZSkgPT4gYWNjLmNvbmNhdChzaWRlLCBzaWRlICsgXCItXCIgKyBhbGlnbm1lbnRzWzBdLCBzaWRlICsgXCItXCIgKyBhbGlnbm1lbnRzWzFdKSwgW10pO1xuY29uc3QgbWluID0gTWF0aC5taW47XG5jb25zdCBtYXggPSBNYXRoLm1heDtcbmNvbnN0IHJvdW5kID0gTWF0aC5yb3VuZDtcbmNvbnN0IGZsb29yID0gTWF0aC5mbG9vcjtcbmNvbnN0IGNyZWF0ZUNvb3JkcyA9IHYgPT4gKHtcbiAgeDogdixcbiAgeTogdlxufSk7XG5jb25zdCBvcHBvc2l0ZVNpZGVNYXAgPSB7XG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCcsXG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbSdcbn07XG5jb25zdCBvcHBvc2l0ZUFsaWdubWVudE1hcCA9IHtcbiAgc3RhcnQ6ICdlbmQnLFxuICBlbmQ6ICdzdGFydCdcbn07XG5mdW5jdGlvbiBjbGFtcChzdGFydCwgdmFsdWUsIGVuZCkge1xuICByZXR1cm4gbWF4KHN0YXJ0LCBtaW4odmFsdWUsIGVuZCkpO1xufVxuZnVuY3Rpb24gZXZhbHVhdGUodmFsdWUsIHBhcmFtKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgPyB2YWx1ZShwYXJhbSkgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGdldFNpZGUocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbn1cbmZ1bmN0aW9uIGdldEFsaWdubWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzFdO1xufVxuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVBeGlzKGF4aXMpIHtcbiAgcmV0dXJuIGF4aXMgPT09ICd4JyA/ICd5JyA6ICd4Jztcbn1cbmZ1bmN0aW9uIGdldEF4aXNMZW5ndGgoYXhpcykge1xuICByZXR1cm4gYXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xufVxuZnVuY3Rpb24gZ2V0U2lkZUF4aXMocGxhY2VtZW50KSB7XG4gIHJldHVybiBbJ3RvcCcsICdib3R0b20nXS5pbmNsdWRlcyhnZXRTaWRlKHBsYWNlbWVudCkpID8gJ3knIDogJ3gnO1xufVxuZnVuY3Rpb24gZ2V0QWxpZ25tZW50QXhpcyhwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGdldE9wcG9zaXRlQXhpcyhnZXRTaWRlQXhpcyhwbGFjZW1lbnQpKTtcbn1cbmZ1bmN0aW9uIGdldEFsaWdubWVudFNpZGVzKHBsYWNlbWVudCwgcmVjdHMsIHJ0bCkge1xuICBpZiAocnRsID09PSB2b2lkIDApIHtcbiAgICBydGwgPSBmYWxzZTtcbiAgfVxuICBjb25zdCBhbGlnbm1lbnQgPSBnZXRBbGlnbm1lbnQocGxhY2VtZW50KTtcbiAgY29uc3QgYWxpZ25tZW50QXhpcyA9IGdldEFsaWdubWVudEF4aXMocGxhY2VtZW50KTtcbiAgY29uc3QgbGVuZ3RoID0gZ2V0QXhpc0xlbmd0aChhbGlnbm1lbnRBeGlzKTtcbiAgbGV0IG1haW5BbGlnbm1lbnRTaWRlID0gYWxpZ25tZW50QXhpcyA9PT0gJ3gnID8gYWxpZ25tZW50ID09PSAocnRsID8gJ2VuZCcgOiAnc3RhcnQnKSA/ICdyaWdodCcgOiAnbGVmdCcgOiBhbGlnbm1lbnQgPT09ICdzdGFydCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICBpZiAocmVjdHMucmVmZXJlbmNlW2xlbmd0aF0gPiByZWN0cy5mbG9hdGluZ1tsZW5ndGhdKSB7XG4gICAgbWFpbkFsaWdubWVudFNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluQWxpZ25tZW50U2lkZSk7XG4gIH1cbiAgcmV0dXJuIFttYWluQWxpZ25tZW50U2lkZSwgZ2V0T3Bwb3NpdGVQbGFjZW1lbnQobWFpbkFsaWdubWVudFNpZGUpXTtcbn1cbmZ1bmN0aW9uIGdldEV4cGFuZGVkUGxhY2VtZW50cyhwbGFjZW1lbnQpIHtcbiAgY29uc3Qgb3Bwb3NpdGVQbGFjZW1lbnQgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICByZXR1cm4gW2dldE9wcG9zaXRlQWxpZ25tZW50UGxhY2VtZW50KHBsYWNlbWVudCksIG9wcG9zaXRlUGxhY2VtZW50LCBnZXRPcHBvc2l0ZUFsaWdubWVudFBsYWNlbWVudChvcHBvc2l0ZVBsYWNlbWVudCldO1xufVxuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvc3RhcnR8ZW5kL2csIGFsaWdubWVudCA9PiBvcHBvc2l0ZUFsaWdubWVudE1hcFthbGlnbm1lbnRdKTtcbn1cbmZ1bmN0aW9uIGdldFNpZGVMaXN0KHNpZGUsIGlzU3RhcnQsIHJ0bCkge1xuICBjb25zdCBsciA9IFsnbGVmdCcsICdyaWdodCddO1xuICBjb25zdCBybCA9IFsncmlnaHQnLCAnbGVmdCddO1xuICBjb25zdCB0YiA9IFsndG9wJywgJ2JvdHRvbSddO1xuICBjb25zdCBidCA9IFsnYm90dG9tJywgJ3RvcCddO1xuICBzd2l0Y2ggKHNpZGUpIHtcbiAgICBjYXNlICd0b3AnOlxuICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICBpZiAocnRsKSByZXR1cm4gaXNTdGFydCA/IHJsIDogbHI7XG4gICAgICByZXR1cm4gaXNTdGFydCA/IGxyIDogcmw7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgY2FzZSAncmlnaHQnOlxuICAgICAgcmV0dXJuIGlzU3RhcnQgPyB0YiA6IGJ0O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gW107XG4gIH1cbn1cbmZ1bmN0aW9uIGdldE9wcG9zaXRlQXhpc1BsYWNlbWVudHMocGxhY2VtZW50LCBmbGlwQWxpZ25tZW50LCBkaXJlY3Rpb24sIHJ0bCkge1xuICBjb25zdCBhbGlnbm1lbnQgPSBnZXRBbGlnbm1lbnQocGxhY2VtZW50KTtcbiAgbGV0IGxpc3QgPSBnZXRTaWRlTGlzdChnZXRTaWRlKHBsYWNlbWVudCksIGRpcmVjdGlvbiA9PT0gJ3N0YXJ0JywgcnRsKTtcbiAgaWYgKGFsaWdubWVudCkge1xuICAgIGxpc3QgPSBsaXN0Lm1hcChzaWRlID0+IHNpZGUgKyBcIi1cIiArIGFsaWdubWVudCk7XG4gICAgaWYgKGZsaXBBbGlnbm1lbnQpIHtcbiAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdChsaXN0Lm1hcChnZXRPcHBvc2l0ZUFsaWdubWVudFBsYWNlbWVudCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdDtcbn1cbmZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBzaWRlID0+IG9wcG9zaXRlU2lkZU1hcFtzaWRlXSk7XG59XG5mdW5jdGlvbiBleHBhbmRQYWRkaW5nT2JqZWN0KHBhZGRpbmcpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgLi4ucGFkZGluZ1xuICB9O1xufVxuZnVuY3Rpb24gZ2V0UGFkZGluZ09iamVjdChwYWRkaW5nKSB7XG4gIHJldHVybiB0eXBlb2YgcGFkZGluZyAhPT0gJ251bWJlcicgPyBleHBhbmRQYWRkaW5nT2JqZWN0KHBhZGRpbmcpIDoge1xuICAgIHRvcDogcGFkZGluZyxcbiAgICByaWdodDogcGFkZGluZyxcbiAgICBib3R0b206IHBhZGRpbmcsXG4gICAgbGVmdDogcGFkZGluZ1xuICB9O1xufVxuZnVuY3Rpb24gcmVjdFRvQ2xpZW50UmVjdChyZWN0KSB7XG4gIHJldHVybiB7XG4gICAgLi4ucmVjdCxcbiAgICB0b3A6IHJlY3QueSxcbiAgICBsZWZ0OiByZWN0LngsXG4gICAgcmlnaHQ6IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICB9O1xufVxuXG5leHBvcnQgeyBhbGlnbm1lbnRzLCBjbGFtcCwgY3JlYXRlQ29vcmRzLCBldmFsdWF0ZSwgZXhwYW5kUGFkZGluZ09iamVjdCwgZmxvb3IsIGdldEFsaWdubWVudCwgZ2V0QWxpZ25tZW50QXhpcywgZ2V0QWxpZ25tZW50U2lkZXMsIGdldEF4aXNMZW5ndGgsIGdldEV4cGFuZGVkUGxhY2VtZW50cywgZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQsIGdldE9wcG9zaXRlQXhpcywgZ2V0T3Bwb3NpdGVBeGlzUGxhY2VtZW50cywgZ2V0T3Bwb3NpdGVQbGFjZW1lbnQsIGdldFBhZGRpbmdPYmplY3QsIGdldFNpZGUsIGdldFNpZGVBeGlzLCBtYXgsIG1pbiwgcGxhY2VtZW50cywgcmVjdFRvQ2xpZW50UmVjdCwgcm91bmQsIHNpZGVzIH07XG4iXSwibmFtZXMiOlsic2lkZXMiLCJhbGlnbm1lbnRzIiwicGxhY2VtZW50cyIsInJlZHVjZSIsImFjYyIsInNpZGUiLCJjb25jYXQiLCJtaW4iLCJNYXRoIiwibWF4Iiwicm91bmQiLCJmbG9vciIsImNyZWF0ZUNvb3JkcyIsInYiLCJ4IiwieSIsIm9wcG9zaXRlU2lkZU1hcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInRvcCIsIm9wcG9zaXRlQWxpZ25tZW50TWFwIiwic3RhcnQiLCJlbmQiLCJjbGFtcCIsInZhbHVlIiwiZXZhbHVhdGUiLCJwYXJhbSIsImdldFNpZGUiLCJwbGFjZW1lbnQiLCJzcGxpdCIsImdldEFsaWdubWVudCIsImdldE9wcG9zaXRlQXhpcyIsImF4aXMiLCJnZXRBeGlzTGVuZ3RoIiwiZ2V0U2lkZUF4aXMiLCJpbmNsdWRlcyIsImdldEFsaWdubWVudEF4aXMiLCJnZXRBbGlnbm1lbnRTaWRlcyIsInJlY3RzIiwicnRsIiwiYWxpZ25tZW50IiwiYWxpZ25tZW50QXhpcyIsImxlbmd0aCIsIm1haW5BbGlnbm1lbnRTaWRlIiwicmVmZXJlbmNlIiwiZmxvYXRpbmciLCJnZXRPcHBvc2l0ZVBsYWNlbWVudCIsImdldEV4cGFuZGVkUGxhY2VtZW50cyIsIm9wcG9zaXRlUGxhY2VtZW50IiwiZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQiLCJyZXBsYWNlIiwiZ2V0U2lkZUxpc3QiLCJpc1N0YXJ0IiwibHIiLCJybCIsInRiIiwiYnQiLCJnZXRPcHBvc2l0ZUF4aXNQbGFjZW1lbnRzIiwiZmxpcEFsaWdubWVudCIsImRpcmVjdGlvbiIsImxpc3QiLCJtYXAiLCJleHBhbmRQYWRkaW5nT2JqZWN0IiwicGFkZGluZyIsImdldFBhZGRpbmdPYmplY3QiLCJyZWN0VG9DbGllbnRSZWN0IiwicmVjdCIsIndpZHRoIiwiaGVpZ2h0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs\n");

/***/ }),

/***/ "(ssr)/../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs":
/*!****************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),\n/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),\n/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),\n/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),\n/* harmony export */   getNodeName: () => (/* binding */ getNodeName),\n/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),\n/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),\n/* harmony export */   getParentNode: () => (/* binding */ getParentNode),\n/* harmony export */   getWindow: () => (/* binding */ getWindow),\n/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),\n/* harmony export */   isElement: () => (/* binding */ isElement),\n/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),\n/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),\n/* harmony export */   isNode: () => (/* binding */ isNode),\n/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),\n/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),\n/* harmony export */   isTableElement: () => (/* binding */ isTableElement),\n/* harmony export */   isWebKit: () => (/* binding */ isWebKit)\n/* harmony export */ });\nfunction getNodeName(node) {\n    if (isNode(node)) {\n        return (node.nodeName || \"\").toLowerCase();\n    }\n    // Mocked nodes in testing environments may not be instances of Node. By\n    // returning `#document` an infinite loop won't occur.\n    // https://github.com/floating-ui/floating-ui/issues/2317\n    return \"#document\";\n}\nfunction getWindow(node) {\n    var _node$ownerDocument;\n    return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;\n}\nfunction getDocumentElement(node) {\n    var _ref;\n    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;\n}\nfunction isNode(value) {\n    return value instanceof Node || value instanceof getWindow(value).Node;\n}\nfunction isElement(value) {\n    return value instanceof Element || value instanceof getWindow(value).Element;\n}\nfunction isHTMLElement(value) {\n    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;\n}\nfunction isShadowRoot(value) {\n    // Browsers without `ShadowRoot` support.\n    if (typeof ShadowRoot === \"undefined\") {\n        return false;\n    }\n    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;\n}\nfunction isOverflowElement(element) {\n    const { overflow, overflowX, overflowY, display } = getComputedStyle(element);\n    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && ![\n        \"inline\",\n        \"contents\"\n    ].includes(display);\n}\nfunction isTableElement(element) {\n    return [\n        \"table\",\n        \"td\",\n        \"th\"\n    ].includes(getNodeName(element));\n}\nfunction isContainingBlock(element) {\n    const webkit = isWebKit();\n    const css = getComputedStyle(element);\n    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block\n    return css.transform !== \"none\" || css.perspective !== \"none\" || (css.containerType ? css.containerType !== \"normal\" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== \"none\" : false) || !webkit && (css.filter ? css.filter !== \"none\" : false) || [\n        \"transform\",\n        \"perspective\",\n        \"filter\"\n    ].some((value)=>(css.willChange || \"\").includes(value)) || [\n        \"paint\",\n        \"layout\",\n        \"strict\",\n        \"content\"\n    ].some((value)=>(css.contain || \"\").includes(value));\n}\nfunction getContainingBlock(element) {\n    let currentNode = getParentNode(element);\n    while(isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)){\n        if (isContainingBlock(currentNode)) {\n            return currentNode;\n        } else {\n            currentNode = getParentNode(currentNode);\n        }\n    }\n    return null;\n}\nfunction isWebKit() {\n    if (typeof CSS === \"undefined\" || !CSS.supports) return false;\n    return CSS.supports(\"-webkit-backdrop-filter\", \"none\");\n}\nfunction isLastTraversableNode(node) {\n    return [\n        \"html\",\n        \"body\",\n        \"#document\"\n    ].includes(getNodeName(node));\n}\nfunction getComputedStyle(element) {\n    return getWindow(element).getComputedStyle(element);\n}\nfunction getNodeScroll(element) {\n    if (isElement(element)) {\n        return {\n            scrollLeft: element.scrollLeft,\n            scrollTop: element.scrollTop\n        };\n    }\n    return {\n        scrollLeft: element.pageXOffset,\n        scrollTop: element.pageYOffset\n    };\n}\nfunction getParentNode(node) {\n    if (getNodeName(node) === \"html\") {\n        return node;\n    }\n    const result = // Step into the shadow DOM of the parent of a slotted node.\n    node.assignedSlot || // DOM Element detected.\n    node.parentNode || // ShadowRoot detected.\n    isShadowRoot(node) && node.host || // Fallback.\n    getDocumentElement(node);\n    return isShadowRoot(result) ? result.host : result;\n}\nfunction getNearestOverflowAncestor(node) {\n    const parentNode = getParentNode(node);\n    if (isLastTraversableNode(parentNode)) {\n        return node.ownerDocument ? node.ownerDocument.body : node.body;\n    }\n    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {\n        return parentNode;\n    }\n    return getNearestOverflowAncestor(parentNode);\n}\nfunction getOverflowAncestors(node, list, traverseIframes) {\n    var _node$ownerDocument2;\n    if (list === void 0) {\n        list = [];\n    }\n    if (traverseIframes === void 0) {\n        traverseIframes = true;\n    }\n    const scrollableAncestor = getNearestOverflowAncestor(node);\n    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);\n    const win = getWindow(scrollableAncestor);\n    if (isBody) {\n        return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);\n    }\n    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BmbG9hdGluZy11aSt1dGlsc0AwLjEuNi9ub2RlX21vZHVsZXMvQGZsb2F0aW5nLXVpL3V0aWxzL2RvbS9kaXN0L2Zsb2F0aW5nLXVpLnV0aWxzLmRvbS5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBU0EsWUFBWUMsSUFBSTtJQUN2QixJQUFJQyxPQUFPRCxPQUFPO1FBQ2hCLE9BQU8sQ0FBQ0EsS0FBS0UsUUFBUSxJQUFJLEVBQUMsRUFBR0MsV0FBVztJQUMxQztJQUNBLHdFQUF3RTtJQUN4RSxzREFBc0Q7SUFDdEQseURBQXlEO0lBQ3pELE9BQU87QUFDVDtBQUNBLFNBQVNDLFVBQVVKLElBQUk7SUFDckIsSUFBSUs7SUFDSixPQUFPLENBQUNMLFFBQVEsT0FBTyxLQUFLLElBQUksQ0FBQ0ssc0JBQXNCTCxLQUFLTSxhQUFhLEtBQUssT0FBTyxLQUFLLElBQUlELG9CQUFvQkUsV0FBVyxLQUFLQztBQUNwSTtBQUNBLFNBQVNDLG1CQUFtQlQsSUFBSTtJQUM5QixJQUFJVTtJQUNKLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDVCxPQUFPRCxRQUFRQSxLQUFLTSxhQUFhLEdBQUdOLEtBQUtXLFFBQVEsS0FBS0gsT0FBT0csUUFBUSxLQUFLLE9BQU8sS0FBSyxJQUFJRCxLQUFLRSxlQUFlO0FBQ2hJO0FBQ0EsU0FBU1gsT0FBT1ksS0FBSztJQUNuQixPQUFPQSxpQkFBaUJDLFFBQVFELGlCQUFpQlQsVUFBVVMsT0FBT0MsSUFBSTtBQUN4RTtBQUNBLFNBQVNDLFVBQVVGLEtBQUs7SUFDdEIsT0FBT0EsaUJBQWlCRyxXQUFXSCxpQkFBaUJULFVBQVVTLE9BQU9HLE9BQU87QUFDOUU7QUFDQSxTQUFTQyxjQUFjSixLQUFLO0lBQzFCLE9BQU9BLGlCQUFpQkssZUFBZUwsaUJBQWlCVCxVQUFVUyxPQUFPSyxXQUFXO0FBQ3RGO0FBQ0EsU0FBU0MsYUFBYU4sS0FBSztJQUN6Qix5Q0FB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QUFHSDtBQUM5QztBQUNBLFNBQVNJLDJCQUEyQjFELElBQUk7SUFDdEMsTUFBTXdELGFBQWFYLGNBQWM3QztJQUNqQyxJQUFJOEMsc0JBQXNCVSxhQUFhO1FBQ3JDLE9BQU94RCxLQUFLTSxhQUFhLEdBQUdOLEtBQUtNLGFBQWEsQ0FBQ3FELElBQUksR0FBRzNELEtBQUsyRCxJQUFJO0lBQ2pFO0lBQ0EsSUFBSTFDLGNBQWN1QyxlQUFlbkMsa0JBQWtCbUMsYUFBYTtRQUM5RCxPQUFPQTtJQUNUO0lBQ0EsT0FBT0UsMkJBQTJCRjtBQUNwQztBQUNBLFNBQVNJLHFCQUFxQjVELElBQUksRUFBRTZELElBQUksRUFBRUMsZUFBZTtJQUN2RCxJQUFJQztJQUNKLElBQUlGLFNBQVMsS0FBSyxHQUFHO1FBQ25CQSxPQUFPLEVBQUU7SUFDWDtJQUNBLElBQUlDLG9CQUFvQixLQUFLLEdBQUc7UUFDOUJBLGtCQUFrQjtJQUNwQjtJQUNBLE1BQU1FLHFCQUFxQk4sMkJBQTJCMUQ7SUFDdEQsTUFBTWlFLFNBQVNELHVCQUF3QixFQUFDRCx1QkFBdUIvRCxLQUFLTSxhQUFhLEtBQUssT0FBTyxLQUFLLElBQUl5RCxxQkFBcUJKLElBQUk7SUFDL0gsTUFBTU8sTUFBTTlELFVBQVU0RDtJQUN0QixJQUFJQyxRQUFRO1FBQ1YsT0FBT0osS0FBS00sTUFBTSxDQUFDRCxLQUFLQSxJQUFJRSxjQUFjLElBQUksRUFBRSxFQUFFL0Msa0JBQWtCMkMsc0JBQXNCQSxxQkFBcUIsRUFBRSxFQUFFRSxJQUFJRyxZQUFZLElBQUlQLGtCQUFrQkYscUJBQXFCTSxJQUFJRyxZQUFZLElBQUksRUFBRTtJQUN0TTtJQUNBLE9BQU9SLEtBQUtNLE1BQU0sQ0FBQ0gsb0JBQW9CSixxQkFBcUJJLG9CQUFvQixFQUFFLEVBQUVGO0FBQ3RGO0FBRW1UIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AZmxvYXRpbmctdWkrdXRpbHNAMC4xLjYvbm9kZV9tb2R1bGVzL0BmbG9hdGluZy11aS91dGlscy9kb20vZGlzdC9mbG9hdGluZy11aS51dGlscy5kb20ubWpzP2M1MWIiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0Tm9kZU5hbWUobm9kZSkge1xuICBpZiAoaXNOb2RlKG5vZGUpKSB7XG4gICAgcmV0dXJuIChub2RlLm5vZGVOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIC8vIE1vY2tlZCBub2RlcyBpbiB0ZXN0aW5nIGVudmlyb25tZW50cyBtYXkgbm90IGJlIGluc3RhbmNlcyBvZiBOb2RlLiBCeVxuICAvLyByZXR1cm5pbmcgYCNkb2N1bWVudGAgYW4gaW5maW5pdGUgbG9vcCB3b24ndCBvY2N1ci5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zsb2F0aW5nLXVpL2Zsb2F0aW5nLXVpL2lzc3Vlcy8yMzE3XG4gIHJldHVybiAnI2RvY3VtZW50Jztcbn1cbmZ1bmN0aW9uIGdldFdpbmRvdyhub2RlKSB7XG4gIHZhciBfbm9kZSRvd25lckRvY3VtZW50O1xuICByZXR1cm4gKG5vZGUgPT0gbnVsbCA/IHZvaWQgMCA6IChfbm9kZSRvd25lckRvY3VtZW50ID0gbm9kZS5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX25vZGUkb3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgfHwgd2luZG93O1xufVxuZnVuY3Rpb24gZ2V0RG9jdW1lbnRFbGVtZW50KG5vZGUpIHtcbiAgdmFyIF9yZWY7XG4gIHJldHVybiAoX3JlZiA9IChpc05vZGUobm9kZSkgPyBub2RlLm93bmVyRG9jdW1lbnQgOiBub2RlLmRvY3VtZW50KSB8fCB3aW5kb3cuZG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfcmVmLmRvY3VtZW50RWxlbWVudDtcbn1cbmZ1bmN0aW9uIGlzTm9kZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBOb2RlIHx8IHZhbHVlIGluc3RhbmNlb2YgZ2V0V2luZG93KHZhbHVlKS5Ob2RlO1xufVxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQgfHwgdmFsdWUgaW5zdGFuY2VvZiBnZXRXaW5kb3codmFsdWUpLkVsZW1lbnQ7XG59XG5mdW5jdGlvbiBpc0hUTUxFbGVtZW50KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IHZhbHVlIGluc3RhbmNlb2YgZ2V0V2luZG93KHZhbHVlKS5IVE1MRWxlbWVudDtcbn1cbmZ1bmN0aW9uIGlzU2hhZG93Um9vdCh2YWx1ZSkge1xuICAvLyBCcm93c2VycyB3aXRob3V0IGBTaGFkb3dSb290YCBzdXBwb3J0LlxuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgfHwgdmFsdWUgaW5zdGFuY2VvZiBnZXRXaW5kb3codmFsdWUpLlNoYWRvd1Jvb3Q7XG59XG5mdW5jdGlvbiBpc092ZXJmbG93RWxlbWVudChlbGVtZW50KSB7XG4gIGNvbnN0IHtcbiAgICBvdmVyZmxvdyxcbiAgICBvdmVyZmxvd1gsXG4gICAgb3ZlcmZsb3dZLFxuICAgIGRpc3BsYXlcbiAgfSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gIHJldHVybiAvYXV0b3xzY3JvbGx8b3ZlcmxheXxoaWRkZW58Y2xpcC8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCkgJiYgIVsnaW5saW5lJywgJ2NvbnRlbnRzJ10uaW5jbHVkZXMoZGlzcGxheSk7XG59XG5mdW5jdGlvbiBpc1RhYmxlRWxlbWVudChlbGVtZW50KSB7XG4gIHJldHVybiBbJ3RhYmxlJywgJ3RkJywgJ3RoJ10uaW5jbHVkZXMoZ2V0Tm9kZU5hbWUoZWxlbWVudCkpO1xufVxuZnVuY3Rpb24gaXNDb250YWluaW5nQmxvY2soZWxlbWVudCkge1xuICBjb25zdCB3ZWJraXQgPSBpc1dlYktpdCgpO1xuICBjb25zdCBjc3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Db250YWluaW5nX2Jsb2NrI2lkZW50aWZ5aW5nX3RoZV9jb250YWluaW5nX2Jsb2NrXG4gIHJldHVybiBjc3MudHJhbnNmb3JtICE9PSAnbm9uZScgfHwgY3NzLnBlcnNwZWN0aXZlICE9PSAnbm9uZScgfHwgKGNzcy5jb250YWluZXJUeXBlID8gY3NzLmNvbnRhaW5lclR5cGUgIT09ICdub3JtYWwnIDogZmFsc2UpIHx8ICF3ZWJraXQgJiYgKGNzcy5iYWNrZHJvcEZpbHRlciA/IGNzcy5iYWNrZHJvcEZpbHRlciAhPT0gJ25vbmUnIDogZmFsc2UpIHx8ICF3ZWJraXQgJiYgKGNzcy5maWx0ZXIgPyBjc3MuZmlsdGVyICE9PSAnbm9uZScgOiBmYWxzZSkgfHwgWyd0cmFuc2Zvcm0nLCAncGVyc3BlY3RpdmUnLCAnZmlsdGVyJ10uc29tZSh2YWx1ZSA9PiAoY3NzLndpbGxDaGFuZ2UgfHwgJycpLmluY2x1ZGVzKHZhbHVlKSkgfHwgWydwYWludCcsICdsYXlvdXQnLCAnc3RyaWN0JywgJ2NvbnRlbnQnXS5zb21lKHZhbHVlID0+IChjc3MuY29udGFpbiB8fCAnJykuaW5jbHVkZXModmFsdWUpKTtcbn1cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoZWxlbWVudCk7XG4gIHdoaWxlIChpc0hUTUxFbGVtZW50KGN1cnJlbnROb2RlKSAmJiAhaXNMYXN0VHJhdmVyc2FibGVOb2RlKGN1cnJlbnROb2RlKSkge1xuICAgIGlmIChpc0NvbnRhaW5pbmdCbG9jayhjdXJyZW50Tm9kZSkpIHtcbiAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBpc1dlYktpdCgpIHtcbiAgaWYgKHR5cGVvZiBDU1MgPT09ICd1bmRlZmluZWQnIHx8ICFDU1Muc3VwcG9ydHMpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIENTUy5zdXBwb3J0cygnLXdlYmtpdC1iYWNrZHJvcC1maWx0ZXInLCAnbm9uZScpO1xufVxuZnVuY3Rpb24gaXNMYXN0VHJhdmVyc2FibGVOb2RlKG5vZGUpIHtcbiAgcmV0dXJuIFsnaHRtbCcsICdib2R5JywgJyNkb2N1bWVudCddLmluY2x1ZGVzKGdldE5vZGVOYW1lKG5vZGUpKTtcbn1cbmZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICByZXR1cm4gZ2V0V2luZG93KGVsZW1lbnQpLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG59XG5mdW5jdGlvbiBnZXROb2RlU2Nyb2xsKGVsZW1lbnQpIHtcbiAgaWYgKGlzRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiB7XG4gICAgICBzY3JvbGxMZWZ0OiBlbGVtZW50LnNjcm9sbExlZnQsXG4gICAgICBzY3JvbGxUb3A6IGVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgfTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IGVsZW1lbnQucGFnZVhPZmZzZXQsXG4gICAgc2Nyb2xsVG9wOiBlbGVtZW50LnBhZ2VZT2Zmc2V0XG4gIH07XG59XG5mdW5jdGlvbiBnZXRQYXJlbnROb2RlKG5vZGUpIHtcbiAgaWYgKGdldE5vZGVOYW1lKG5vZGUpID09PSAnaHRtbCcpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICBjb25zdCByZXN1bHQgPVxuICAvLyBTdGVwIGludG8gdGhlIHNoYWRvdyBET00gb2YgdGhlIHBhcmVudCBvZiBhIHNsb3R0ZWQgbm9kZS5cbiAgbm9kZS5hc3NpZ25lZFNsb3QgfHxcbiAgLy8gRE9NIEVsZW1lbnQgZGV0ZWN0ZWQuXG4gIG5vZGUucGFyZW50Tm9kZSB8fFxuICAvLyBTaGFkb3dSb290IGRldGVjdGVkLlxuICBpc1NoYWRvd1Jvb3Qobm9kZSkgJiYgbm9kZS5ob3N0IHx8XG4gIC8vIEZhbGxiYWNrLlxuICBnZXREb2N1bWVudEVsZW1lbnQobm9kZSk7XG4gIHJldHVybiBpc1NoYWRvd1Jvb3QocmVzdWx0KSA/IHJlc3VsdC5ob3N0IDogcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0TmVhcmVzdE92ZXJmbG93QW5jZXN0b3Iobm9kZSkge1xuICBjb25zdCBwYXJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShub2RlKTtcbiAgaWYgKGlzTGFzdFRyYXZlcnNhYmxlTm9kZShwYXJlbnROb2RlKSkge1xuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQgPyBub2RlLm93bmVyRG9jdW1lbnQuYm9keSA6IG5vZGUuYm9keTtcbiAgfVxuICBpZiAoaXNIVE1MRWxlbWVudChwYXJlbnROb2RlKSAmJiBpc092ZXJmbG93RWxlbWVudChwYXJlbnROb2RlKSkge1xuICAgIHJldHVybiBwYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3RvcihwYXJlbnROb2RlKTtcbn1cbmZ1bmN0aW9uIGdldE92ZXJmbG93QW5jZXN0b3JzKG5vZGUsIGxpc3QsIHRyYXZlcnNlSWZyYW1lcykge1xuICB2YXIgX25vZGUkb3duZXJEb2N1bWVudDI7XG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cbiAgaWYgKHRyYXZlcnNlSWZyYW1lcyA9PT0gdm9pZCAwKSB7XG4gICAgdHJhdmVyc2VJZnJhbWVzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3IgPSBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3Rvcihub2RlKTtcbiAgY29uc3QgaXNCb2R5ID0gc2Nyb2xsYWJsZUFuY2VzdG9yID09PSAoKF9ub2RlJG93bmVyRG9jdW1lbnQyID0gbm9kZS5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX25vZGUkb3duZXJEb2N1bWVudDIuYm9keSk7XG4gIGNvbnN0IHdpbiA9IGdldFdpbmRvdyhzY3JvbGxhYmxlQW5jZXN0b3IpO1xuICBpZiAoaXNCb2R5KSB7XG4gICAgcmV0dXJuIGxpc3QuY29uY2F0KHdpbiwgd2luLnZpc3VhbFZpZXdwb3J0IHx8IFtdLCBpc092ZXJmbG93RWxlbWVudChzY3JvbGxhYmxlQW5jZXN0b3IpID8gc2Nyb2xsYWJsZUFuY2VzdG9yIDogW10sIHdpbi5mcmFtZUVsZW1lbnQgJiYgdHJhdmVyc2VJZnJhbWVzID8gZ2V0T3ZlcmZsb3dBbmNlc3RvcnMod2luLmZyYW1lRWxlbWVudCkgOiBbXSk7XG4gIH1cbiAgcmV0dXJuIGxpc3QuY29uY2F0KHNjcm9sbGFibGVBbmNlc3RvciwgZ2V0T3ZlcmZsb3dBbmNlc3RvcnMoc2Nyb2xsYWJsZUFuY2VzdG9yLCBbXSwgdHJhdmVyc2VJZnJhbWVzKSk7XG59XG5cbmV4cG9ydCB7IGdldENvbXB1dGVkU3R5bGUsIGdldENvbnRhaW5pbmdCbG9jaywgZ2V0RG9jdW1lbnRFbGVtZW50LCBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3RvciwgZ2V0Tm9kZU5hbWUsIGdldE5vZGVTY3JvbGwsIGdldE92ZXJmbG93QW5jZXN0b3JzLCBnZXRQYXJlbnROb2RlLCBnZXRXaW5kb3csIGlzQ29udGFpbmluZ0Jsb2NrLCBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQsIGlzTGFzdFRyYXZlcnNhYmxlTm9kZSwgaXNOb2RlLCBpc092ZXJmbG93RWxlbWVudCwgaXNTaGFkb3dSb290LCBpc1RhYmxlRWxlbWVudCwgaXNXZWJLaXQgfTtcbiJdLCJuYW1lcyI6WyJnZXROb2RlTmFtZSIsIm5vZGUiLCJpc05vZGUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiZ2V0V2luZG93IiwiX25vZGUkb3duZXJEb2N1bWVudCIsIm93bmVyRG9jdW1lbnQiLCJkZWZhdWx0VmlldyIsIndpbmRvdyIsImdldERvY3VtZW50RWxlbWVudCIsIl9yZWYiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsInZhbHVlIiwiTm9kZSIsImlzRWxlbWVudCIsIkVsZW1lbnQiLCJpc0hUTUxFbGVtZW50IiwiSFRNTEVsZW1lbnQiLCJpc1NoYWRvd1Jvb3QiLCJTaGFkb3dSb290IiwiaXNPdmVyZmxvd0VsZW1lbnQiLCJlbGVtZW50Iiwib3ZlcmZsb3ciLCJvdmVyZmxvd1giLCJvdmVyZmxvd1kiLCJkaXNwbGF5IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsInRlc3QiLCJpbmNsdWRlcyIsImlzVGFibGVFbGVtZW50IiwiaXNDb250YWluaW5nQmxvY2siLCJ3ZWJraXQiLCJpc1dlYktpdCIsImNzcyIsInRyYW5zZm9ybSIsInBlcnNwZWN0aXZlIiwiY29udGFpbmVyVHlwZSIsImJhY2tkcm9wRmlsdGVyIiwiZmlsdGVyIiwic29tZSIsIndpbGxDaGFuZ2UiLCJjb250YWluIiwiZ2V0Q29udGFpbmluZ0Jsb2NrIiwiY3VycmVudE5vZGUiLCJnZXRQYXJlbnROb2RlIiwiaXNMYXN0VHJhdmVyc2FibGVOb2RlIiwiQ1NTIiwic3VwcG9ydHMiLCJnZXROb2RlU2Nyb2xsIiwic2Nyb2xsTGVmdCIsInNjcm9sbFRvcCIsInBhZ2VYT2Zmc2V0IiwicGFnZVlPZmZzZXQiLCJyZXN1bHQiLCJhc3NpZ25lZFNsb3QiLCJwYXJlbnROb2RlIiwiaG9zdCIsImdldE5lYXJlc3RPdmVyZmxvd0FuY2VzdG9yIiwiYm9keSIsImdldE92ZXJmbG93QW5jZXN0b3JzIiwibGlzdCIsInRyYXZlcnNlSWZyYW1lcyIsIl9ub2RlJG93bmVyRG9jdW1lbnQyIiwic2Nyb2xsYWJsZUFuY2VzdG9yIiwiaXNCb2R5Iiwid2luIiwiY29uY2F0IiwidmlzdWFsVmlld3BvcnQiLCJmcmFtZUVsZW1lbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@floating-ui+utils@0.1.6/node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs\n");

/***/ })

};
;