import optionsFromStrings from "./optionsFromStrings.js";
import defaults from "../options/defaults.js";

function getOptionsFromElement(element){
	var options = {};
	for(var property in defaults){
		if(defaults.hasOwnProperty(property)){
			if(!element.hasOwnProperty('canvasId')){
				// jsbarcode-*
				if(element.hasAttribute("jsbarcode-" + property.toLowerCase())){
					options[property] = element.getAttribute("jsbarcode-" + property.toLowerCase());
				}

				// data-*
				if(element.hasAttribute("data-" + property.toLowerCase())){
					options[property] = element.getAttribute("data-" + property.toLowerCase());
				}
			}
		}
	}
	if(!element.hasOwnProperty('canvasId')){
		options["value"] = element.getAttribute("jsbarcode-value") || element.getAttribute("data-value");
	}
// Since all atributes are string they need to be converted to integers
	options = optionsFromStrings(options);

	return options;
}

export default getOptionsFromElement;
