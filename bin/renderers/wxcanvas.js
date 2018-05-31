"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _merge = require("../help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _shared = require("./shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WxCanvasRenderer = function () {
	function WxCanvasRenderer(context, encodings, options) {
		_classCallCheck(this, WxCanvasRenderer);

		this.context = context;
		this.encodings = encodings;
		this.options = options;
	}

	_createClass(WxCanvasRenderer, [{
		key: "render",
		value: function render() {
			// Abort if the browser does not support wechat canvas
			if (!this.context.canvasId) {
				throw new Error('The browser does not support wechat canvas.');
			}

			this.prepareWxCanvas();
			for (var i = 0; i < this.encodings.length; i++) {
				var encodingOptions = (0, _merge2.default)(this.options, this.encodings[i].options);

				this.drawWxCanvasBarcode(encodingOptions, this.encodings[i]);
				this.drawWxCanvasText(encodingOptions, this.encodings[i]);

				this.moveWxCanvasDrawing(this.encodings[i]);
			}

			this.context.draw();

			this.restoreWxCanvas();
		}
	}, {
		key: "prepareWxCanvas",
		value: function prepareWxCanvas() {
			// Get the canvas context
			var ctx = this.context;

			ctx.save();

			(0, _shared.calculateEncodingAttributes)(this.encodings, this.options, ctx);
			var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
			var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);

			this.context.width = totalWidth + this.options.marginLeft + this.options.marginRight;

			this.context.height = maxHeight;

			// Paint the canvas
			ctx.clearRect(0, 0, this.context.width, this.context.height);
			if (this.options.background) {
				ctx.setFillStyle(this.options.background);
				ctx.fillRect(0, 0, this.context.width, this.context.height);
			}

			ctx.translate(this.options.marginLeft, 0);
		}
	}, {
		key: "drawWxCanvasBarcode",
		value: function drawWxCanvasBarcode(options, encoding) {
			// Get the canvas context
			var ctx = this.context;

			var binary = encoding.data;

			// Creates the barcode out of the encoded binary
			var yFrom;
			if (options.textPosition == "top") {
				yFrom = options.marginTop + options.fontSize + options.textMargin;
			} else {
				yFrom = options.marginTop;
			}

			ctx.setFillStyle(options.lineColor);

			for (var b = 0; b < binary.length; b++) {
				var x = b * options.width + encoding.barcodePadding;

				if (binary[b] === "1") {
					ctx.fillRect(x, yFrom, options.width, options.height);
				} else if (binary[b]) {
					ctx.fillRect(x, yFrom, options.width, options.height * binary[b]);
				}
			}
		}
	}, {
		key: "drawWxCanvasText",
		value: function drawWxCanvasText(options, encoding) {
			// Get the canvas context
			var ctx = this.context;

			var font = options.fontOptions + " " + options.fontSize + "px " + options.font;

			// Draw the text if displayValue is set
			if (options.displayValue) {
				var x, y;

				if (options.textPosition == "top") {
					y = options.marginTop + options.fontSize - options.textMargin;
				} else {
					y = options.height + options.textMargin + options.marginTop + options.fontSize;
				}

				ctx.font = font.trim();

				// Draw the text in the correct X depending on the textAlign option
				if (options.textAlign == "left" || encoding.barcodePadding > 0) {
					x = 0;
					ctx.textAlign = 'left';
				} else if (options.textAlign == "right") {
					x = encoding.width - 1;
					ctx.textAlign = 'right';
				}
				// In all other cases, center the text
				else {
						x = encoding.width / 2;
						ctx.textAlign = 'center';
					}

				ctx.fillText(encoding.text, x, y);
			}
		}
	}, {
		key: "moveWxCanvasDrawing",
		value: function moveWxCanvasDrawing(encoding) {
			var ctx = this.context;

			ctx.translate(encoding.width, 0);
		}
	}, {
		key: "restoreWxCanvas",
		value: function restoreWxCanvas() {
			// Get the canvas context
			var ctx = this.context;

			ctx.restore();
		}
	}]);

	return WxCanvasRenderer;
}();

exports.default = WxCanvasRenderer;