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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Ele {
    constructor() {
        this.children = [];
    }
    get style() { return this.target.style; }
    addChild(child) {
        this.children.push(child);
        this.target.appendChild(child.target);
    }
    // Add a child that isn't in the children list and won't get unloaded.
    addUntrackedChild(child) {
        this.target.appendChild(child.target);
    }
    addChildren(children) {
        children.forEach((child) => this.addChild(child));
    }
    removeChild(child) {
        this.target.removeChild(child.target);
        this.children.splice(this.children.indexOf(child), 1);
        child._unload();
    }
    _unload() {
        this.children.forEach(child => child.unload);
        this.children = [];
        this.unload();
    }
    // Derived classes override this if you need to cancel any timers
    unload() {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Ele;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    updateFromMouseEvent(e) {
        this.x = e.clientX;
        this.y = e.clientY;
    }
    copy() {
        return new Point(this.x, this.y);
    }
    bumpBy(other) {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
    }
    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }
    toModel() {
        return this.copy();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Point;

class PointAverager {
    constructor() {
        this._averageBuffer = [];
        this._averageBufferSize = 10;
    }
    get average() {
        let xSum = 0;
        let ySum = 0;
        this._averageBuffer.forEach((point) => {
            xSum += point.x;
            ySum += point.y;
        });
        if (this._averageBuffer.length === 0) {
            return new Point();
        }
        else {
            return new Point(xSum / this._averageBuffer.length, ySum / this._averageBuffer.length);
        }
    }
    push(p) {
        this._averageBuffer.push(p.copy());
        if (this._averageBuffer.length > this._averageBufferSize) {
            this._averageBuffer.splice(0, 1);
        }
    }
    clear() {
        this._averageBuffer = [];
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = PointAverager;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__img_ele__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__point__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ele_dragger__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ele_zoomer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model__ = __webpack_require__(3);





class ImgDragZoomEle extends __WEBPACK_IMPORTED_MODULE_0__img_ele__["a" /* ImgEle */] {
    constructor(src = null, onRemoved) {
        super(src, onRemoved);
        this._pos = new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */](0, 0);
        this.dragger = new __WEBPACK_IMPORTED_MODULE_2__ele_dragger__["a" /* EleDragger */](this, this._pos);
        this.zoomer = new __WEBPACK_IMPORTED_MODULE_3__ele_zoomer__["a" /* EleZoomer */](this, this._pos);
        this.imgElement.addEventListener("load", () => this._onLoaded());
    }
    get pos() { return this._pos; }
    toModel() {
        return new ImgDragZoomEleModel(this._pos.toModel(), this.zoomer.size.toModel(), super.toModel());
    }
    static fromModel(model, onRemoved) {
        let img = new ImgDragZoomEle(model.imgEleModel.src, onRemoved);
        img._pos.x = model.pos.x;
        img._pos.y = model.pos.y;
        img.dragger.setPos(img._pos);
        img.zoomer.setSize(new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */](model.size.x, model.size.y));
        return img;
    }
    _onLoaded() {
        if (this.zoomer.size.x === 0) {
            this.zoomer.setSize(new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */](this.imgElement.naturalWidth, this.imgElement.naturalHeight));
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ImgDragZoomEle;

class ImgDragZoomEleModel extends __WEBPACK_IMPORTED_MODULE_4__model__["a" /* Model */] {
    constructor(pos, size, imgEleModel) {
        super();
        this.pos = pos;
        this.size = size;
        this.imgEleModel = imgEleModel;
    }
}
/* unused harmony export ImgDragZoomEleModel */



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Model {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Model;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__point__ = __webpack_require__(1);

class EleDragger {
    constructor(_ele, _pos) {
        this._ele = _ele;
        this._pos = _pos;
        this._px = "px";
        this._mousePos = new __WEBPACK_IMPORTED_MODULE_0__point__["a" /* Point */](0, 0);
        this._dragging = false;
        // todo: the "coast" function is copied between here and axis-ele.ts. Need to combine these so we don't repeat the code.
        this._timerHandle = -1;
        this._velocity = new __WEBPACK_IMPORTED_MODULE_0__point__["a" /* Point */](0, 0);
        this._velocityAverager = new __WEBPACK_IMPORTED_MODULE_0__point__["b" /* PointAverager */]();
        this._ele.style.display = "block";
        this._ele.style.position = "absolute";
        this.setPos(this._pos);
        let move = (e) => this._onMouseMove(e);
        let down = (e) => this._onMouseDown(e);
        let up = (e) => this._onMouseUp(e);
        this._ele.target.addEventListener("mousemove", move);
        this._ele.target.addEventListener("mousedown", down);
        this._ele.target.addEventListener("mouseup", up);
    }
    setPos(pos) {
        this._ele.style.left = pos.x + this._px;
        this._ele.style.top = pos.y + this._px;
    }
    _onMouseMove(e) {
        let oldMousePos = this._mousePos.copy();
        this._mousePos.updateFromMouseEvent(e);
        if (this._dragging) {
            let delta = this._mousePos.subtract(oldMousePos);
            this._pos.bumpBy(delta);
            this.setPos(this._pos);
            if (this._timerHandle !== -1) {
                clearTimeout(this._timerHandle);
            }
            this._timerHandle = setTimeout(() => this._dragTimeout(), 100);
            this._velocityAverager.push(delta);
        }
        e.preventDefault();
        e.stopPropagation();
    }
    _onMouseDown(e) {
        this._dragging = true;
        this._velocityAverager.clear();
        this._velocity = new __WEBPACK_IMPORTED_MODULE_0__point__["a" /* Point */]();
        e.preventDefault();
        e.stopPropagation();
    }
    _onMouseUp(e) {
        this._dragging = false;
        this._velocity = this._velocityAverager.average;
        if (this._timerHandle !== -1) {
            clearTimeout(this._timerHandle);
        }
        this._timerHandle = setInterval(() => this._coast(), 13);
        e.preventDefault();
        e.stopPropagation();
    }
    _dragTimeout() {
        this._velocityAverager.clear();
    }
    _coast() {
        let xVel = Math.abs(this._velocity.x);
        let yVel = Math.abs(this._velocity.y);
        if (xVel < 0.01 && yVel < 0.01) {
            clearInterval(this._timerHandle);
            this._timerHandle = -1;
            this._velocity = new __WEBPACK_IMPORTED_MODULE_0__point__["a" /* Point */](0, 0);
        }
        else {
            this._pos.bumpBy(this._velocity);
            this.setPos(this._pos);
            this._velocity.x *= 0.95;
            this._velocity.y *= 0.95;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EleDragger;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__point__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__zoom1d__ = __webpack_require__(6);


class EleZoomer {
    constructor(_ele, _pos) {
        this._ele = _ele;
        this._pos = _pos;
        this._size = new __WEBPACK_IMPORTED_MODULE_0__point__["a" /* Point */](0, 0);
        this._mousePos = new __WEBPACK_IMPORTED_MODULE_0__point__["a" /* Point */](0, 0);
        this._px = "px";
        this._ele.style.display = "block";
        this._ele.style.position = "absolute";
        this._ele.target.addEventListener("mousemove", (e) => this._onMouseMove(e));
        this._ele.target.addEventListener("wheel", (e) => this._onMouseWheel(e));
    }
    get size() { return this._size; }
    setSize(size) {
        this._size = size;
        this._ele.style.width = size.x + this._px;
        this._ele.style.height = size.y + this._px;
    }
    _onMouseMove(e) {
        this._mousePos.updateFromMouseEvent(e);
        e.preventDefault();
        e.stopPropagation();
    }
    _onMouseWheel(e) {
        let delta = (e.deltaY > 0) ? 1.1 : 0.9;
        this.zoom(delta, this._mousePos);
        e.preventDefault();
        e.stopPropagation();
    }
    zoom(zoomRatio, zoomPoint) {
        let x = this._mousePos.x;
        let y = this._mousePos.y;
        let x1 = this._pos.x;
        let y1 = this._pos.y;
        let x2 = x1 + this.size.x;
        let y2 = y1 + this.size.y;
        let newX1X2 = __WEBPACK_IMPORTED_MODULE_1__zoom1d__["a" /* Zoom1d */].zoom(x, x1, x2, zoomRatio);
        let newY1Y2 = __WEBPACK_IMPORTED_MODULE_1__zoom1d__["a" /* Zoom1d */].zoom(y, y1, y2, zoomRatio);
        this._pos.x = newX1X2[0];
        this._pos.y = newY1Y2[0];
        this._setPos(this._pos);
        this.size.x = newX1X2[1] - newX1X2[0];
        this.size.y = newY1Y2[1] - newY1Y2[0];
        this.setSize(this.size);
    }
    _setPos(pos) {
        this._ele.style.left = pos.x + this._px;
        this._ele.style.top = pos.y + this._px;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EleZoomer;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Zoom1d {
    static zoom(zoomPoint, leftEdge, rightEdge, zoomPercent) {
        let delta;
        let newLeftEdge;
        let newRightEdge;
        let newWidth = (rightEdge - leftEdge) * zoomPercent;
        if (leftEdge > zoomPoint) { // Zoom object is to the right of x.
            delta = leftEdge - zoomPoint;
            newLeftEdge = zoomPoint + (delta * zoomPercent);
            newRightEdge = newLeftEdge + newWidth;
        }
        else if (zoomPoint > rightEdge) { // Zoom object is to the left of x.
            delta = zoomPoint - rightEdge;
            newRightEdge = zoomPoint - (delta * zoomPercent);
            newLeftEdge = newRightEdge - newWidth;
        }
        else { // Zoom object straddles x.
            let left = zoomPoint - leftEdge;
            let right = rightEdge - zoomPoint;
            let newLeft = left * zoomPercent;
            let newRight = right * zoomPercent;
            newLeftEdge = zoomPoint - newLeft;
            newRightEdge = zoomPoint + newRight;
        }
        return [newLeftEdge, newRightEdge];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Zoom1d;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ele__ = __webpack_require__(0);

class DivEle extends __WEBPACK_IMPORTED_MODULE_0__ele__["a" /* Ele */] {
    constructor() {
        super();
        this.target = document.createElement("div");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DivEle;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_img_drag_zoom_ele__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_video_drag_zoom_ele__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_axis_ele__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_web_app__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controls__ = __webpack_require__(14);





class WebImgApp extends __WEBPACK_IMPORTED_MODULE_3__lib_web_app__["a" /* WebApp */] {
    constructor() {
        super();
        this.cookieName = "web-img-save-data";
        this._removeImgEle = (imgToRemove) => this._axis.removeChild(imgToRemove);
        this._axis = new __WEBPACK_IMPORTED_MODULE_2__lib_axis_ele__["a" /* AxisEle */]();
        this._controls = new __WEBPACK_IMPORTED_MODULE_4__controls__["a" /* Controls */](this.cookieName, this._axis, this._removeImgEle);
        this.addChildren([
            this._axis,
            this._controls,
        ]);
        window.addEventListener("paste", (e) => this._onPaste(e));
        window.addEventListener("keydown", (e) => this.toggleControls(e));
    }
    _onPaste(e) {
        let src = e.clipboardData.getData("text/plain");
        if (src.length === 0) {
            return;
        }
        let dotIdx = src.lastIndexOf(".");
        if (dotIdx < 0) {
            return;
        }
        let extension = src.substr(dotIdx + 1);
        let imgExtensions = [
            "gif",
            "jpg",
            "jpeg",
            "png",
        ];
        if (imgExtensions.filter(s => src.includes(s)).length === 1) {
            this._axis.addDragZoomEle(new __WEBPACK_IMPORTED_MODULE_0__lib_img_drag_zoom_ele__["a" /* ImgDragZoomEle */](src, this._removeImgEle));
            return;
        }
        let vidExtensions = [
            "mp4",
            "webm"
        ];
        if (vidExtensions.filter(s => src.includes(s)).length === 1) {
            this._axis.addDragZoomEle(new __WEBPACK_IMPORTED_MODULE_1__lib_video_drag_zoom_ele__["a" /* VideoDragZoomEle */](src, (videoToRemove) => this.removeChild(videoToRemove)));
        }
    }
    toggleControls(e) {
        if (e.key !== " ") {
            return;
        }
        if (this._controls.target.style.display === "none") {
            this._controls.target.style.display = "block";
        }
        else {
            this._controls.target.style.display = "none";
        }
    }
}
window.onload = () => {
    try {
        new WebImgApp();
    }
    catch (e) {
        console.error(e);
    }
};


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ele__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model__ = __webpack_require__(3);


class ImgEle extends __WEBPACK_IMPORTED_MODULE_0__ele__["a" /* Ele */] {
    constructor(src = null, _onRemoved) {
        super();
        this._onRemoved = _onRemoved;
        this.target = document.createElement("img");
        this.src = src;
        this.imgElement.addEventListener("contextmenu", (e) => this._onContextMenu(e));
    }
    get imgElement() { return this.target; }
    set src(src) {
        if (src === null) {
            this.imgElement.style.display = "hidden";
        }
        else {
            this.imgElement.style.display = "block";
            this.imgElement.src = src;
        }
    }
    toModel() {
        return new ImgEleModel(this.imgElement.src);
    }
    _onContextMenu(e) {
        this._onRemoved(this);
        e.preventDefault();
        e.stopPropagation();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ImgEle;

class ImgEleModel extends __WEBPACK_IMPORTED_MODULE_1__model__["a" /* Model */] {
    constructor(src) {
        super();
        this.src = src;
    }
}
/* unused harmony export ImgEleModel */



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__video_ele__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__point__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ele_dragger__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ele_zoomer__ = __webpack_require__(5);




class VideoDragZoomEle extends __WEBPACK_IMPORTED_MODULE_0__video_ele__["a" /* VideoEle */] {
    constructor(src = null, onRemoved) {
        super(src, onRemoved);
        this._pos = new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */](0, 0);
        this.dragger = new __WEBPACK_IMPORTED_MODULE_2__ele_dragger__["a" /* EleDragger */](this, this._pos);
        this.zoomer = new __WEBPACK_IMPORTED_MODULE_3__ele_zoomer__["a" /* EleZoomer */](this, this._pos);
        this.videoElement.addEventListener("loadeddata", () => this._onLoaded());
    }
    get pos() { return this._pos; }
    _onLoaded() {
        this.zoomer.setSize(new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */](this.videoElement.videoWidth, this.videoElement.videoHeight));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = VideoDragZoomEle;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ele__ = __webpack_require__(0);

class VideoEle extends __WEBPACK_IMPORTED_MODULE_0__ele__["a" /* Ele */] {
    constructor(src = null, _onRemoved) {
        super();
        this._onRemoved = _onRemoved;
        this.target = document.createElement("video");
        this.src = src;
        this.videoElement.addEventListener("contextmenu", (e) => this._onContextMenu(e));
    }
    get videoElement() { return this.target; }
    set src(src) {
        if (src === null) {
            this.videoElement.style.display = "hidden";
        }
        else {
            this.videoElement.style.display = "block";
            this.videoElement.src = src;
            //this.videoElement.autoplay = true;
            this.videoElement.controls = true;
            this.videoElement.loop = true;
            this.videoElement.playbackRate = 1.0;
        }
    }
    _onContextMenu(e) {
        this._onRemoved(this);
        e.preventDefault();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = VideoEle;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__div_ele__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__point__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__zoom1d__ = __webpack_require__(6);



/**
 * The intent of this element is to fill the whole screen and allow child elemements to
 * be drug around google maps style... but without the tile-loading nature.
 *
 * When a veil is placed over all the images mouse drags and zooms affect all images. When the veil is behind all the
 * images mouse drags and zooms when over an image affect only that image (position and size individual images).
 */
class AxisEle extends __WEBPACK_IMPORTED_MODULE_0__div_ele__["a" /* DivEle */] {
    constructor() {
        super();
        this.toggleIndividualImgZoomKey = "a";
        this._mousePos = new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */]();
        this._dragging = false;
        this._veil = new __WEBPACK_IMPORTED_MODULE_0__div_ele__["a" /* DivEle */]();
        // todo: the "coast" function is copied between here and ele-dragger.ts. Need to combine these so we don't repeat the code.
        this._timerHandle = -1;
        this._velocity = new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */](0, 0);
        this._velocityAverager = new __WEBPACK_IMPORTED_MODULE_1__point__["b" /* PointAverager */]();
        this._setupStyle();
        this._setupVeil();
        this._setupKeyDownEventListener();
    }
    _setupStyle() {
        this.target.classList.add("axis-ele");
    }
    _setupVeil() {
        this._setupVeilStyle();
        this._createVeilEventListeners();
        this.addUntrackedChild(this._veil);
    }
    _setupVeilStyle() {
        this._veil.target.classList.add("axis-veil-ele");
        this._veil.style.zIndex = "6";
    }
    _createVeilEventListeners() {
        this._veil.target.addEventListener("mousedown", (e) => this._mouseDown(e));
        this._veil.target.addEventListener("mouseup", (e) => this._mouseUp(e));
        this._veil.target.addEventListener("mousemove", (e) => this._mouseMove(e));
        this._veil.target.addEventListener("wheel", (e) => this._mouseWheel(e));
        this._veil.target.addEventListener("contextmenu", (e) => this._onContextMenu(e));
    }
    _setupKeyDownEventListener() {
        window.addEventListener("keydown", (e) => {
            if (e.key === this.toggleIndividualImgZoomKey) {
                if (this._veil.style.zIndex === "6") {
                    this._veil.style.zIndex = "1";
                }
                else {
                    this._veil.style.zIndex = "6";
                }
            }
        });
    }
    addDragZoomEle(child) {
        super.addChild(child);
    }
    _mouseDown(e) {
        this._dragging = true;
        this._velocityAverager.clear();
        this._velocity = new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */]();
        e.preventDefault();
        e.stopPropagation();
    }
    _mouseUp(e) {
        this._dragging = false;
        this._velocity = this._velocityAverager.average;
        if (this._timerHandle !== -1) {
            clearTimeout(this._timerHandle);
        }
        this._timerHandle = setInterval(() => this._coast(), 13);
        e.preventDefault();
        e.stopPropagation();
    }
    _mouseMove(e) {
        let oldMousePos = this._mousePos.copy();
        this._mousePos.updateFromMouseEvent(e);
        if (this._dragging) {
            let delta = this._mousePos.subtract(oldMousePos);
            this.children.forEach((child) => {
                child.pos.bumpBy(delta);
                child.dragger.setPos(child.pos);
            });
            if (this._timerHandle !== -1) {
                clearTimeout(this._timerHandle);
            }
            this._timerHandle = setTimeout(() => this._dragTimeout(), 100);
            this._velocityAverager.push(delta);
        }
        e.preventDefault();
        e.stopPropagation();
    }
    _dragTimeout() {
        this._velocityAverager.clear();
    }
    _coast() {
        let xVel = Math.abs(this._velocity.x);
        let yVel = Math.abs(this._velocity.y);
        if (xVel < 0.01 && yVel < 0.01) {
            clearInterval(this._timerHandle);
            this._timerHandle = -1;
            this._velocity = new __WEBPACK_IMPORTED_MODULE_1__point__["a" /* Point */](0, 0);
        }
        else {
            this.children.forEach((child) => {
                child.pos.bumpBy(this._velocity);
                child.dragger.setPos(child.pos);
            });
            this._velocity.x *= 0.95;
            this._velocity.y *= 0.95;
        }
    }
    _mouseWheel(e) {
        let zoom = (e.deltaY < 0) ? 1.1 : 0.9;
        this.children.forEach((child) => {
            this._zoomChild(child, zoom);
        });
        e.preventDefault();
        e.stopPropagation();
    }
    _zoomChild(child, zoomPercent) {
        let x = this._mousePos.x;
        let y = this._mousePos.y;
        let x1 = child.pos.x;
        let y1 = child.pos.y;
        let x2 = x1 + child.zoomer.size.x;
        let y2 = y1 + child.zoomer.size.y;
        let newX1X2 = __WEBPACK_IMPORTED_MODULE_2__zoom1d__["a" /* Zoom1d */].zoom(x, x1, x2, zoomPercent);
        //noinspection JSSuspiciousNameCombination
        let newY1Y2 = __WEBPACK_IMPORTED_MODULE_2__zoom1d__["a" /* Zoom1d */].zoom(y, y1, y2, zoomPercent);
        child.pos.x = newX1X2[0];
        child.pos.y = newY1Y2[0];
        child.dragger.setPos(child.pos);
        child.zoomer.size.x = newX1X2[1] - newX1X2[0];
        child.zoomer.size.y = newY1Y2[1] - newY1Y2[0];
        child.zoomer.setSize(child.zoomer.size);
    }
    //noinspection JSMethodCanBeStatic
    _onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AxisEle;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class WebApp {
    constructor() {
        this._children = [];
    }
    addChildren(children) {
        children.forEach((child) => this.addChild(child));
    }
    addChild(child) {
        this._children.push(child);
        window.document.body.appendChild(child.target);
    }
    removeChild(child) {
        let childIndex = this._children.indexOf(child);
        if (childIndex < 0) {
            throw new Error("Attempted to remove unknown child");
        }
        this._children.splice(childIndex, 1);
        window.document.body.removeChild(child.target);
        child = null;
        console.log("num web app children: " + this._children.length);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WebApp;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_div_ele__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_button_ele__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_text_area_ele__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_img_drag_zoom_ele__ = __webpack_require__(2);




class Controls extends __WEBPACK_IMPORTED_MODULE_0__lib_div_ele__["a" /* DivEle */] {
    constructor(cookieName, axis, onRemove) {
        super();
        this.cookieName = cookieName;
        this.axis = axis;
        this.onRemove = onRemove;
        this._textArea = new __WEBPACK_IMPORTED_MODULE_2__lib_text_area_ele__["a" /* TextAreaEle */]();
        this.target.classList.add("controls");
        this.style.display = "none";
        this._textArea.textAreaElement.cols = 100;
        this._textArea.textAreaElement.rows = 5;
        this._textArea.text = localStorage[cookieName];
        let textContainer = new __WEBPACK_IMPORTED_MODULE_0__lib_div_ele__["a" /* DivEle */]();
        textContainer.style.padding = "10px";
        textContainer.addChild(this._textArea);
        let buttonContainer = new __WEBPACK_IMPORTED_MODULE_0__lib_div_ele__["a" /* DivEle */]();
        buttonContainer.style.padding = "10px";
        buttonContainer.addChildren([
            new __WEBPACK_IMPORTED_MODULE_1__lib_button_ele__["a" /* ButtonEle */]("Apply JSON", () => this.applyJSON()),
            new __WEBPACK_IMPORTED_MODULE_1__lib_button_ele__["a" /* ButtonEle */]("Save Chagnes", () => this.saveChanges())
        ]);
        this.addChildren([
            textContainer,
            buttonContainer
        ]);
    }
    applyJSON() {
        let newJSON = this._textArea.text;
        if (newJSON.length === 0) {
            newJSON = "[]";
        }
        let models;
        try {
            models = JSON.parse(newJSON);
        }
        catch (e) {
            alert("Failed to parse JSON: " + e);
        }
        // ugly.
        while (this.axis.children.length > 0) {
            this.axis.children[0].removeChild(this.axis.children[0]);
        }
        models.forEach((model) => {
            let ele = __WEBPACK_IMPORTED_MODULE_3__lib_img_drag_zoom_ele__["a" /* ImgDragZoomEle */].fromModel(model, this.onRemove);
            this.axis.addChild(ele);
        });
    }
    saveChanges() {
        let models = [];
        this.axis.children.forEach((child) => {
            models.push(child.toModel());
        });
        // alert(JSON.stringify(models));
        localStorage[this.cookieName] = JSON.stringify(models);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Controls;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ele__ = __webpack_require__(0);

class ButtonEle extends __WEBPACK_IMPORTED_MODULE_0__ele__["a" /* Ele */] {
    constructor(buttonText, _onClicked) {
        super();
        this._onClicked = _onClicked;
        this.target = document.createElement("button");
        this.buttonElement.innerHTML = buttonText;
        this.buttonElement.onclick = this._onClicked;
    }
    get buttonElement() { return this.target; }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ButtonEle;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ele__ = __webpack_require__(0);

class TextAreaEle extends __WEBPACK_IMPORTED_MODULE_0__ele__["a" /* Ele */] {
    get textAreaElement() { return this.target; }
    get text() { return this.textAreaElement.value; }
    set text(t) {
        this.textAreaElement.value = t;
    }
    constructor() {
        super();
        this.target = document.createElement("textarea");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TextAreaEle;



/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map