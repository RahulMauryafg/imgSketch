var sketchpad = Raphael.sketchpad("editor", {
	width: 180,
	height: 180,
	editing: true
});
var viewer = Raphael.sketchpad("viewer", {
	width: 180,
	height: 180,
	strokes: [],
	editing: false
});
var pen = sketchpad.pen();

$('.editorColor').live('click', function(){
	var color = '#' + $(this).attr('rel');
	console.log(color);
	pen.color(color);
	console.log(pen);
});

$('.editorAction').live('click', function(){
	var action = $(this).attr('rel');
	sketchpad[action]();
});

$('.penAction').live('click', function(){
	var width = $(this).attr('rel');
	pen.width(width);
});

$('#imageTextInput').live('change', function(){
	var width = $('.templateTextPreview').width() + 5;
	var height = $('.templateTextPreview').height();
	$('#textWidth').val(width).trigger('input').trigger('change');
	$('#textHeight').val(height).trigger('input').trigger('change');
});

//when the template objects are dragged, update posX/Y in form
$( ".previewDraggable" ).draggable({ containment: ".templatePreview", scroll: false, stop: function() {
		var type = $(this).attr('rel');
		var posY = $(this).position().top;
		var posX = $(this).position().left;
		if (type == 'sketch') {
			$('#sketchTop').val(posY).trigger('input').trigger('change');
			$('#sketchLeft').val(posX).trigger('input').trigger('change');
		} else {
			$('#textTop').val(posY).trigger('input').trigger('change');
			$('#textLeft').val(posX).trigger('input').trigger('change');
		}
	} 
});

// When the sketchpad changes, update the input field.
sketchpad.change(function() {
	var json = sketchpad.json();
	(json.length > 2) ?
		$("#sketchData").val(escape($('#editor').html())).trigger('input').trigger('change') :
		$("#sketchData").val('').trigger('input').trigger('change');
	viewer.json(json);
});