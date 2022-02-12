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
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/Home.module.css */ \"./src/styles/Home.module.css\");\n/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io-client */ \"socket.io-client\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io_client__WEBPACK_IMPORTED_MODULE_1__]);\nsocket_io_client__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];\n\n\n\n\nconst Home = ()=>{\n    const { 0: socket1 , 1: setSocket  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const socket = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_1__.io)();\n        socket.on('fetch', ({ players , host , code  })=>{\n            console.log(`host: ${host} | code: ${code} \\nPlayers: ${JSON.stringify(players)}`);\n        });\n        socket.on('state_update', ({ state  })=>{\n            console.log(`new state: ${state}`);\n        });\n        socket.on('joined', ({ name , id , ready  })=>{\n            console.log(`a new player joined: ${name}`);\n        });\n        socket.on('left', ({ id  })=>{\n            console.log(`${id} left the game`);\n        });\n        socket.on('player_update', ({ id , ready  })=>{\n            console.log(`${id} is ${ready ? '' : 'not'} ready`);\n        });\n        setSocket(socket);\n    }, []);\n    const join = ()=>socket1.emit('join', {\n            name: 'bofa',\n            code: parseInt(document.getElementById('code').value)\n        })\n    ;\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().container),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                children: socket1?.connected ? 'connected' : 'not connected'\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                lineNumber: 74,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                    type: \"number\",\n                    id: \"code\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                    lineNumber: 76,\n                    columnNumber: 17\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                lineNumber: 75,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: join,\n                children: \"join\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n                lineNumber: 78,\n                columnNumber: 13\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Dani\\\\home\\\\Projects\\\\karesz-online\\\\src\\\\pages\\\\index.tsx\",\n        lineNumber: 73,\n        columnNumber: 9\n    }, undefined));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);\n\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvaW5kZXgudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUM4QztBQUNEO0FBQ0Y7QUFFM0MsS0FBSyxDQUFDSSxJQUFJLE9BQW1CLENBQUM7SUFDMUIsS0FBSyxNQUFFQyxPQUFNLE1BQUVDLFNBQVMsTUFBSUgsK0NBQVEsQ0FBUyxJQUFJO0lBRWpERCxnREFBUyxLQUFPLENBQUM7UUFDYixLQUFLLENBQUNHLE1BQU0sR0FBR0osb0RBQUU7UUFFakJJLE1BQU0sQ0FBQ0UsRUFBRSxDQUNMLENBQU8sU0FDTixDQUFDLENBQ0VDLE9BQU8sR0FDUEMsSUFBSSxHQUNKQyxJQUFJLEVBS1IsQ0FBQyxHQUFLLENBQUM7WUFDSEMsT0FBTyxDQUFDQyxHQUFHLEVBQ04sTUFBTSxFQUFFSCxJQUFJLENBQUMsU0FBUyxFQUFFQyxJQUFJLENBQUMsWUFBWSxFQUFFRyxJQUFJLENBQUNDLFNBQVMsQ0FDdEROLE9BQU87UUFHbkIsQ0FBQztRQUdMSCxNQUFNLENBQUNFLEVBQUUsQ0FBQyxDQUFjLGdCQUFHLENBQUMsQ0FBQ1EsS0FBSyxFQUFvQixDQUFDLEdBQUssQ0FBQztZQUN6REosT0FBTyxDQUFDQyxHQUFHLEVBQUUsV0FBVyxFQUFFRyxLQUFLO1FBQ25DLENBQUM7UUFFRFYsTUFBTSxDQUFDRSxFQUFFLENBQ0wsQ0FBUSxVQUNQLENBQUMsQ0FDRVMsSUFBSSxHQUNKQyxFQUFFLEdBQ0ZDLEtBQUssRUFLVCxDQUFDLEdBQUssQ0FBQztZQUNIUCxPQUFPLENBQUNDLEdBQUcsRUFBRSxxQkFBcUIsRUFBRUksSUFBSTtRQUM1QyxDQUFDO1FBR0xYLE1BQU0sQ0FBQ0UsRUFBRSxDQUFDLENBQU0sUUFBRyxDQUFDLENBQUNVLEVBQUUsRUFBaUIsQ0FBQyxHQUFLLENBQUM7WUFDM0NOLE9BQU8sQ0FBQ0MsR0FBRyxJQUFJSyxFQUFFLENBQUMsY0FBYztRQUNwQyxDQUFDO1FBRURaLE1BQU0sQ0FBQ0UsRUFBRSxDQUNMLENBQWUsaUJBQ2QsQ0FBQyxDQUFDVSxFQUFFLEdBQUVDLEtBQUssRUFBaUMsQ0FBQyxHQUFLLENBQUM7WUFDaERQLE9BQU8sQ0FBQ0MsR0FBRyxJQUFJSyxFQUFFLENBQUMsSUFBSSxFQUFFQyxLQUFLLEdBQUcsQ0FBRSxJQUFHLENBQUssS0FBQyxNQUFNO1FBQ3JELENBQUM7UUFHTFosU0FBUyxDQUFDRCxNQUFNO0lBQ3BCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFTCxLQUFLLENBQUNjLElBQUksT0FDTmQsT0FBTSxDQUFDZSxJQUFJLENBQUMsQ0FBTSxPQUFFLENBQUM7WUFDakJKLElBQUksRUFBRSxDQUFNO1lBQ1pOLElBQUksRUFBRVcsUUFBUSxDQUNUQyxRQUFRLENBQUNDLGNBQWMsQ0FBQyxDQUFNLE9BQXVCQyxLQUFLO1FBRW5FLENBQUM7O0lBRUwsTUFBTSw2RUFDREMsQ0FBRztRQUFDQyxTQUFTLEVBQUUxQiwwRUFBZ0I7O3dGQUMzQnlCLENBQUc7MEJBQUVwQixPQUFNLEVBQUV1QixTQUFTLEdBQUcsQ0FBVyxhQUFHLENBQWU7Ozs7Ozt3RkFDdERILENBQUc7c0dBQ0NJLENBQUs7b0JBQUNDLElBQUksRUFBQyxDQUFRO29CQUFDYixFQUFFLEVBQUMsQ0FBTTs7Ozs7Ozs7Ozs7d0ZBRWpDYyxDQUFNO2dCQUFDQyxPQUFPLEVBQUViLElBQUk7MEJBQUUsQ0FBSTs7Ozs7Ozs7Ozs7O0FBR3ZDLENBQUM7QUFFRCxpRUFBZWYsSUFBSSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2FyZXN6LW5leHQvLi9zcmMvcGFnZXMvaW5kZXgudHN4PzE5YTAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0UGFnZSB9IGZyb20gJ25leHQnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4uL3N0eWxlcy9Ib21lLm1vZHVsZS5jc3MnO1xyXG5pbXBvcnQgeyBpbywgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcblxyXG5jb25zdCBIb21lOiBOZXh0UGFnZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IFtzb2NrZXQsIHNldFNvY2tldF0gPSB1c2VTdGF0ZTxTb2NrZXQ+KG51bGwgYXMgYW55KTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gICAgICAgIHNvY2tldC5vbihcclxuICAgICAgICAgICAgJ2ZldGNoJyxcclxuICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgIHBsYXllcnMsXHJcbiAgICAgICAgICAgICAgICBob3N0LFxyXG4gICAgICAgICAgICAgICAgY29kZSxcclxuICAgICAgICAgICAgfToge1xyXG4gICAgICAgICAgICAgICAgaG9zdDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyczogYW55O1xyXG4gICAgICAgICAgICAgICAgY29kZTogbnVtYmVyO1xyXG4gICAgICAgICAgICB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICBgaG9zdDogJHtob3N0fSB8IGNvZGU6ICR7Y29kZX0gXFxuUGxheWVyczogJHtKU09OLnN0cmluZ2lmeShcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyc1xyXG4gICAgICAgICAgICAgICAgICAgICl9YFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHNvY2tldC5vbignc3RhdGVfdXBkYXRlJywgKHsgc3RhdGUgfTogeyBzdGF0ZTogbnVtYmVyIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYG5ldyBzdGF0ZTogJHtzdGF0ZX1gKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc29ja2V0Lm9uKFxyXG4gICAgICAgICAgICAnam9pbmVkJyxcclxuICAgICAgICAgICAgKHtcclxuICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICBpZCxcclxuICAgICAgICAgICAgICAgIHJlYWR5LFxyXG4gICAgICAgICAgICB9OiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICBpZDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgcmVhZHk6IGJvb2xlYW47XHJcbiAgICAgICAgICAgIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBhIG5ldyBwbGF5ZXIgam9pbmVkOiAke25hbWV9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBzb2NrZXQub24oJ2xlZnQnLCAoeyBpZCB9OiB7IGlkOiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtpZH0gbGVmdCB0aGUgZ2FtZWApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzb2NrZXQub24oXHJcbiAgICAgICAgICAgICdwbGF5ZXJfdXBkYXRlJyxcclxuICAgICAgICAgICAgKHsgaWQsIHJlYWR5IH06IHsgaWQ6IHN0cmluZzsgcmVhZHk6IGJvb2xlYW4gfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7aWR9IGlzICR7cmVhZHkgPyAnJyA6ICdub3QnfSByZWFkeWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc2V0U29ja2V0KHNvY2tldCk7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgY29uc3Qgam9pbiA9ICgpID0+XHJcbiAgICAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdib2ZhJyxcclxuICAgICAgICAgICAgY29kZTogcGFyc2VJbnQoXHJcbiAgICAgICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5jb250YWluZXJ9PlxyXG4gICAgICAgICAgICA8ZGl2Pntzb2NrZXQ/LmNvbm5lY3RlZCA/ICdjb25uZWN0ZWQnIDogJ25vdCBjb25uZWN0ZWQnfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J251bWJlcicgaWQ9J2NvZGUnIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2pvaW59PmpvaW48L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIb21lO1xyXG4iXSwibmFtZXMiOlsic3R5bGVzIiwiaW8iLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkhvbWUiLCJzb2NrZXQiLCJzZXRTb2NrZXQiLCJvbiIsInBsYXllcnMiLCJob3N0IiwiY29kZSIsImNvbnNvbGUiLCJsb2ciLCJKU09OIiwic3RyaW5naWZ5Iiwic3RhdGUiLCJuYW1lIiwiaWQiLCJyZWFkeSIsImpvaW4iLCJlbWl0IiwicGFyc2VJbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJkaXYiLCJjbGFzc05hbWUiLCJjb250YWluZXIiLCJjb25uZWN0ZWQiLCJpbnB1dCIsInR5cGUiLCJidXR0b24iLCJvbkNsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/index.tsx\n");

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