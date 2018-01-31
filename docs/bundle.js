/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Template {
  constructor(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    this.template = template.content;
  }
  render() {
    return this.template.cloneNode(true);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Template;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__reset_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_css__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__main_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_app_App__ = __webpack_require__(9);




const root = document.getElementById('root');
const app = new __WEBPACK_IMPORTED_MODULE_2__components_app_App__["a" /* default */]();

root.appendChild(app.render());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./reset.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./reset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n\n/* HTML5 display-role reset for older browsers */\n\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\n\nbody {\n\tline-height: 1;\n}\n\nnav ol, nav ul {\n\tlist-style: none;\n}\n\nblockquote, q {\n\tquotes: none;\n}\n\nblockquote:before, blockquote:after, q:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\n\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\n\nstrong {font-weight: bold;}\n\nem {font-style: italic;}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/news-feed/reset.css"],"names":[],"mappings":"AAAA;;;EAGE;;AAEF;CAaC,UAAU;CACV,WAAW;CACX,UAAU;CACV,gBAAgB;CAChB,cAAc;CACd,yBAAyB;CACzB;;AACD,iDAAiD;;AACjD;CAEC,eAAe;CACf;;AACD;CACC,eAAe;CACf;;AACD;CACC,iBAAiB;CACjB;;AACD;CACC,aAAa;CACb;;AACD;CAEC,YAAY;CACZ,cAAc;CACd;;AACD;CACC,0BAA0B;CAC1B,kBAAkB;CAClB;;AACD,QAAQ,kBAAkB,CAAC;;AAC3B,IAAI,mBAAmB,CAAC","file":"reset.css","sourcesContent":["/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nnav ol, nav ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\nstrong {font-weight: bold;}\nem {font-style: italic;}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "body {\n  font-family: 'Work Sans', sans-serif;\n  font-weight: 500;\n  color: rgb(73, 73, 73);\n}\n\np {\n  margin-bottom: 1.3em;\n  line-height: 1.7;\n}\n\n/* Font sizing from http://type-scale.com/ */\n\nh1, h2, h3, h4 {\n  /* margin: 1em 0 0.5em; */\n  line-height: 1.1;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  padding: 0 0 1rem 0;\n}\n\nh1 {\n  margin-top: 0;\n  font-size: 3.598em;\n}\n\nh2 {font-size: 2.827em;}\n\nh3 {font-size: 1.999em;}\n\nh4 {font-size: 1.414em;}\n\nfigcaption, small, .font_small {font-size: 0.8em;}\n\n/* hide screen-reader only text. https://webaim.org/techniques/css/invisiblecontent/ */\n\n.clip {\n  position: absolute !important;\n  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n  clip: rect(1px, 1px, 1px, 1px);\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n\na {\n  text-decoration: none;\n  color: #d63d00;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n  padding: 0 0 3px;\n  border-bottom: 3px solid white;\n}\n\na:hover {\n  color: #d63d00;\n  border-bottom: 3px solid #d63d00;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  h1 {\n    margin-top: 0;\n    font-size: 2.074em;\n  }\n  \n  h2 {\n    font-size: 1.728em;\n  }\n  \n  h3 {\n    font-size: 1.44em;\n  }\n  \n  h4 {\n    font-size: 1.2em;\n  }\n}\n\n/* Tablet */\n\n@media only screen and (min-width: 480px) and (max-width: 1200px) {\n  h1 {\n      font-size: 2.957em;\n  }\n\n  h2 {\n      font-size: 2.369em;\n  }\n\n  h3 {\n      font-size: 1.777em;\n  }\n\n  h4 {\n      font-size: 1.333em;\n  }\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/news-feed/main.css"],"names":[],"mappings":"AAAA;EACE,qCAAqC;EACrC,iBAAiB;EACjB,uBAAuB;CACxB;;AAED;EACE,qBAAqB;EACrB,iBAAiB;CAClB;;AAED,6CAA6C;;AAC7C;EACE,0BAA0B;EAC1B,iBAAiB;EACjB,oBAAoB;EACpB,0BAA0B;EAC1B,oBAAoB;CACrB;;AAED;EACE,cAAc;EACd,mBAAmB;CACpB;;AAED,IAAI,mBAAmB,CAAC;;AAExB,IAAI,mBAAmB,CAAC;;AAExB,IAAI,mBAAmB,CAAC;;AAExB,gCAAgC,iBAAiB,CAAC;;AAElD,uFAAuF;;AACvF;EACE,8BAA8B;EAC9B,4BAA4B,CAAC,cAAc;EAC3C,+BAA+B;CAChC;;AAED;EACE,eAAe;EACf,YAAY;EACZ,aAAa;CACd;;AAED;EACE,sBAAsB;EACtB,eAAe;EACf,kCAA0B;EAA1B,0BAA0B;EAC1B,iBAAiB;EACjB,+BAA+B;CAChC;;AAED;EACE,eAAe;EACf,iCAAiC;CAClC;;AAED,qCAAqC;;AAErC,YAAY;;AACZ;EACE;IACE,cAAc;IACd,mBAAmB;GACpB;;EAED;IACE,mBAAmB;GACpB;;EAED;IACE,kBAAkB;GACnB;;EAED;IACE,iBAAiB;GAClB;CACF;;AAED,YAAY;;AACZ;EACE;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;CACF","file":"main.css","sourcesContent":["body {\n  font-family: 'Work Sans', sans-serif;\n  font-weight: 500;\n  color: rgb(73, 73, 73);\n}\n\np {\n  margin-bottom: 1.3em;\n  line-height: 1.7;\n}\n\n/* Font sizing from http://type-scale.com/ */\nh1, h2, h3, h4 {\n  /* margin: 1em 0 0.5em; */\n  line-height: 1.1;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  padding: 0 0 1rem 0;\n}\n\nh1 {\n  margin-top: 0;\n  font-size: 3.598em;\n}\n\nh2 {font-size: 2.827em;}\n\nh3 {font-size: 1.999em;}\n\nh4 {font-size: 1.414em;}\n\nfigcaption, small, .font_small {font-size: 0.8em;}\n\n/* hide screen-reader only text. https://webaim.org/techniques/css/invisiblecontent/ */\n.clip {\n  position: absolute !important;\n  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n  clip: rect(1px, 1px, 1px, 1px);\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n\na {\n  text-decoration: none;\n  color: #d63d00;\n  transition: 0.3s ease all;\n  padding: 0 0 3px;\n  border-bottom: 3px solid white;\n}\n\na:hover {\n  color: #d63d00;\n  border-bottom: 3px solid #d63d00;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  h1 {\n    margin-top: 0;\n    font-size: 2.074em;\n  }\n  \n  h2 {\n    font-size: 1.728em;\n  }\n  \n  h3 {\n    font-size: 1.44em;\n  }\n  \n  h4 {\n    font-size: 1.2em;\n  }\n}\n\n/* Tablet */\n@media only screen and (min-width: 480px) and (max-width: 1200px) {\n  h1 {\n      font-size: 2.957em;\n  }\n\n  h2 {\n      font-size: 2.369em;\n  }\n\n  h3 {\n      font-size: 1.777em;\n  }\n\n  h4 {\n      font-size: 1.333em;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_html__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_css__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__app_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__search_Search__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__articles_ArticleList__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__search_Paging__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_newsApi__ = __webpack_require__(27);
// Basic imports









const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__app_html___default.a);

class App {
  
  // Setting search values
  handleSearch(searchTerm) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.runSearch();
  }
  
  // Paging
  handlePaging(pageIndex) {
    this.pageIndex = pageIndex;
    this.runSearch();
  }

  // Run search function
  runSearch() {

    this.loading.classList.remove('hidden');

    Object(__WEBPACK_IMPORTED_MODULE_6__services_newsApi__["a" /* searchNews */])(this.searchTerm, this.pageIndex)
      .then(data => {
        console.log(data);

        // articles and totalResults from api
        const newsArticles = data.articles;
        const total = data.totalResults;

        const articlesSection = this.articlesSection;

        while(articlesSection.hasChildNodes()) {
          articlesSection.removeChild(articlesSection.lastChild);
        }

        const articleList = new __WEBPACK_IMPORTED_MODULE_4__articles_ArticleList__["a" /* default */](newsArticles);
        articlesSection.appendChild(articleList.render());

        // paging update
        this.paging.update(this.pageIndex, 6, total, this.searchTerm);
        this.loading.classList.add('hidden');
      });
  }

  render() {
    const dom = template.render();

    this.loading = dom.getElementById('loading');

    // Reference for new section
    this.articlesSection = dom.getElementById('news');

    // Reference search from Search.js and place to dom
    const searchBox = dom.getElementById('search');

    // search => this.handleSearch(search) in Search() - linked to Search() in Search.js
    const search = new __WEBPACK_IMPORTED_MODULE_3__search_Search__["a" /* default */](searchTerm => this.handleSearch(searchTerm));
    searchBox.appendChild(search.render());

    // Reference for paging
    const pagingSection = dom.getElementById('paging');
    this.paging = new __WEBPACK_IMPORTED_MODULE_5__search_Paging__["a" /* default */](pageIndex => this.handlePaging(pageIndex));
    pagingSection.appendChild(this.paging.render());
    
    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = App;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<header role=\"banner\">\n    <h1>Tech Face</h1>\n    <h4>Tech news for your face</h4>\n</header>\n<main id=\"main\" role=\"main\">\n    <div id=\"loading\" class=\"hidden\">Loading</div>\n    <section id=\"search\"></section>\n    <section id=\"paging\"></section>\n    <section id=\"news\"></section>\n</main>\n<footer role=\"contentinfo\">\n    <p>Articles from <a href=\"https://www.theverge.com/\" alt=\"Link to News API\" target=\"_blank\" rel=\"author noopener noreferrer\">The Verge</a> via <a href=\"https://newsapi.org/s/the-verge-api\" alt=\"Link to News API\" target=\"_blank\" rel=\"author noopener noreferrer\">NewsAPI</a> &nbsp; — &nbsp; <a href=\"https://github.com/limongoo/news-feed\" target=\"_blank\" rel\"author noopener noreferrer\">Ivan Limongan</a></p>\n</footer>";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./app.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "header {\n  padding: 2rem 2rem 1rem;\n  background-color: #ebebeb;\n}\n\nmain {\n  padding: 1rem 2rem;\n}\n\nfooter {\n  padding: 2rem;\n}\n\n.hidden {\n  display: none;\n}\n", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/news-feed/app.css"],"names":[],"mappings":"AAAA;EACE,wBAAwB;EACxB,0BAA0B;CAC3B;;AAED;EACE,mBAAmB;CACpB;;AAED;EACE,cAAc;CACf;;AAED;EACE,cAAc;CACf","file":"app.css","sourcesContent":["header {\n  padding: 2rem 2rem 1rem;\n  background-color: #ebebeb;\n}\n\nmain {\n  padding: 1rem 2rem;\n}\n\nfooter {\n  padding: 2rem;\n}\n\n.hidden {\n  display: none;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__search_html__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__search_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__search_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__search_css__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__search_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__search_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__search_html___default.a);

class Search {
  constructor(getSearch) {
    this.getSearch = getSearch;
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.searchInput.value);
    this.getSearch(this.searchInput.value);
  }

  render() {
    const dom = template.render();

    this.searchInput = dom.querySelector('input');

    const form = dom.querySelector('form');
    form.addEventListener('submit', event => this.handleSubmit(event));
    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Search;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<form role=\"search\">\n  <label class=\"clip\" for=\"search-box\">Search News</label>\n  <input placeholder=\"Start Search\" id=\"search-box\">\n  <button type=\"submit\" id=\"search-button\">Find</button>\n</form>";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./search.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./search.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "#search-box {\n  border: .4rem solid #d1d1d1;\n  width: 85%;\n  padding: 1rem;\n  vertical-align: bottom;\n  font-size: 100%;\n}\n\n#search-button {\n  background-color: #d63d00;\n  color: white;\n  font: 1.1rem \"Work Sans\", sans serif;\n  letter-spacing: 1px;\n  vertical-align: bottom;\n  text-transform: uppercase;\n  padding: 1.3rem 1.6rem;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n  margin: 1rem 0 0 0;\n}\n\n#search-button:hover {\n  background-color: #ff4800;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  #search-box {\n    width: 50%;\n  }\n}\n\n/* Tablet */\n\n@media only screen and (min-width: 480px) and (max-width: 1200px) {\n  #search-box {\n    width: 60%;\n  } \n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/news-feed/search.css"],"names":[],"mappings":"AAAA;EACE,4BAA4B;EAC5B,WAAW;EACX,cAAc;EACd,uBAAuB;EACvB,gBAAgB;CACjB;;AAED;EACE,0BAA0B;EAC1B,aAAa;EACb,qCAAqC;EACrC,oBAAoB;EACpB,uBAAuB;EACvB,0BAA0B;EAC1B,uBAAuB;EACvB,kCAA0B;EAA1B,0BAA0B;EAC1B,mBAAmB;CACpB;;AAED;EACE,0BAA0B;CAC3B;;AAED,qCAAqC;;AAErC,YAAY;;AACZ;EACE;IACE,WAAW;GACZ;CACF;;AAED,YAAY;;AACZ;EACE;IACE,WAAW;GACZ;CACF","file":"search.css","sourcesContent":["#search-box {\n  border: .4rem solid #d1d1d1;\n  width: 85%;\n  padding: 1rem;\n  vertical-align: bottom;\n  font-size: 100%;\n}\n\n#search-button {\n  background-color: #d63d00;\n  color: white;\n  font: 1.1rem \"Work Sans\", sans serif;\n  letter-spacing: 1px;\n  vertical-align: bottom;\n  text-transform: uppercase;\n  padding: 1.3rem 1.6rem;\n  transition: 0.3s ease all;\n  margin: 1rem 0 0 0;\n}\n\n#search-button:hover {\n  background-color: #ff4800;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  #search-box {\n    width: 50%;\n  }\n}\n\n/* Tablet */\n@media only screen and (min-width: 480px) and (max-width: 1200px) {\n  #search-box {\n    width: 60%;\n  } \n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_list_html__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_list_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__article_list_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Article__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__article_list_html___default.a);

class ArticleList {
  constructor(articlesConstructor) {
    this.articlesConstructor = articlesConstructor;
  }

  render() {
    const dom = template.render();
    const ul = dom.querySelector('ul');

    this.articlesConstructor
      .map(article => new __WEBPACK_IMPORTED_MODULE_1__Article__["a" /* default */](article))
      .map(articleComponent => articleComponent.render())
      .forEach(articleDom => ul.appendChild(articleDom));

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ArticleList;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "<ul class=\"list-container\"></ul>";

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_html__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__article_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__article_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__article_css__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__article_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__article_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__article_html___default.a);

class Article {
  constructor(articles) {
    // Get from api
    this.articles = articles;
  }

  render() {
    const dom = template.render();

    // Set path from api
    const article = this.articles;

    // Add content from api
    dom.querySelector('.title').textContent = article.title;
    dom.querySelector('.author').textContent = article.author;
    dom.querySelector('.publisher').textContent = article.source.name;
    dom.querySelector('.publishedAt').textContent = article.publishedAt;
    // dom.querySelector('.url').textContent = article.url;
    dom.querySelector('.description').textContent = article.description;

    // Add src and alt to images
    const img = dom.querySelector('.newsImage');
    if(article.urlToImage) {
      img.setAttribute('src', article.urlToImage);
      img.setAttribute('alt', `${article.title} by ${article.author}`);
    }
    else{
      img.classList.add('hidden');
    }

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Article;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<li class=\"article\">\n  <img class=\"newsImage\">\n  <h2 class=\"title\"></h2>\n  <p>By <span class=\"author\"></span>, from <span class=\"publisher\"></span></p>\n  <p><span class=\"publishedAt\"></span></p>\n  <p class=\"description\"></p>\n  <!-- <p class=\"url\"></p> -->\n</li>";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./article.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./article.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, ".article {\n  list-style-type: none;\n  padding: 2rem 0;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Desktop */\n\n@media screen and (min-width: 1200px) {\n  .title {\n    font-size: 1.5rem;\n    margin: 1rem 0 0;\n  }\n  \n  .list-container {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    /* max-width: 1200px; */\n    margin: 0 auto;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n  }\n\n  .article {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 28%;\n            flex: 0 0 28%;\n    padding: 2rem 1.5rem;\n  }\n\n  .article:hover {\n    background-color: rgb(233, 233, 233);\n    -webkit-transform: scale(1.02);\n            transform: scale(1.02);\n  }\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/news-feed/article.css"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,gBAAgB;EAChB,kCAA0B;EAA1B,0BAA0B;CAC3B;;AAED,qCAAqC;;AAErC,aAAa;;AACb;EACE;IACE,kBAAkB;IAClB,iBAAiB;GAClB;;EAED;IACE,qBAAc;IAAd,qBAAc;IAAd,cAAc;IACd,wBAAwB;IACxB,eAAe;IACf,oBAAgB;QAAhB,gBAAgB;GACjB;;EAED;IACE,oBAAc;QAAd,kBAAc;YAAd,cAAc;IACd,qBAAqB;GACtB;;EAED;IACE,qCAAqC;IACrC,+BAAuB;YAAvB,uBAAuB;GACxB;CACF","file":"article.css","sourcesContent":[".article {\n  list-style-type: none;\n  padding: 2rem 0;\n  transition: 0.3s ease all;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Desktop */\n@media screen and (min-width: 1200px) {\n  .title {\n    font-size: 1.5rem;\n    margin: 1rem 0 0;\n  }\n  \n  .list-container {\n    display: flex;\n    /* max-width: 1200px; */\n    margin: 0 auto;\n    flex-wrap: wrap;\n  }\n\n  .article {\n    flex: 0 0 28%;\n    padding: 2rem 1.5rem;\n  }\n\n  .article:hover {\n    background-color: rgb(233, 233, 233);\n    transform: scale(1.02);\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__paging_html__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__paging_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__paging_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__paging_css__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__paging_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__paging_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__paging_html___default.a);

class Paging {
  constructor(onPage) {
    this.onPage = onPage;
  }

  update(pageIndex, perPage, total) {
    const totalPages = Math.floor(total / perPage);
    
    this.total.textContent = `showing page ${pageIndex + 1} of ${totalPages} (${total} total results)`;
    this.pageIndex = pageIndex;
    this.previous.disabled = pageIndex <= 0;
    this.next.disabled = pageIndex >= total;
  }

  render() {
    const dom = template.render();
    
    this.total = dom.querySelector('.total');
    this.previous = dom.querySelector('.prev');
    this.next = dom.querySelector('.next');

    this.previous.addEventListener('click', () => this.onPage(this.pageIndex - 1));
    this.next.addEventListener('click', () => this.onPage(this.pageIndex + 1));

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Paging;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<div class=\"total\"></div>\n<div id=\"prev-next\">\n    <button class=\"prev\" disabled>Previous</button>\n    <button class=\"next\" disabled>Next</button>\n</div>";

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./paging.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./paging.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, ".prev, .next {\n    font-size: 0.8rem;\n    padding: .5rem;\n    background-color: rgb(241, 241, 241);\n    border: none;\n    text-transform: uppercase;\n    font-weight: 600;\n    font-family: 'Work Sans', sans-serif;\n    -webkit-transition: 0.3s ease all;\n    transition: 0.3s ease all;\n}\n\n.prev:hover, .next:hover {\n    background-color: rgb(224, 224, 224);\n}\n\n#prev-next {\n    margin: 1rem 0 1.5rem;\n}\n\n.total {\n    margin: 1rem 0 0;\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/news-feed/paging.css"],"names":[],"mappings":"AAAA;IACI,kBAAkB;IAClB,eAAe;IACf,qCAAqC;IACrC,aAAa;IACb,0BAA0B;IAC1B,iBAAiB;IACjB,qCAAqC;IACrC,kCAA0B;IAA1B,0BAA0B;CAC7B;;AAED;IACI,qCAAqC;CACxC;;AAED;IACI,sBAAsB;CACzB;;AAED;IACI,iBAAiB;CACpB","file":"paging.css","sourcesContent":[".prev, .next {\n    font-size: 0.8rem;\n    padding: .5rem;\n    background-color: rgb(241, 241, 241);\n    border: none;\n    text-transform: uppercase;\n    font-weight: 600;\n    font-family: 'Work Sans', sans-serif;\n    transition: 0.3s ease all;\n}\n\n.prev:hover, .next:hover {\n    background-color: rgb(224, 224, 224);\n}\n\n#prev-next {\n    margin: 1rem 0 1.5rem;\n}\n\n.total {\n    margin: 1rem 0 0;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = searchNews;
const KEY = 'b2829c303ae04b8e9ffff24d9926712f';
// const TECH_URL = `https://newsapi.org/v2/everything?sources=the-verge&apiKey=${KEY}`;
const TECH_URL = `https://newsapi.org/v2/everything?sources=techcrunch&apiKey=${KEY}`;

// Put in local storage
const storeLocal = window.localStorage;

function searchNews(searchTerm, pageIndex = 0) {
  const url = `${TECH_URL}&q=${searchTerm}&maxResults=6&startIndex=${pageIndex}`;
  console.log(url);

  // Get local storage
  const data = storeLocal.getItem(url);
  if(data) return Promise.resolve(JSON.parse(data));

  // Return local storage
  return fetch(url)
    .then(response => response.json())
    .then(data => {storeLocal.setItem(url, JSON.stringify(data));
      return data;
    });
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDU5N2ZkNzRjOGMwZDljYjgxMjgiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuY3NzPzZkMmIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmNzcz9jMWNiIiwid2VicGFjazovLy8uL3NyYy9tYWluLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcHAvQXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcHAvYXBwLmNzcz9hZmI2Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NlYXJjaC9TZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3NlYXJjaC5odG1sIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NlYXJjaC9zZWFyY2guY3NzPzdjMzciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3NlYXJjaC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXJ0aWNsZXMvQXJ0aWNsZUxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXJ0aWNsZXMvYXJ0aWNsZS1saXN0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXJ0aWNsZXMvQXJ0aWNsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcnRpY2xlcy9hcnRpY2xlLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXJ0aWNsZXMvYXJ0aWNsZS5jc3M/NTA3YiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcnRpY2xlcy9hcnRpY2xlLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zZWFyY2gvUGFnaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NlYXJjaC9wYWdpbmcuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zZWFyY2gvcGFnaW5nLmNzcz9mZGQxIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NlYXJjaC9wYWdpbmcuY3NzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9uZXdzQXBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGdCQUFnQjtBQUNuRCxJQUFJO0FBQ0o7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQzs7Ozs7O0FDekJBO0FBQ0E7OztBQUdBO0FBQ0EsdUNBQXdDLHdCQUF3QixxQkFBcUIsMkNBQTJDLG1CQUFtQixnQ0FBZ0MsdUJBQXVCLDJDQUEyQyx3Q0FBd0MsZ0NBQWdDLEdBQUcsOEJBQThCLDJDQUEyQyxHQUFHLGdCQUFnQiw0QkFBNEIsR0FBRyxZQUFZLHVCQUF1QixHQUFHLFFBQVEsNkdBQTZHLFlBQVksV0FBVyxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLDREQUE0RCx3QkFBd0IscUJBQXFCLDJDQUEyQyxtQkFBbUIsZ0NBQWdDLHVCQUF1QiwyQ0FBMkMsZ0NBQWdDLEdBQUcsOEJBQThCLDJDQUEyQyxHQUFHLGdCQUFnQiw0QkFBNEIsR0FBRyxZQUFZLHVCQUF1QixHQUFHLG1CQUFtQjs7QUFFNXVDOzs7Ozs7OztBQ1BBO0FBQUE7QUFDQSxrRkFBa0YsSUFBSTtBQUN0RixnRkFBZ0YsSUFBSTs7QUFFcEY7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixTQUFTLEtBQUssV0FBVywyQkFBMkIsVUFBVTtBQUMvRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsS0FBSztBQUNMIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQ1OTdmZDc0YzhjMGQ5Y2I4MTI4IiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIHN0eWxlVGFyZ2V0ID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0XHQvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXHRcdFx0aWYgKHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcblx0XHRcdFx0XHQvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBzdHlsZVRhcmdldDtcblx0XHR9XG5cdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdH07XG59KShmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcbn0pO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09IFwiYm9vbGVhblwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwib2JqZWN0XCIgJiYgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpIHtcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50byArIFwiIFwiICsgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIG5leHRTaWJsaW5nKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJbU3R5bGUgTG9hZGVyXVxcblxcbiBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0JyAoJ29wdGlvbnMuaW5zZXJ0QXQnKSBmb3VuZC5cXG4gTXVzdCBiZSAndG9wJywgJ2JvdHRvbScsIG9yIE9iamVjdC5cXG4gKGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyI2luc2VydGF0KVxcblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGUge1xuICBjb25zdHJ1Y3RvcihodG1sKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlLmNvbnRlbnQ7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvVGVtcGxhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICcuL3Jlc2V0LmNzcyc7XG5pbXBvcnQgJy4vbWFpbi5jc3MnO1xuaW1wb3J0IEFwcCBmcm9tICcuL2NvbXBvbmVudHMvYXBwL0FwcCc7XG5cbmNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5yb290LmFwcGVuZENoaWxkKGFwcC5yZW5kZXIoKSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcmVzZXQuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcInNvdXJjZU1hcFwiOnRydWUsXCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcmVzZXQuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9yZXNldC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Jlc2V0LmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsIGJvZHksIGRpdiwgc3BhbiwgYXBwbGV0LCBvYmplY3QsIGlmcmFtZSwgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgcHJlLCBhLCBhYmJyLCBhY3JvbnltLCBhZGRyZXNzLCBiaWcsIGNpdGUsIGNvZGUsIGRlbCwgZGZuLCBlbSwgaW1nLCBpbnMsIGtiZCwgcSwgcywgc2FtcCwgc21hbGwsIHN0cmlrZSwgc3Ryb25nLCBzdWIsIHN1cCwgdHQsIHZhciwgYiwgdSwgaSwgY2VudGVyLCBkbCwgZHQsIGRkLCBvbCwgdWwsIGxpLCBmaWVsZHNldCwgZm9ybSwgbGFiZWwsIGxlZ2VuZCwgdGFibGUsIGNhcHRpb24sIHRib2R5LCB0Zm9vdCwgdGhlYWQsIHRyLCB0aCwgdGQsIGFydGljbGUsIGFzaWRlLCBjYW52YXMsIGRldGFpbHMsIGVtYmVkLCBmaWd1cmUsIGZpZ2NhcHRpb24sIGZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIG1lbnUsIG5hdiwgb3V0cHV0LCBydWJ5LCBzZWN0aW9uLCBzdW1tYXJ5LCB0aW1lLCBtYXJrLCBhdWRpbywgdmlkZW8ge1xcblxcdG1hcmdpbjogMDtcXG5cXHRwYWRkaW5nOiAwO1xcblxcdGJvcmRlcjogMDtcXG5cXHRmb250LXNpemU6IDEwMCU7XFxuXFx0Zm9udDogaW5oZXJpdDtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cXG5cXG5hcnRpY2xlLCBhc2lkZSwgZGV0YWlscywgZmlnY2FwdGlvbiwgZmlndXJlLCBmb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIHNlY3Rpb24ge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG5ib2R5IHtcXG5cXHRsaW5lLWhlaWdodDogMTtcXG59XFxuXFxubmF2IG9sLCBuYXYgdWwge1xcblxcdGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcblxcbmJsb2NrcXVvdGUsIHEge1xcblxcdHF1b3Rlczogbm9uZTtcXG59XFxuXFxuYmxvY2txdW90ZTpiZWZvcmUsIGJsb2NrcXVvdGU6YWZ0ZXIsIHE6YmVmb3JlLCBxOmFmdGVyIHtcXG5cXHRjb250ZW50OiAnJztcXG5cXHRjb250ZW50OiBub25lO1xcbn1cXG5cXG50YWJsZSB7XFxuXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cXHRib3JkZXItc3BhY2luZzogMDtcXG59XFxuXFxuc3Ryb25nIHtmb250LXdlaWdodDogYm9sZDt9XFxuXFxuZW0ge2ZvbnQtc3R5bGU6IGl0YWxpYzt9XCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi9Vc2Vycy9pdmFubGltb25nYW4vRG9jdW1lbnRzLzQwMS9uZXdzLWZlZWQvcmVzZXQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7RUFHRTs7QUFFRjtDQWFDLFVBQVU7Q0FDVixXQUFXO0NBQ1gsVUFBVTtDQUNWLGdCQUFnQjtDQUNoQixjQUFjO0NBQ2QseUJBQXlCO0NBQ3pCOztBQUNELGlEQUFpRDs7QUFDakQ7Q0FFQyxlQUFlO0NBQ2Y7O0FBQ0Q7Q0FDQyxlQUFlO0NBQ2Y7O0FBQ0Q7Q0FDQyxpQkFBaUI7Q0FDakI7O0FBQ0Q7Q0FDQyxhQUFhO0NBQ2I7O0FBQ0Q7Q0FFQyxZQUFZO0NBQ1osY0FBYztDQUNkOztBQUNEO0NBQ0MsMEJBQTBCO0NBQzFCLGtCQUFrQjtDQUNsQjs7QUFDRCxRQUFRLGtCQUFrQixDQUFDOztBQUMzQixJQUFJLG1CQUFtQixDQUFDXCIsXCJmaWxlXCI6XCJyZXNldC5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsIGJvZHksIGRpdiwgc3BhbiwgYXBwbGV0LCBvYmplY3QsIGlmcmFtZSxcXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBwLCBibG9ja3F1b3RlLCBwcmUsXFxuYSwgYWJiciwgYWNyb255bSwgYWRkcmVzcywgYmlnLCBjaXRlLCBjb2RlLFxcbmRlbCwgZGZuLCBlbSwgaW1nLCBpbnMsIGtiZCwgcSwgcywgc2FtcCxcXG5zbWFsbCwgc3RyaWtlLCBzdHJvbmcsIHN1Yiwgc3VwLCB0dCwgdmFyLFxcbmIsIHUsIGksIGNlbnRlcixcXG5kbCwgZHQsIGRkLCBvbCwgdWwsIGxpLFxcbmZpZWxkc2V0LCBmb3JtLCBsYWJlbCwgbGVnZW5kLFxcbnRhYmxlLCBjYXB0aW9uLCB0Ym9keSwgdGZvb3QsIHRoZWFkLCB0ciwgdGgsIHRkLFxcbmFydGljbGUsIGFzaWRlLCBjYW52YXMsIGRldGFpbHMsIGVtYmVkLCBcXG5maWd1cmUsIGZpZ2NhcHRpb24sIGZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIFxcbm1lbnUsIG5hdiwgb3V0cHV0LCBydWJ5LCBzZWN0aW9uLCBzdW1tYXJ5LFxcbnRpbWUsIG1hcmssIGF1ZGlvLCB2aWRlbyB7XFxuXFx0bWFyZ2luOiAwO1xcblxcdHBhZGRpbmc6IDA7XFxuXFx0Ym9yZGVyOiAwO1xcblxcdGZvbnQtc2l6ZTogMTAwJTtcXG5cXHRmb250OiBpbmhlcml0O1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xcbmFydGljbGUsIGFzaWRlLCBkZXRhaWxzLCBmaWdjYXB0aW9uLCBmaWd1cmUsIFxcbmZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIG1lbnUsIG5hdiwgc2VjdGlvbiB7XFxuXFx0ZGlzcGxheTogYmxvY2s7XFxufVxcbmJvZHkge1xcblxcdGxpbmUtaGVpZ2h0OiAxO1xcbn1cXG5uYXYgb2wsIG5hdiB1bCB7XFxuXFx0bGlzdC1zdHlsZTogbm9uZTtcXG59XFxuYmxvY2txdW90ZSwgcSB7XFxuXFx0cXVvdGVzOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlOmJlZm9yZSwgYmxvY2txdW90ZTphZnRlcixcXG5xOmJlZm9yZSwgcTphZnRlciB7XFxuXFx0Y29udGVudDogJyc7XFxuXFx0Y29udGVudDogbm9uZTtcXG59XFxudGFibGUge1xcblxcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuXFx0Ym9yZGVyLXNwYWNpbmc6IDA7XFxufVxcbnN0cm9uZyB7Zm9udC13ZWlnaHQ6IGJvbGQ7fVxcbmVtIHtmb250LXN0eWxlOiBpdGFsaWM7fVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcImltcG9ydExvYWRlcnNcIjoxLFwic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL3Jlc2V0LmNzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vbWFpbi5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9tYWluLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vbWFpbi5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21haW4uY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiAnV29yayBTYW5zJywgc2Fucy1zZXJpZjtcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICBjb2xvcjogcmdiKDczLCA3MywgNzMpO1xcbn1cXG5cXG5wIHtcXG4gIG1hcmdpbi1ib3R0b206IDEuM2VtO1xcbiAgbGluZS1oZWlnaHQ6IDEuNztcXG59XFxuXFxuLyogRm9udCBzaXppbmcgZnJvbSBodHRwOi8vdHlwZS1zY2FsZS5jb20vICovXFxuXFxuaDEsIGgyLCBoMywgaDQge1xcbiAgLyogbWFyZ2luOiAxZW0gMCAwLjVlbTsgKi9cXG4gIGxpbmUtaGVpZ2h0OiAxLjE7XFxuICBsZXR0ZXItc3BhY2luZzogMnB4O1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIHBhZGRpbmc6IDAgMCAxcmVtIDA7XFxufVxcblxcbmgxIHtcXG4gIG1hcmdpbi10b3A6IDA7XFxuICBmb250LXNpemU6IDMuNTk4ZW07XFxufVxcblxcbmgyIHtmb250LXNpemU6IDIuODI3ZW07fVxcblxcbmgzIHtmb250LXNpemU6IDEuOTk5ZW07fVxcblxcbmg0IHtmb250LXNpemU6IDEuNDE0ZW07fVxcblxcbmZpZ2NhcHRpb24sIHNtYWxsLCAuZm9udF9zbWFsbCB7Zm9udC1zaXplOiAwLjhlbTt9XFxuXFxuLyogaGlkZSBzY3JlZW4tcmVhZGVyIG9ubHkgdGV4dC4gaHR0cHM6Ly93ZWJhaW0ub3JnL3RlY2huaXF1ZXMvY3NzL2ludmlzaWJsZWNvbnRlbnQvICovXFxuXFxuLmNsaXAge1xcbiAgcG9zaXRpb246IGFic29sdXRlICFpbXBvcnRhbnQ7XFxuICBjbGlwOiByZWN0KDFweCAxcHggMXB4IDFweCk7IC8qIElFNiwgSUU3ICovXFxuICBjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7XFxufVxcblxcbmltZyB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG5hIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGNvbG9yOiAjZDYzZDAwO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gIHBhZGRpbmc6IDAgMCAzcHg7XFxuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgd2hpdGU7XFxufVxcblxcbmE6aG92ZXIge1xcbiAgY29sb3I6ICNkNjNkMDA7XFxuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgI2Q2M2QwMDtcXG59XFxuXFxuLyogIC0tLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcblxcbi8qIE1vYmlsZSAqL1xcblxcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMzIwcHgpIGFuZCAobWF4LXdpZHRoOiA0ODBweCkge1xcbiAgaDEge1xcbiAgICBtYXJnaW4tdG9wOiAwO1xcbiAgICBmb250LXNpemU6IDIuMDc0ZW07XFxuICB9XFxuICBcXG4gIGgyIHtcXG4gICAgZm9udC1zaXplOiAxLjcyOGVtO1xcbiAgfVxcbiAgXFxuICBoMyB7XFxuICAgIGZvbnQtc2l6ZTogMS40NGVtO1xcbiAgfVxcbiAgXFxuICBoNCB7XFxuICAgIGZvbnQtc2l6ZTogMS4yZW07XFxuICB9XFxufVxcblxcbi8qIFRhYmxldCAqL1xcblxcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNDgwcHgpIGFuZCAobWF4LXdpZHRoOiAxMjAwcHgpIHtcXG4gIGgxIHtcXG4gICAgICBmb250LXNpemU6IDIuOTU3ZW07XFxuICB9XFxuXFxuICBoMiB7XFxuICAgICAgZm9udC1zaXplOiAyLjM2OWVtO1xcbiAgfVxcblxcbiAgaDMge1xcbiAgICAgIGZvbnQtc2l6ZTogMS43NzdlbTtcXG4gIH1cXG5cXG4gIGg0IHtcXG4gICAgICBmb250LXNpemU6IDEuMzMzZW07XFxuICB9XFxufVwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvVXNlcnMvaXZhbmxpbW9uZ2FuL0RvY3VtZW50cy80MDEvbmV3cy1mZWVkL21haW4uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UscUNBQXFDO0VBQ3JDLGlCQUFpQjtFQUNqQix1QkFBdUI7Q0FDeEI7O0FBRUQ7RUFDRSxxQkFBcUI7RUFDckIsaUJBQWlCO0NBQ2xCOztBQUVELDZDQUE2Qzs7QUFDN0M7RUFDRSwwQkFBMEI7RUFDMUIsaUJBQWlCO0VBQ2pCLG9CQUFvQjtFQUNwQiwwQkFBMEI7RUFDMUIsb0JBQW9CO0NBQ3JCOztBQUVEO0VBQ0UsY0FBYztFQUNkLG1CQUFtQjtDQUNwQjs7QUFFRCxJQUFJLG1CQUFtQixDQUFDOztBQUV4QixJQUFJLG1CQUFtQixDQUFDOztBQUV4QixJQUFJLG1CQUFtQixDQUFDOztBQUV4QixnQ0FBZ0MsaUJBQWlCLENBQUM7O0FBRWxELHVGQUF1Rjs7QUFDdkY7RUFDRSw4QkFBOEI7RUFDOUIsNEJBQTRCLENBQUMsY0FBYztFQUMzQywrQkFBK0I7Q0FDaEM7O0FBRUQ7RUFDRSxlQUFlO0VBQ2YsWUFBWTtFQUNaLGFBQWE7Q0FDZDs7QUFFRDtFQUNFLHNCQUFzQjtFQUN0QixlQUFlO0VBQ2Ysa0NBQTBCO0VBQTFCLDBCQUEwQjtFQUMxQixpQkFBaUI7RUFDakIsK0JBQStCO0NBQ2hDOztBQUVEO0VBQ0UsZUFBZTtFQUNmLGlDQUFpQztDQUNsQzs7QUFFRCxxQ0FBcUM7O0FBRXJDLFlBQVk7O0FBQ1o7RUFDRTtJQUNFLGNBQWM7SUFDZCxtQkFBbUI7R0FDcEI7O0VBRUQ7SUFDRSxtQkFBbUI7R0FDcEI7O0VBRUQ7SUFDRSxrQkFBa0I7R0FDbkI7O0VBRUQ7SUFDRSxpQkFBaUI7R0FDbEI7Q0FDRjs7QUFFRCxZQUFZOztBQUNaO0VBQ0U7TUFDSSxtQkFBbUI7R0FDdEI7O0VBRUQ7TUFDSSxtQkFBbUI7R0FDdEI7O0VBRUQ7TUFDSSxtQkFBbUI7R0FDdEI7O0VBRUQ7TUFDSSxtQkFBbUI7R0FDdEI7Q0FDRlwiLFwiZmlsZVwiOlwibWFpbi5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiYm9keSB7XFxuICBmb250LWZhbWlseTogJ1dvcmsgU2FucycsIHNhbnMtc2VyaWY7XFxuICBmb250LXdlaWdodDogNTAwO1xcbiAgY29sb3I6IHJnYig3MywgNzMsIDczKTtcXG59XFxuXFxucCB7XFxuICBtYXJnaW4tYm90dG9tOiAxLjNlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjc7XFxufVxcblxcbi8qIEZvbnQgc2l6aW5nIGZyb20gaHR0cDovL3R5cGUtc2NhbGUuY29tLyAqL1xcbmgxLCBoMiwgaDMsIGg0IHtcXG4gIC8qIG1hcmdpbjogMWVtIDAgMC41ZW07ICovXFxuICBsaW5lLWhlaWdodDogMS4xO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDJweDtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBwYWRkaW5nOiAwIDAgMXJlbSAwO1xcbn1cXG5cXG5oMSB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgZm9udC1zaXplOiAzLjU5OGVtO1xcbn1cXG5cXG5oMiB7Zm9udC1zaXplOiAyLjgyN2VtO31cXG5cXG5oMyB7Zm9udC1zaXplOiAxLjk5OWVtO31cXG5cXG5oNCB7Zm9udC1zaXplOiAxLjQxNGVtO31cXG5cXG5maWdjYXB0aW9uLCBzbWFsbCwgLmZvbnRfc21hbGwge2ZvbnQtc2l6ZTogMC44ZW07fVxcblxcbi8qIGhpZGUgc2NyZWVuLXJlYWRlciBvbmx5IHRleHQuIGh0dHBzOi8vd2ViYWltLm9yZy90ZWNobmlxdWVzL2Nzcy9pbnZpc2libGVjb250ZW50LyAqL1xcbi5jbGlwIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xcbiAgY2xpcDogcmVjdCgxcHggMXB4IDFweCAxcHgpOyAvKiBJRTYsIElFNyAqL1xcbiAgY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpO1xcbn1cXG5cXG5pbWcge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogYXV0bztcXG59XFxuXFxuYSB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjb2xvcjogI2Q2M2QwMDtcXG4gIHRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICBwYWRkaW5nOiAwIDAgM3B4O1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHdoaXRlO1xcbn1cXG5cXG5hOmhvdmVyIHtcXG4gIGNvbG9yOiAjZDYzZDAwO1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICNkNjNkMDA7XFxufVxcblxcbi8qICAtLS0tLS0tLSBNZWRpYSBRdWVyaWVzIC0tLS0tLS0gKi9cXG5cXG4vKiBNb2JpbGUgKi9cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDMyMHB4KSBhbmQgKG1heC13aWR0aDogNDgwcHgpIHtcXG4gIGgxIHtcXG4gICAgbWFyZ2luLXRvcDogMDtcXG4gICAgZm9udC1zaXplOiAyLjA3NGVtO1xcbiAgfVxcbiAgXFxuICBoMiB7XFxuICAgIGZvbnQtc2l6ZTogMS43MjhlbTtcXG4gIH1cXG4gIFxcbiAgaDMge1xcbiAgICBmb250LXNpemU6IDEuNDRlbTtcXG4gIH1cXG4gIFxcbiAgaDQge1xcbiAgICBmb250LXNpemU6IDEuMmVtO1xcbiAgfVxcbn1cXG5cXG4vKiBUYWJsZXQgKi9cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDQ4MHB4KSBhbmQgKG1heC13aWR0aDogMTIwMHB4KSB7XFxuICBoMSB7XFxuICAgICAgZm9udC1zaXplOiAyLjk1N2VtO1xcbiAgfVxcblxcbiAgaDIge1xcbiAgICAgIGZvbnQtc2l6ZTogMi4zNjllbTtcXG4gIH1cXG5cXG4gIGgzIHtcXG4gICAgICBmb250LXNpemU6IDEuNzc3ZW07XFxuICB9XFxuXFxuICBoNCB7XFxuICAgICAgZm9udC1zaXplOiAxLjMzM2VtO1xcbiAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWV9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9tYWluLmNzc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBCYXNpYyBpbXBvcnRzXG5pbXBvcnQgaHRtbCBmcm9tICcuL2FwcC5odG1sJztcbmltcG9ydCAnLi9hcHAuY3NzJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi9UZW1wbGF0ZSc7XG5pbXBvcnQgU2VhcmNoIGZyb20gJy4uL3NlYXJjaC9TZWFyY2gnO1xuaW1wb3J0IEFydGljbGVMaXN0IGZyb20gJy4uL2FydGljbGVzL0FydGljbGVMaXN0JztcbmltcG9ydCBQYWdpbmcgZnJvbSAnLi4vc2VhcmNoL1BhZ2luZyc7XG5pbXBvcnQgeyBzZWFyY2hOZXdzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmV3c0FwaSc7XG5cblxuY29uc3QgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoaHRtbCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCB7XG4gIFxuICAvLyBTZXR0aW5nIHNlYXJjaCB2YWx1ZXNcbiAgaGFuZGxlU2VhcmNoKHNlYXJjaFRlcm0pIHtcbiAgICB0aGlzLnNlYXJjaFRlcm0gPSBzZWFyY2hUZXJtO1xuICAgIHRoaXMucGFnZUluZGV4ID0gMDtcbiAgICB0aGlzLnJ1blNlYXJjaCgpO1xuICB9XG4gIFxuICAvLyBQYWdpbmdcbiAgaGFuZGxlUGFnaW5nKHBhZ2VJbmRleCkge1xuICAgIHRoaXMucGFnZUluZGV4ID0gcGFnZUluZGV4O1xuICAgIHRoaXMucnVuU2VhcmNoKCk7XG4gIH1cblxuICAvLyBSdW4gc2VhcmNoIGZ1bmN0aW9uXG4gIHJ1blNlYXJjaCgpIHtcblxuICAgIHRoaXMubG9hZGluZy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblxuICAgIHNlYXJjaE5ld3ModGhpcy5zZWFyY2hUZXJtLCB0aGlzLnBhZ2VJbmRleClcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgICAvLyBhcnRpY2xlcyBhbmQgdG90YWxSZXN1bHRzIGZyb20gYXBpXG4gICAgICAgIGNvbnN0IG5ld3NBcnRpY2xlcyA9IGRhdGEuYXJ0aWNsZXM7XG4gICAgICAgIGNvbnN0IHRvdGFsID0gZGF0YS50b3RhbFJlc3VsdHM7XG5cbiAgICAgICAgY29uc3QgYXJ0aWNsZXNTZWN0aW9uID0gdGhpcy5hcnRpY2xlc1NlY3Rpb247XG5cbiAgICAgICAgd2hpbGUoYXJ0aWNsZXNTZWN0aW9uLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgIGFydGljbGVzU2VjdGlvbi5yZW1vdmVDaGlsZChhcnRpY2xlc1NlY3Rpb24ubGFzdENoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFydGljbGVMaXN0ID0gbmV3IEFydGljbGVMaXN0KG5ld3NBcnRpY2xlcyk7XG4gICAgICAgIGFydGljbGVzU2VjdGlvbi5hcHBlbmRDaGlsZChhcnRpY2xlTGlzdC5yZW5kZXIoKSk7XG5cbiAgICAgICAgLy8gcGFnaW5nIHVwZGF0ZVxuICAgICAgICB0aGlzLnBhZ2luZy51cGRhdGUodGhpcy5wYWdlSW5kZXgsIDYsIHRvdGFsLCB0aGlzLnNlYXJjaFRlcm0pO1xuICAgICAgICB0aGlzLmxvYWRpbmcuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5yZW5kZXIoKTtcblxuICAgIHRoaXMubG9hZGluZyA9IGRvbS5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpO1xuXG4gICAgLy8gUmVmZXJlbmNlIGZvciBuZXcgc2VjdGlvblxuICAgIHRoaXMuYXJ0aWNsZXNTZWN0aW9uID0gZG9tLmdldEVsZW1lbnRCeUlkKCduZXdzJyk7XG5cbiAgICAvLyBSZWZlcmVuY2Ugc2VhcmNoIGZyb20gU2VhcmNoLmpzIGFuZCBwbGFjZSB0byBkb21cbiAgICBjb25zdCBzZWFyY2hCb3ggPSBkb20uZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaCcpO1xuXG4gICAgLy8gc2VhcmNoID0+IHRoaXMuaGFuZGxlU2VhcmNoKHNlYXJjaCkgaW4gU2VhcmNoKCkgLSBsaW5rZWQgdG8gU2VhcmNoKCkgaW4gU2VhcmNoLmpzXG4gICAgY29uc3Qgc2VhcmNoID0gbmV3IFNlYXJjaChzZWFyY2hUZXJtID0+IHRoaXMuaGFuZGxlU2VhcmNoKHNlYXJjaFRlcm0pKTtcbiAgICBzZWFyY2hCb3guYXBwZW5kQ2hpbGQoc2VhcmNoLnJlbmRlcigpKTtcblxuICAgIC8vIFJlZmVyZW5jZSBmb3IgcGFnaW5nXG4gICAgY29uc3QgcGFnaW5nU2VjdGlvbiA9IGRvbS5nZXRFbGVtZW50QnlJZCgncGFnaW5nJyk7XG4gICAgdGhpcy5wYWdpbmcgPSBuZXcgUGFnaW5nKHBhZ2VJbmRleCA9PiB0aGlzLmhhbmRsZVBhZ2luZyhwYWdlSW5kZXgpKTtcbiAgICBwYWdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMucGFnaW5nLnJlbmRlcigpKTtcbiAgICBcbiAgICByZXR1cm4gZG9tO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9hcHAvQXBwLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8aGVhZGVyIHJvbGU9XFxcImJhbm5lclxcXCI+XFxuICAgIDxoMT5UZWNoIEZhY2U8L2gxPlxcbiAgICA8aDQ+VGVjaCBuZXdzIGZvciB5b3VyIGZhY2U8L2g0PlxcbjwvaGVhZGVyPlxcbjxtYWluIGlkPVxcXCJtYWluXFxcIiByb2xlPVxcXCJtYWluXFxcIj5cXG4gICAgPGRpdiBpZD1cXFwibG9hZGluZ1xcXCIgY2xhc3M9XFxcImhpZGRlblxcXCI+TG9hZGluZzwvZGl2PlxcbiAgICA8c2VjdGlvbiBpZD1cXFwic2VhcmNoXFxcIj48L3NlY3Rpb24+XFxuICAgIDxzZWN0aW9uIGlkPVxcXCJwYWdpbmdcXFwiPjwvc2VjdGlvbj5cXG4gICAgPHNlY3Rpb24gaWQ9XFxcIm5ld3NcXFwiPjwvc2VjdGlvbj5cXG48L21haW4+XFxuPGZvb3RlciByb2xlPVxcXCJjb250ZW50aW5mb1xcXCI+XFxuICAgIDxwPkFydGljbGVzIGZyb20gPGEgaHJlZj1cXFwiaHR0cHM6Ly93d3cudGhldmVyZ2UuY29tL1xcXCIgYWx0PVxcXCJMaW5rIHRvIE5ld3MgQVBJXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCIgcmVsPVxcXCJhdXRob3Igbm9vcGVuZXIgbm9yZWZlcnJlclxcXCI+VGhlIFZlcmdlPC9hPiB2aWEgPGEgaHJlZj1cXFwiaHR0cHM6Ly9uZXdzYXBpLm9yZy9zL3RoZS12ZXJnZS1hcGlcXFwiIGFsdD1cXFwiTGluayB0byBOZXdzIEFQSVxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIHJlbD1cXFwiYXV0aG9yIG5vb3BlbmVyIG5vcmVmZXJyZXJcXFwiPk5ld3NBUEk8L2E+ICZuYnNwOyDigJQgJm5ic3A7IDxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9saW1vbmdvby9uZXdzLWZlZWRcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIiByZWxcXFwiYXV0aG9yIG5vb3BlbmVyIG5vcmVmZXJyZXJcXFwiPkl2YW4gTGltb25nYW48L2E+PC9wPlxcbjwvZm9vdGVyPlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvYXBwL2FwcC5odG1sXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vYXBwLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2FwcC5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2FwcC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJoZWFkZXIge1xcbiAgcGFkZGluZzogMnJlbSAycmVtIDFyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWJlYmViO1xcbn1cXG5cXG5tYWluIHtcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXG59XFxuXFxuZm9vdGVyIHtcXG4gIHBhZGRpbmc6IDJyZW07XFxufVxcblxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi9Vc2Vycy9pdmFubGltb25nYW4vRG9jdW1lbnRzLzQwMS9uZXdzLWZlZWQvYXBwLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHdCQUF3QjtFQUN4QiwwQkFBMEI7Q0FDM0I7O0FBRUQ7RUFDRSxtQkFBbUI7Q0FDcEI7O0FBRUQ7RUFDRSxjQUFjO0NBQ2Y7O0FBRUQ7RUFDRSxjQUFjO0NBQ2ZcIixcImZpbGVcIjpcImFwcC5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiaGVhZGVyIHtcXG4gIHBhZGRpbmc6IDJyZW0gMnJlbSAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ViZWJlYjtcXG59XFxuXFxubWFpbiB7XFxuICBwYWRkaW5nOiAxcmVtIDJyZW07XFxufVxcblxcbmZvb3RlciB7XFxuICBwYWRkaW5nOiAycmVtO1xcbn1cXG5cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcImltcG9ydExvYWRlcnNcIjoxLFwic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBodG1sIGZyb20gJy4vc2VhcmNoLmh0bWwnO1xuaW1wb3J0ICcuL3NlYXJjaC5jc3MnO1xuaW1wb3J0IFRlbXBsYXRlIGZyb20gJy4uL1RlbXBsYXRlJztcblxuY29uc3QgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoaHRtbCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKGdldFNlYXJjaCkge1xuICAgIHRoaXMuZ2V0U2VhcmNoID0gZ2V0U2VhcmNoO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNlYXJjaElucHV0LnZhbHVlKTtcbiAgICB0aGlzLmdldFNlYXJjaCh0aGlzLnNlYXJjaElucHV0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5yZW5kZXIoKTtcblxuICAgIHRoaXMuc2VhcmNoSW5wdXQgPSBkb20ucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcblxuICAgIGNvbnN0IGZvcm0gPSBkb20ucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZXZlbnQgPT4gdGhpcy5oYW5kbGVTdWJtaXQoZXZlbnQpKTtcbiAgICByZXR1cm4gZG9tO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9zZWFyY2gvU2VhcmNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGZvcm0gcm9sZT1cXFwic2VhcmNoXFxcIj5cXG4gIDxsYWJlbCBjbGFzcz1cXFwiY2xpcFxcXCIgZm9yPVxcXCJzZWFyY2gtYm94XFxcIj5TZWFyY2ggTmV3czwvbGFiZWw+XFxuICA8aW5wdXQgcGxhY2Vob2xkZXI9XFxcIlN0YXJ0IFNlYXJjaFxcXCIgaWQ9XFxcInNlYXJjaC1ib3hcXFwiPlxcbiAgPGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGlkPVxcXCJzZWFyY2gtYnV0dG9uXFxcIj5GaW5kPC9idXR0b24+XFxuPC9mb3JtPlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3NlYXJjaC5odG1sXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vc2VhcmNoLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3NlYXJjaC5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3NlYXJjaC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3NlYXJjaC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIjc2VhcmNoLWJveCB7XFxuICBib3JkZXI6IC40cmVtIHNvbGlkICNkMWQxZDE7XFxuICB3aWR0aDogODUlO1xcbiAgcGFkZGluZzogMXJlbTtcXG4gIHZlcnRpY2FsLWFsaWduOiBib3R0b207XFxuICBmb250LXNpemU6IDEwMCU7XFxufVxcblxcbiNzZWFyY2gtYnV0dG9uIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNkNjNkMDA7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250OiAxLjFyZW0gXFxcIldvcmsgU2Fuc1xcXCIsIHNhbnMgc2VyaWY7XFxuICBsZXR0ZXItc3BhY2luZzogMXB4O1xcbiAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBwYWRkaW5nOiAxLjNyZW0gMS42cmVtO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gIG1hcmdpbjogMXJlbSAwIDAgMDtcXG59XFxuXFxuI3NlYXJjaC1idXR0b246aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNDgwMDtcXG59XFxuXFxuLyogIC0tLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcblxcbi8qIE1vYmlsZSAqL1xcblxcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMzIwcHgpIGFuZCAobWF4LXdpZHRoOiA0ODBweCkge1xcbiAgI3NlYXJjaC1ib3gge1xcbiAgICB3aWR0aDogNTAlO1xcbiAgfVxcbn1cXG5cXG4vKiBUYWJsZXQgKi9cXG5cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDQ4MHB4KSBhbmQgKG1heC13aWR0aDogMTIwMHB4KSB7XFxuICAjc2VhcmNoLWJveCB7XFxuICAgIHdpZHRoOiA2MCU7XFxuICB9IFxcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL25ld3MtZmVlZC9zZWFyY2guY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsNEJBQTRCO0VBQzVCLFdBQVc7RUFDWCxjQUFjO0VBQ2QsdUJBQXVCO0VBQ3ZCLGdCQUFnQjtDQUNqQjs7QUFFRDtFQUNFLDBCQUEwQjtFQUMxQixhQUFhO0VBQ2IscUNBQXFDO0VBQ3JDLG9CQUFvQjtFQUNwQix1QkFBdUI7RUFDdkIsMEJBQTBCO0VBQzFCLHVCQUF1QjtFQUN2QixrQ0FBMEI7RUFBMUIsMEJBQTBCO0VBQzFCLG1CQUFtQjtDQUNwQjs7QUFFRDtFQUNFLDBCQUEwQjtDQUMzQjs7QUFFRCxxQ0FBcUM7O0FBRXJDLFlBQVk7O0FBQ1o7RUFDRTtJQUNFLFdBQVc7R0FDWjtDQUNGOztBQUVELFlBQVk7O0FBQ1o7RUFDRTtJQUNFLFdBQVc7R0FDWjtDQUNGXCIsXCJmaWxlXCI6XCJzZWFyY2guY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiNzZWFyY2gtYm94IHtcXG4gIGJvcmRlcjogLjRyZW0gc29saWQgI2QxZDFkMTtcXG4gIHdpZHRoOiA4NSU7XFxuICBwYWRkaW5nOiAxcmVtO1xcbiAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcXG4gIGZvbnQtc2l6ZTogMTAwJTtcXG59XFxuXFxuI3NlYXJjaC1idXR0b24ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q2M2QwMDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGZvbnQ6IDEuMXJlbSBcXFwiV29yayBTYW5zXFxcIiwgc2FucyBzZXJpZjtcXG4gIGxldHRlci1zcGFjaW5nOiAxcHg7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIHBhZGRpbmc6IDEuM3JlbSAxLjZyZW07XFxuICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgbWFyZ2luOiAxcmVtIDAgMCAwO1xcbn1cXG5cXG4jc2VhcmNoLWJ1dHRvbjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY0ODAwO1xcbn1cXG5cXG4vKiAgLS0tLS0tLS0gTWVkaWEgUXVlcmllcyAtLS0tLS0tICovXFxuXFxuLyogTW9iaWxlICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAzMjBweCkgYW5kIChtYXgtd2lkdGg6IDQ4MHB4KSB7XFxuICAjc2VhcmNoLWJveCB7XFxuICAgIHdpZHRoOiA1MCU7XFxuICB9XFxufVxcblxcbi8qIFRhYmxldCAqL1xcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNDgwcHgpIGFuZCAobWF4LXdpZHRoOiAxMjAwcHgpIHtcXG4gICNzZWFyY2gtYm94IHtcXG4gICAgd2lkdGg6IDYwJTtcXG4gIH0gXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcImltcG9ydExvYWRlcnNcIjoxLFwic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3NlYXJjaC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBodG1sIGZyb20gJy4vYXJ0aWNsZS1saXN0Lmh0bWwnO1xuaW1wb3J0IEFydGljbGUgZnJvbSAnLi9BcnRpY2xlJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi9UZW1wbGF0ZSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKGFydGljbGVzQ29uc3RydWN0b3IpIHtcbiAgICB0aGlzLmFydGljbGVzQ29uc3RydWN0b3IgPSBhcnRpY2xlc0NvbnN0cnVjdG9yO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRvbSA9IHRlbXBsYXRlLnJlbmRlcigpO1xuICAgIGNvbnN0IHVsID0gZG9tLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG5cbiAgICB0aGlzLmFydGljbGVzQ29uc3RydWN0b3JcbiAgICAgIC5tYXAoYXJ0aWNsZSA9PiBuZXcgQXJ0aWNsZShhcnRpY2xlKSlcbiAgICAgIC5tYXAoYXJ0aWNsZUNvbXBvbmVudCA9PiBhcnRpY2xlQ29tcG9uZW50LnJlbmRlcigpKVxuICAgICAgLmZvckVhY2goYXJ0aWNsZURvbSA9PiB1bC5hcHBlbmRDaGlsZChhcnRpY2xlRG9tKSk7XG5cbiAgICByZXR1cm4gZG9tO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9hcnRpY2xlcy9BcnRpY2xlTGlzdC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjx1bCBjbGFzcz1cXFwibGlzdC1jb250YWluZXJcXFwiPjwvdWw+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9hcnRpY2xlcy9hcnRpY2xlLWxpc3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGh0bWwgZnJvbSAnLi9hcnRpY2xlLmh0bWwnO1xuaW1wb3J0ICcuL2FydGljbGUuY3NzJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi9UZW1wbGF0ZSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIHtcbiAgY29uc3RydWN0b3IoYXJ0aWNsZXMpIHtcbiAgICAvLyBHZXQgZnJvbSBhcGlcbiAgICB0aGlzLmFydGljbGVzID0gYXJ0aWNsZXM7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZG9tID0gdGVtcGxhdGUucmVuZGVyKCk7XG5cbiAgICAvLyBTZXQgcGF0aCBmcm9tIGFwaVxuICAgIGNvbnN0IGFydGljbGUgPSB0aGlzLmFydGljbGVzO1xuXG4gICAgLy8gQWRkIGNvbnRlbnQgZnJvbSBhcGlcbiAgICBkb20ucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQgPSBhcnRpY2xlLnRpdGxlO1xuICAgIGRvbS5xdWVyeVNlbGVjdG9yKCcuYXV0aG9yJykudGV4dENvbnRlbnQgPSBhcnRpY2xlLmF1dGhvcjtcbiAgICBkb20ucXVlcnlTZWxlY3RvcignLnB1Ymxpc2hlcicpLnRleHRDb250ZW50ID0gYXJ0aWNsZS5zb3VyY2UubmFtZTtcbiAgICBkb20ucXVlcnlTZWxlY3RvcignLnB1Ymxpc2hlZEF0JykudGV4dENvbnRlbnQgPSBhcnRpY2xlLnB1Ymxpc2hlZEF0O1xuICAgIC8vIGRvbS5xdWVyeVNlbGVjdG9yKCcudXJsJykudGV4dENvbnRlbnQgPSBhcnRpY2xlLnVybDtcbiAgICBkb20ucXVlcnlTZWxlY3RvcignLmRlc2NyaXB0aW9uJykudGV4dENvbnRlbnQgPSBhcnRpY2xlLmRlc2NyaXB0aW9uO1xuXG4gICAgLy8gQWRkIHNyYyBhbmQgYWx0IHRvIGltYWdlc1xuICAgIGNvbnN0IGltZyA9IGRvbS5xdWVyeVNlbGVjdG9yKCcubmV3c0ltYWdlJyk7XG4gICAgaWYoYXJ0aWNsZS51cmxUb0ltYWdlKSB7XG4gICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCBhcnRpY2xlLnVybFRvSW1hZ2UpO1xuICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgYCR7YXJ0aWNsZS50aXRsZX0gYnkgJHthcnRpY2xlLmF1dGhvcn1gKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZG9tO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9hcnRpY2xlcy9BcnRpY2xlLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGxpIGNsYXNzPVxcXCJhcnRpY2xlXFxcIj5cXG4gIDxpbWcgY2xhc3M9XFxcIm5ld3NJbWFnZVxcXCI+XFxuICA8aDIgY2xhc3M9XFxcInRpdGxlXFxcIj48L2gyPlxcbiAgPHA+QnkgPHNwYW4gY2xhc3M9XFxcImF1dGhvclxcXCI+PC9zcGFuPiwgZnJvbSA8c3BhbiBjbGFzcz1cXFwicHVibGlzaGVyXFxcIj48L3NwYW4+PC9wPlxcbiAgPHA+PHNwYW4gY2xhc3M9XFxcInB1Ymxpc2hlZEF0XFxcIj48L3NwYW4+PC9wPlxcbiAgPHAgY2xhc3M9XFxcImRlc2NyaXB0aW9uXFxcIj48L3A+XFxuICA8IS0tIDxwIGNsYXNzPVxcXCJ1cmxcXFwiPjwvcD4gLS0+XFxuPC9saT5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FydGljbGVzL2FydGljbGUuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2FydGljbGUuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcInNvdXJjZU1hcFwiOnRydWUsXCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vYXJ0aWNsZS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2FydGljbGUuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FydGljbGVzL2FydGljbGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmFydGljbGUge1xcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xcbiAgcGFkZGluZzogMnJlbSAwO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG59XFxuXFxuLyogIC0tLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcblxcbi8qIERlc2t0b3AgKi9cXG5cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjAwcHgpIHtcXG4gIC50aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgICBtYXJnaW46IDFyZW0gMCAwO1xcbiAgfVxcbiAgXFxuICAubGlzdC1jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gICAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIC8qIG1heC13aWR0aDogMTIwMHB4OyAqL1xcbiAgICBtYXJnaW46IDAgYXV0bztcXG4gICAgLW1zLWZsZXgtd3JhcDogd3JhcDtcXG4gICAgICAgIGZsZXgtd3JhcDogd3JhcDtcXG4gIH1cXG5cXG4gIC5hcnRpY2xlIHtcXG4gICAgLXdlYmtpdC1ib3gtZmxleDogMDtcXG4gICAgICAgIC1tcy1mbGV4OiAwIDAgMjglO1xcbiAgICAgICAgICAgIGZsZXg6IDAgMCAyOCU7XFxuICAgIHBhZGRpbmc6IDJyZW0gMS41cmVtO1xcbiAgfVxcblxcbiAgLmFydGljbGU6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjMzLCAyMzMsIDIzMyk7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxLjAyKTtcXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDIpO1xcbiAgfVxcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL25ld3MtZmVlZC9hcnRpY2xlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHNCQUFzQjtFQUN0QixnQkFBZ0I7RUFDaEIsa0NBQTBCO0VBQTFCLDBCQUEwQjtDQUMzQjs7QUFFRCxxQ0FBcUM7O0FBRXJDLGFBQWE7O0FBQ2I7RUFDRTtJQUNFLGtCQUFrQjtJQUNsQixpQkFBaUI7R0FDbEI7O0VBRUQ7SUFDRSxxQkFBYztJQUFkLHFCQUFjO0lBQWQsY0FBYztJQUNkLHdCQUF3QjtJQUN4QixlQUFlO0lBQ2Ysb0JBQWdCO1FBQWhCLGdCQUFnQjtHQUNqQjs7RUFFRDtJQUNFLG9CQUFjO1FBQWQsa0JBQWM7WUFBZCxjQUFjO0lBQ2QscUJBQXFCO0dBQ3RCOztFQUVEO0lBQ0UscUNBQXFDO0lBQ3JDLCtCQUF1QjtZQUF2Qix1QkFBdUI7R0FDeEI7Q0FDRlwiLFwiZmlsZVwiOlwiYXJ0aWNsZS5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmFydGljbGUge1xcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xcbiAgcGFkZGluZzogMnJlbSAwO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG59XFxuXFxuLyogIC0tLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcblxcbi8qIERlc2t0b3AgKi9cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjAwcHgpIHtcXG4gIC50aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgICBtYXJnaW46IDFyZW0gMCAwO1xcbiAgfVxcbiAgXFxuICAubGlzdC1jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICAvKiBtYXgtd2lkdGg6IDEyMDBweDsgKi9cXG4gICAgbWFyZ2luOiAwIGF1dG87XFxuICAgIGZsZXgtd3JhcDogd3JhcDtcXG4gIH1cXG5cXG4gIC5hcnRpY2xlIHtcXG4gICAgZmxleDogMCAwIDI4JTtcXG4gICAgcGFkZGluZzogMnJlbSAxLjVyZW07XFxuICB9XFxuXFxuICAuYXJ0aWNsZTpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMzMsIDIzMywgMjMzKTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjAyKTtcXG4gIH1cXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9hcnRpY2xlcy9hcnRpY2xlLmNzc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGh0bWwgZnJvbSAnLi9wYWdpbmcuaHRtbCc7XG5pbXBvcnQgJy4vcGFnaW5nLmNzcyc7XG5pbXBvcnQgVGVtcGxhdGUgZnJvbSAnLi4vVGVtcGxhdGUnO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZShodG1sKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnaW5nIHtcbiAgY29uc3RydWN0b3Iob25QYWdlKSB7XG4gICAgdGhpcy5vblBhZ2UgPSBvblBhZ2U7XG4gIH1cblxuICB1cGRhdGUocGFnZUluZGV4LCBwZXJQYWdlLCB0b3RhbCkge1xuICAgIGNvbnN0IHRvdGFsUGFnZXMgPSBNYXRoLmZsb29yKHRvdGFsIC8gcGVyUGFnZSk7XG4gICAgXG4gICAgdGhpcy50b3RhbC50ZXh0Q29udGVudCA9IGBzaG93aW5nIHBhZ2UgJHtwYWdlSW5kZXggKyAxfSBvZiAke3RvdGFsUGFnZXN9ICgke3RvdGFsfSB0b3RhbCByZXN1bHRzKWA7XG4gICAgdGhpcy5wYWdlSW5kZXggPSBwYWdlSW5kZXg7XG4gICAgdGhpcy5wcmV2aW91cy5kaXNhYmxlZCA9IHBhZ2VJbmRleCA8PSAwO1xuICAgIHRoaXMubmV4dC5kaXNhYmxlZCA9IHBhZ2VJbmRleCA+PSB0b3RhbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5yZW5kZXIoKTtcbiAgICBcbiAgICB0aGlzLnRvdGFsID0gZG9tLnF1ZXJ5U2VsZWN0b3IoJy50b3RhbCcpO1xuICAgIHRoaXMucHJldmlvdXMgPSBkb20ucXVlcnlTZWxlY3RvcignLnByZXYnKTtcbiAgICB0aGlzLm5leHQgPSBkb20ucXVlcnlTZWxlY3RvcignLm5leHQnKTtcblxuICAgIHRoaXMucHJldmlvdXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLm9uUGFnZSh0aGlzLnBhZ2VJbmRleCAtIDEpKTtcbiAgICB0aGlzLm5leHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLm9uUGFnZSh0aGlzLnBhZ2VJbmRleCArIDEpKTtcblxuICAgIHJldHVybiBkb207XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL3NlYXJjaC9QYWdpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJ0b3RhbFxcXCI+PC9kaXY+XFxuPGRpdiBpZD1cXFwicHJldi1uZXh0XFxcIj5cXG4gICAgPGJ1dHRvbiBjbGFzcz1cXFwicHJldlxcXCIgZGlzYWJsZWQ+UHJldmlvdXM8L2J1dHRvbj5cXG4gICAgPGJ1dHRvbiBjbGFzcz1cXFwibmV4dFxcXCIgZGlzYWJsZWQ+TmV4dDwvYnV0dG9uPlxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3BhZ2luZy5odG1sXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcGFnaW5nLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3BhZ2luZy5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3BhZ2luZy5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3BhZ2luZy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIucHJldiwgLm5leHQge1xcbiAgICBmb250LXNpemU6IDAuOHJlbTtcXG4gICAgcGFkZGluZzogLjVyZW07XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNDEsIDI0MSwgMjQxKTtcXG4gICAgYm9yZGVyOiBub25lO1xcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgICBmb250LXdlaWdodDogNjAwO1xcbiAgICBmb250LWZhbWlseTogJ1dvcmsgU2FucycsIHNhbnMtc2VyaWY7XFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG59XFxuXFxuLnByZXY6aG92ZXIsIC5uZXh0OmhvdmVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNCwgMjI0LCAyMjQpO1xcbn1cXG5cXG4jcHJldi1uZXh0IHtcXG4gICAgbWFyZ2luOiAxcmVtIDAgMS41cmVtO1xcbn1cXG5cXG4udG90YWwge1xcbiAgICBtYXJnaW46IDFyZW0gMCAwO1xcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL25ld3MtZmVlZC9wYWdpbmcuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0ksa0JBQWtCO0lBQ2xCLGVBQWU7SUFDZixxQ0FBcUM7SUFDckMsYUFBYTtJQUNiLDBCQUEwQjtJQUMxQixpQkFBaUI7SUFDakIscUNBQXFDO0lBQ3JDLGtDQUEwQjtJQUExQiwwQkFBMEI7Q0FDN0I7O0FBRUQ7SUFDSSxxQ0FBcUM7Q0FDeEM7O0FBRUQ7SUFDSSxzQkFBc0I7Q0FDekI7O0FBRUQ7SUFDSSxpQkFBaUI7Q0FDcEJcIixcImZpbGVcIjpcInBhZ2luZy5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLnByZXYsIC5uZXh0IHtcXG4gICAgZm9udC1zaXplOiAwLjhyZW07XFxuICAgIHBhZGRpbmc6IC41cmVtO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjQxLCAyNDEsIDI0MSk7XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgZm9udC1mYW1pbHk6ICdXb3JrIFNhbnMnLCBzYW5zLXNlcmlmO1xcbiAgICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbn1cXG5cXG4ucHJldjpob3ZlciwgLm5leHQ6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI0LCAyMjQsIDIyNCk7XFxufVxcblxcbiNwcmV2LW5leHQge1xcbiAgICBtYXJnaW46IDFyZW0gMCAxLjVyZW07XFxufVxcblxcbi50b3RhbCB7XFxuICAgIG1hcmdpbjogMXJlbSAwIDA7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcImltcG9ydExvYWRlcnNcIjoxLFwic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL2NvbXBvbmVudHMvc2VhcmNoL3BhZ2luZy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IEtFWSA9ICdiMjgyOWMzMDNhZTA0YjhlOWZmZmYyNGQ5OTI2NzEyZic7XG4vLyBjb25zdCBURUNIX1VSTCA9IGBodHRwczovL25ld3NhcGkub3JnL3YyL2V2ZXJ5dGhpbmc/c291cmNlcz10aGUtdmVyZ2UmYXBpS2V5PSR7S0VZfWA7XG5jb25zdCBURUNIX1VSTCA9IGBodHRwczovL25ld3NhcGkub3JnL3YyL2V2ZXJ5dGhpbmc/c291cmNlcz10ZWNoY3J1bmNoJmFwaUtleT0ke0tFWX1gO1xuXG4vLyBQdXQgaW4gbG9jYWwgc3RvcmFnZVxuY29uc3Qgc3RvcmVMb2NhbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hOZXdzKHNlYXJjaFRlcm0sIHBhZ2VJbmRleCA9IDApIHtcbiAgY29uc3QgdXJsID0gYCR7VEVDSF9VUkx9JnE9JHtzZWFyY2hUZXJtfSZtYXhSZXN1bHRzPTYmc3RhcnRJbmRleD0ke3BhZ2VJbmRleH1gO1xuICBjb25zb2xlLmxvZyh1cmwpO1xuXG4gIC8vIEdldCBsb2NhbCBzdG9yYWdlXG4gIGNvbnN0IGRhdGEgPSBzdG9yZUxvY2FsLmdldEl0ZW0odXJsKTtcbiAgaWYoZGF0YSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShKU09OLnBhcnNlKGRhdGEpKTtcblxuICAvLyBSZXR1cm4gbG9jYWwgc3RvcmFnZVxuICByZXR1cm4gZmV0Y2godXJsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbihkYXRhID0+IHtzdG9yZUxvY2FsLnNldEl0ZW0odXJsLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NlcnZpY2VzL25ld3NBcGkuanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=