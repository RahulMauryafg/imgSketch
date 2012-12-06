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


// var countChars = 0;
// function checkLimits(txtArea,countChars,kc) {
// 	var lh = 58;
// 	var fs = 42;
// 	var dh = Math.round((lh/fs)*100)/100;
// 	if(!txtArea.css('line-height') || !txtArea.css('height')) {
// 		txtArea.css('line-height', lh);
// 		if(txtArea.attr('rows') == txtArea.attr("maxRows"))
// 			txtArea.css('height', Math.ceil((fs * txtArea.attr('rows') * dh)+((fs*200)/300)));
// 		else
// 			txtArea.css('height', Math.ceil((fs * txtArea.attr('rows') * dh)+((fs*100)/300)));
// 	}
// 	var exceedMsg = "";
// 	var maxLines = txtArea.attr("maxRows");
// 	var maxHeight = Math.ceil((fs * maxLines * dh)+((fs*200)/300));
// 	var maxChars = 30;
// 	if(txtArea.attr("maxChars") != 0 && txtArea.attr("maxChars") < maxLines * txtArea.attr('cols'))
// 		var maxChars = txtArea.attr("maxChars");
// 	else  
// 		var maxChars = maxLines * txtArea.attr('cols');
// 	$(txtArea.attr("name") + '_maxChars').val(maxChars);
// 	$(txtArea.attr("name") + '_maxLines').val(maxLines);
// 	countChars = txtArea.val().length;
// 	if(txtArea.val().length > maxChars || txtArea.scrollHeight > maxHeight)	{ 
// 		while (txtArea.val().length > maxChars && txtArea.scrollHeight <= maxHeight) {
// 			txtArea.val(txtArea.val().substr(0,txtArea.val().length-1));
// 			exceedMsg = "chars limit exceeded";
// 		} 
// 		while(txtArea.scrollHeight > maxHeight) {
// 			txtArea.val(txtArea.val().substr(0,txtArea.val().length-3));
// 			exceedMsg = "lines limit exceeded";
// 		}
// 	}
// 	if(exceedMsg != "" && (kc != 8 && kc != 46)) 
// 		console.log(exceedMsg);
// 	countChars = txtArea.val().length;
// }

// $('#imageTextInput').live('keyup', function(e) {
// 	var txtArea = $(this);
// 	var charsCountfield = 0;
// 	var kc = e.keyCode;
// 	checkLimits(txtArea,countChars,kc);
// });