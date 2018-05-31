import merge from "../help/merge.js";
import {calculateEncodingAttributes, getTotalWidthOfEncodings, getMaximumHeightOfEncodings} from "./shared.js";

class WxCanvasRenderer{
	constructor(context, encodings, options){
		this.context = context;
		this.encodings = encodings;
		this.options = options;
	}

	render(){
		// Abort if the browser does not support wechat canvas
		if (!this.context.canvasId) {
			throw new Error('The browser does not support wechat canvas.');
		}

		this.prepareWxCanvas();
		for(let i = 0; i < this.encodings.length; i++){
			var encodingOptions = merge(this.options, this.encodings[i].options);

			this.drawWxCanvasBarcode(encodingOptions, this.encodings[i]);
			this.drawWxCanvasText(encodingOptions, this.encodings[i]);

			this.moveWxCanvasDrawing(this.encodings[i]);
		}

		this.context.draw();

		this.restoreWxCanvas();
	}

	prepareWxCanvas(){
		// Get the canvas context
		var ctx = this.context;

		ctx.save();

		calculateEncodingAttributes(this.encodings, this.options, ctx);
		var totalWidth = getTotalWidthOfEncodings(this.encodings);
		var maxHeight = getMaximumHeightOfEncodings(this.encodings);

		this.context.width = totalWidth + this.options.marginLeft + this.options.marginRight;

		this.context.height = maxHeight;

		// Paint the canvas
		ctx.clearRect(0, 0, this.context.width, this.context.height);
		if(this.options.background){
			ctx.setFillStyle(this.options.background);
			ctx.fillRect(0, 0, this.context.width, this.context.height);
		}

		ctx.translate(this.options.marginLeft, 0);
	}

	drawWxCanvasBarcode(options, encoding){
		// Get the canvas context
		var ctx = this.context;

		var binary = encoding.data;

		// Creates the barcode out of the encoded binary
		var yFrom;
		if(options.textPosition == "top"){
			yFrom = options.marginTop + options.fontSize + options.textMargin;
		}
		else{
			yFrom = options.marginTop;
		}

		ctx.setFillStyle(options.lineColor);

		for(var b = 0; b < binary.length; b++){
			var x = b * options.width + encoding.barcodePadding;

			if(binary[b] === "1"){
				ctx.fillRect(x, yFrom, options.width, options.height);
			}
			else if(binary[b]){
				ctx.fillRect(x, yFrom, options.width, options.height * binary[b]);
			}
		}
	}

	drawWxCanvasText(options, encoding){
		// Get the canvas context
		var ctx = this.context;

		var font = options.fontOptions + " " + options.fontSize + "px " + options.font;

		// Draw the text if displayValue is set
		if(options.displayValue){
			var x, y;

			if(options.textPosition == "top"){
				y = options.marginTop + options.fontSize - options.textMargin;
			}
			else{
				y = options.height + options.textMargin + options.marginTop + options.fontSize;
			}

			ctx.font = font.trim();

			// Draw the text in the correct X depending on the textAlign option
			if(options.textAlign == "left" || encoding.barcodePadding > 0){
				x = 0;
				ctx.textAlign = 'left';
			}
			else if(options.textAlign == "right"){
				x = encoding.width - 1;
				ctx.textAlign = 'right';
			}
			// In all other cases, center the text
			else{
				x = encoding.width / 2;
				ctx.textAlign = 'center';
			}

			ctx.fillText(encoding.text, x, y);
		}
	}

	moveWxCanvasDrawing(encoding){
		var ctx = this.context;

		ctx.translate(encoding.width, 0);
	}

	restoreWxCanvas(){
		// Get the canvas context
		var ctx = this.context;

		ctx.restore();
	}
}

export default WxCanvasRenderer;
