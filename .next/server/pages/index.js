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
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/Home.module.css */ \"./src/styles/Home.module.css\");\n/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io-client */ \"socket.io-client\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io_client__WEBPACK_IMPORTED_MODULE_1__]);\nsocket_io_client__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];\n\n\n\n\nconst Home = ()=>{\n    const { 0: socket1 , 1: setSocket  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const socket = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_1__.io)();\n        // @ts-ignore\n        const a = 'sadsadsad'.replaceAll('a', 'asdf');\n        console.log(a);\n        socket.on('a', ()=>{\n            console.log('a');\n        });\n        socket.on('b', ()=>{\n            console.log('b');\n        });\n        socket.on('c', ()=>{\n            console.log('c');\n        });\n        socket.emit('join', {\n            hehe: 'heha'\n        });\n        setSocket(socket);\n    }, []);\n    const join = ()=>socket1.emit('join')\n    ;\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().container),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                children: socket1?.connected ? 'connected' : 'not connected'\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                lineNumber: 38,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: join,\n                children: \"invoke join\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                lineNumber: 40,\n                columnNumber: 13\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n        lineNumber: 37,\n        columnNumber: 9\n    }, undefined));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);\n\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvaW5kZXgudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUM4QztBQUNEO0FBQ0Y7QUFFM0MsS0FBSyxDQUFDSSxJQUFJLE9BQW1CLENBQUM7SUFDMUIsS0FBSyxNQUFFQyxPQUFNLE1BQUVDLFNBQVMsTUFBSUgsK0NBQVEsQ0FBUyxJQUFJO0lBRWpERCxnREFBUyxLQUFPLENBQUM7UUFDYixLQUFLLENBQUNHLE1BQU0sR0FBR0osb0RBQUU7UUFFakIsRUFBYTtRQUNiLEtBQUssQ0FBQ00sQ0FBQyxHQUFHLENBQVcsV0FBQ0MsVUFBVSxDQUFDLENBQUcsSUFBRSxDQUFNO1FBRTVDQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0gsQ0FBQztRQUViRixNQUFNLENBQUNNLEVBQUUsQ0FBQyxDQUFHLFFBQVEsQ0FBQztZQUNsQkYsT0FBTyxDQUFDQyxHQUFHLENBQUMsQ0FBRztRQUNuQixDQUFDO1FBRURMLE1BQU0sQ0FBQ00sRUFBRSxDQUFDLENBQUcsUUFBUSxDQUFDO1lBQ2xCRixPQUFPLENBQUNDLEdBQUcsQ0FBQyxDQUFHO1FBQ25CLENBQUM7UUFFREwsTUFBTSxDQUFDTSxFQUFFLENBQUMsQ0FBRyxRQUFRLENBQUM7WUFDbEJGLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUc7UUFDbkIsQ0FBQztRQUVETCxNQUFNLENBQUNPLElBQUksQ0FBQyxDQUFNLE9BQUUsQ0FBQztZQUFDQyxJQUFJLEVBQUUsQ0FBTTtRQUFDLENBQUM7UUFFcENQLFNBQVMsQ0FBQ0QsTUFBTTtJQUNwQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRUwsS0FBSyxDQUFDUyxJQUFJLE9BQVNULE9BQU0sQ0FBQ08sSUFBSSxDQUFDLENBQU07O0lBRXJDLE1BQU0sNkVBQ0RHLENBQUc7UUFBQ0MsU0FBUyxFQUFFaEIsMEVBQWdCOzt3RkFDM0JlLENBQUc7MEJBQUVWLE9BQU0sRUFBRWEsU0FBUyxHQUFHLENBQVcsYUFBRyxDQUFlOzs7Ozs7d0ZBRXREQyxDQUFNO2dCQUFDQyxPQUFPLEVBQUVOLElBQUk7MEJBQUUsQ0FBVzs7Ozs7Ozs7Ozs7O0FBRzlDLENBQUM7QUFFRCxpRUFBZVYsSUFBSSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2FyZXN6LW5leHQvLi9zcmMvcGFnZXMvaW5kZXgudHN4PzE5YTAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0UGFnZSB9IGZyb20gJ25leHQnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4uL3N0eWxlcy9Ib21lLm1vZHVsZS5jc3MnO1xyXG5pbXBvcnQgeyBpbywgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcblxyXG5jb25zdCBIb21lOiBOZXh0UGFnZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IFtzb2NrZXQsIHNldFNvY2tldF0gPSB1c2VTdGF0ZTxTb2NrZXQ+KG51bGwgYXMgYW55KTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBjb25zdCBhID0gJ3NhZHNhZHNhZCcucmVwbGFjZUFsbCgnYScsICdhc2RmJyk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGEpO1xyXG5cclxuICAgICAgICBzb2NrZXQub24oJ2EnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNvY2tldC5vbignYicsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2InKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc29ja2V0Lm9uKCdjJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgaGVoZTogJ2hlaGEnIH0pO1xyXG5cclxuICAgICAgICBzZXRTb2NrZXQoc29ja2V0KTtcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICBjb25zdCBqb2luID0gKCkgPT4gc29ja2V0LmVtaXQoJ2pvaW4nKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfT5cclxuICAgICAgICAgICAgPGRpdj57c29ja2V0Py5jb25uZWN0ZWQgPyAnY29ubmVjdGVkJyA6ICdub3QgY29ubmVjdGVkJ308L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17am9pbn0+aW52b2tlIGpvaW48L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIb21lO1xyXG4iXSwibmFtZXMiOlsic3R5bGVzIiwiaW8iLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkhvbWUiLCJzb2NrZXQiLCJzZXRTb2NrZXQiLCJhIiwicmVwbGFjZUFsbCIsImNvbnNvbGUiLCJsb2ciLCJvbiIsImVtaXQiLCJoZWhlIiwiam9pbiIsImRpdiIsImNsYXNzTmFtZSIsImNvbnRhaW5lciIsImNvbm5lY3RlZCIsImJ1dHRvbiIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/index.tsx\n");

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