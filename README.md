# Billightbox
Billightbox is a javascript lightbox widget based on jquery.

# How to use

## show and setup
```javascript
var options = {
	fadeIn: 1000
	,images: ["image_url_1","image_url_2", ...]
	,thumb: ["thumb_url_1","thumb_url_2", ...]
	// the thumbnail will set to images data  if this option skip
	,type: "fixed"
	// if set to "fixed" display image will auto fit to screen display size, if skip display image will scale to its oringinal size
	,zoom: "drag"
	// set to "drag" allow user to drag image around, if skip image position will auto interact with mouse move
};

LightBox.show(options);
```

## hide
```javascript
LightBox.hide();
```