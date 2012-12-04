// var sketchpad = Raphael.sketchpad("editor", {
// 	width: 330,
// 	height: 220,
// 	editing: true
// });
// var pen = sketchpad.pen();

$('#imageTextInput').live('change', function(){
	var width = $('.templateTextPreview').width() + 5;
	var height = $('.templateTextPreview').height();
	$('#textWidth').val(width).trigger('input').trigger('change');
	$('#textHeight').val(height).trigger('input').trigger('change');
});