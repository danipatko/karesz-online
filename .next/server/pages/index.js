/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/index";
exports.ids = ["pages/index"];
exports.modules = {

/***/ "./src/styles/Home.module.css":
/*!************************************!*\
  !*** ./src/styles/Home.module.css ***!
  \************************************/
/***/ ((module) => {

eval("// Exports\nmodule.exports = {\n\t\"container\": \"Home_container__Ennsq\",\n\t\"main\": \"Home_main__EtNt2\",\n\t\"footer\": \"Home_footer__7dKhS\",\n\t\"title\": \"Home_title__FX7xZ\",\n\t\"description\": \"Home_description__Qwq1f\",\n\t\"code\": \"Home_code__aGV0U\",\n\t\"grid\": \"Home_grid__c_g6N\",\n\t\"card\": \"Home_card__7oz7W\",\n\t\"logo\": \"Home_logo__80mSr\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3R5bGVzL0hvbWUubW9kdWxlLmNzcy5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9rYXJlc3otbmV4dC8uL3NyYy9zdHlsZXMvSG9tZS5tb2R1bGUuY3NzPzE4N2YiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiY29udGFpbmVyXCI6IFwiSG9tZV9jb250YWluZXJfX0VubnNxXCIsXG5cdFwibWFpblwiOiBcIkhvbWVfbWFpbl9fRXROdDJcIixcblx0XCJmb290ZXJcIjogXCJIb21lX2Zvb3Rlcl9fN2RLaFNcIixcblx0XCJ0aXRsZVwiOiBcIkhvbWVfdGl0bGVfX0ZYN3haXCIsXG5cdFwiZGVzY3JpcHRpb25cIjogXCJIb21lX2Rlc2NyaXB0aW9uX19Rd3ExZlwiLFxuXHRcImNvZGVcIjogXCJIb21lX2NvZGVfX2FHVjBVXCIsXG5cdFwiZ3JpZFwiOiBcIkhvbWVfZ3JpZF9fY19nNk5cIixcblx0XCJjYXJkXCI6IFwiSG9tZV9jYXJkX183b3o3V1wiLFxuXHRcImxvZ29cIjogXCJIb21lX2xvZ29fXzgwbVNyXCJcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/styles/Home.module.css\n");

/***/ }),

/***/ "./src/pages/index.tsx":
/*!*****************************!*\
  !*** ./src/pages/index.tsx ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/Home.module.css */ \"./src/styles/Home.module.css\");\n/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io-client */ \"socket.io-client\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io_client__WEBPACK_IMPORTED_MODULE_1__]);\nsocket_io_client__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];\n\n\n\n\nconst Home = ()=>{\n    const { 0: socket1 , 1: setSocket  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const socket = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_1__.io)();\n        socket.on('a', ()=>{\n            console.log('a');\n        });\n        socket.on('b', ()=>{\n            console.log('b');\n        });\n        socket.on('c', ()=>{\n            console.log('c');\n        });\n        socket.emit('join', {\n            hehe: 'heha'\n        });\n        setSocket(socket);\n    }, []);\n    const join = ()=>socket1.emit('join')\n    ;\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().container),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                children: socket1?.connected ? 'connected' : 'not connected'\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                lineNumber: 34,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: join,\n                children: \"invoke join\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                lineNumber: 38,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n        lineNumber: 33,\n        columnNumber: 5\n    }, undefined));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);\n\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvaW5kZXgudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUM4QztBQUNEO0FBQ0Y7QUFFM0MsS0FBSyxDQUFDSSxJQUFJLE9BQW1CLENBQUM7SUFFNUIsS0FBSyxNQUFFQyxPQUFNLE1BQUVDLFNBQVMsTUFBSUgsK0NBQVEsQ0FBUyxJQUFJO0lBRWpERCxnREFBUyxLQUFPLENBQUM7UUFDZixLQUFLLENBQUNHLE1BQU0sR0FBR0osb0RBQUU7UUFFakJJLE1BQU0sQ0FBQ0UsRUFBRSxDQUFDLENBQUcsUUFBUSxDQUFDO1lBQ2xCQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxDQUFHO1FBQ25CLENBQUM7UUFFREosTUFBTSxDQUFDRSxFQUFFLENBQUMsQ0FBRyxRQUFRLENBQUM7WUFDbEJDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUc7UUFDbkIsQ0FBQztRQUVESixNQUFNLENBQUNFLEVBQUUsQ0FBQyxDQUFHLFFBQVEsQ0FBQztZQUNsQkMsT0FBTyxDQUFDQyxHQUFHLENBQUMsQ0FBRztRQUNuQixDQUFDO1FBRURKLE1BQU0sQ0FBQ0ssSUFBSSxDQUFDLENBQU0sT0FBRSxDQUFDO1lBQUNDLElBQUksRUFBQyxDQUFNO1FBQUMsQ0FBQztRQUVuQ0wsU0FBUyxDQUFDRCxNQUFNO0lBQ2xCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFTCxLQUFLLENBQUNPLElBQUksT0FBU1AsT0FBTSxDQUFDSyxJQUFJLENBQUMsQ0FBTTs7SUFFckMsTUFBTSw2RUFDSEcsQ0FBRztRQUFDQyxTQUFTLEVBQUVkLDBFQUFnQjs7d0ZBQzNCYSxDQUFHOzBCQUNDUixPQUFNLEVBQUVXLFNBQVMsR0FBRyxDQUFXLGFBQUcsQ0FBZTs7Ozs7O3dGQUd2REMsQ0FBTTtnQkFBQ0MsT0FBTyxFQUFFTixJQUFJOzBCQUFFLENBQVc7Ozs7Ozs7Ozs7OztBQUd4QyxDQUFDO0FBRUQsaUVBQWVSLElBQUkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9rYXJlc3otbmV4dC8uL3NyYy9wYWdlcy9pbmRleC50c3g/MTlhMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRQYWdlIH0gZnJvbSAnbmV4dCc7XHJcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi4vc3R5bGVzL0hvbWUubW9kdWxlLmNzcyc7XHJcbmltcG9ydCB7IGlvLCBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmNvbnN0IEhvbWU6IE5leHRQYWdlID0gKCkgPT4ge1xyXG5cclxuICBjb25zdCBbc29ja2V0LCBzZXRTb2NrZXRdID0gdXNlU3RhdGU8U29ja2V0PihudWxsIGFzIGFueSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBzb2NrZXQgPSBpbygpO1xyXG4gICAgXHJcbiAgICBzb2NrZXQub24oJ2EnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2EnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNvY2tldC5vbignYicsICgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnYicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc29ja2V0Lm9uKCdjJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgaGVoZTonaGVoYScgfSk7XHJcblxyXG4gICAgc2V0U29ja2V0KHNvY2tldCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBqb2luID0gKCkgPT4gc29ja2V0LmVtaXQoJ2pvaW4nKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfT5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7c29ja2V0Py5jb25uZWN0ZWQgPyAnY29ubmVjdGVkJyA6ICdub3QgY29ubmVjdGVkJ31cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxidXR0b24gb25DbGljaz17am9pbn0+aW52b2tlIGpvaW48L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSG9tZVxyXG4iXSwibmFtZXMiOlsic3R5bGVzIiwiaW8iLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkhvbWUiLCJzb2NrZXQiLCJzZXRTb2NrZXQiLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJlbWl0IiwiaGVoZSIsImpvaW4iLCJkaXYiLCJjbGFzc05hbWUiLCJjb250YWluZXIiLCJjb25uZWN0ZWQiLCJidXR0b24iLCJvbkNsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/index.tsx\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "socket.io-client":
/*!***********************************!*\
  !*** external "socket.io-client" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("socket.io-client");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/index.tsx"));
module.exports = __webpack_exports__;

})();