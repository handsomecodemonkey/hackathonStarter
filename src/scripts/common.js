function getTasksForDomain(domainId) {

	$.getJSON('/tasksForDomain/' + domainId,function(data){
		console.log(data);
		for(var i = 0; i < data.length; i++){
			var task = data[i];
			$('#tasks-list').append('<li class="collection-item"><h5>' + task.title + '</h5><p>'+ task.description + '</p></li>');
		}
	});

}


document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
  });
