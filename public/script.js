$(() => {
	const API_URL	= "https://superproductify.firebaseio.com/.json";

	$.get({
		url: API_URL
	}).done((data) => {
			if (data === null) {
				return;
			}
			Object.keys(data).forEach((key) => {
				addItemToTable(data[key]);
			});
		});

	$("form").submit(() => {
		$.ajax({
			url: API_URL,
			method: "POST",
			data: JSON.stringify({ task: "I was posted!" })
		});
	})

})

// CREATE: form submit event to POST data to firebase

// READ: GET data from firebase and display in table

// UPDATE: click event on complete to edit task

// DELETE: click event on delete to delete task

function addItemToTable (item) {
	const row = `<tr><td>${item.task}</td><td><button class="btn btn-success">Complete</button><button class="btn btn-danger">Delete</button></td></tr>`;
	$("tbody").append(row);
}
