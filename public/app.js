$.ajax({
	url: "/articles",
	method: "GET",
	contentType: "application/json",
	success: function(data) {
		console.log(data);
		for(i=0; i < data.length; i++) {

			var html = '<br><div id="article" data-id='+data[i]._id+'class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title"><a href='+data[i].url+'>'
			+data[i].headline+'</a></h3></div><div class="panel-body">'
			+data[i].summary+'</div></div>'

			var cInputBox = '<div class="form-group"><label for="comment">Comment:</label>'
			+'<textarea class="form-control" rows="2" id="comment"></textarea><br><input data-id='+data[i]._id+'id="commentIn" class="btn btn-primary" type="submit" value="Submit"></div>'
			var cDisplay = '<p><label for="comment">user comment</label>'+data.comment+'</p>;'

			$('#articles').append(html);
			if(data.comment) {
				$('#articles').append(cDisplay);
			}
			$('#articles').append(cInputBox);
		}
	}
});

// comment posting functionality broken; need to append to "article" div (will show up below comment box)

// $('#commentIn').on('click', function() {
// 	var artId = $(this).attr('data-id');
// 	('#article').append($("#comment").val());

// Add another onclick event below which will contain the ajax POST call to post the data in the comment field to the database
// $.ajax({
// 	url: "/articles"+artId,
// 	method: "POST",
// 	contentType: "application/json",
// 	success: function(data) {}
// })

// });