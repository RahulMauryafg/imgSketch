// var sketchpad = Raphael.sketchpad("editor", {
// 	width: 330,
// 	height: 220,
// 	editing: true
// });
// var pen = sketchpad.pen();


// $('textarea.limited').live('keydown blur paste change',function(e){
// 	var currentRow = 0;
// 	var _this = this, maxlength = 72;
// 	//get total number of keys in textarea
// 	var totalKeys = _this.value.length;
// 	//get number of lines
// 	var newLines = $(this).val().split("\n").length;

// 	if(totalKeys > maxlength){
// 		_this.value = _this.value.substr(0,maxlength);
// 	}

// 	if (e.keyCode===13)
// 		currentRow =0;
// 	if (newLines >= 3 && e.keyCode===13){
// 		return false;
// 	}
// 	console.log('----')
// 	console.log(newLines);
// 	console.log(virtualKeys);
// 	console.log(totalKeys);
// });