$(() => {
	const API_URL	= "https://superproductify.firebaseio.com/";

	$.get({
		url: `${API_URL}.json`
	}).done((data) => {
			if (data === null) {
				return;
			}
			Object.keys(data).forEach((id) => {
				addItemToTable(data[id], id);
			});
		});

	$("form").submit(() => {
		$.ajax({
			url: `${API_URL}.json`,
			method: "POST",
			data: JSON.stringify({ task: "I was posted!" })
		});
	})

	$('tbody').on("click", ".delete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${id}.json`,
			method: "DELETE"
		}).done(() => {
			row.remove();
		});
	});

})

// CREATE: form submit event to POST data to firebase

// READ: GET data from firebase and display in table

// UPDATE: click event on complete to edit task

// DELETE: click event on delete to delete task

function addItemToTable (item, id) {
	const row = `<tr data-id="${id}">
		<td>${item.task}</td>
		<td>
			<button class="btn btn-success">Complete</button>
			<button class="btn btn-danger delete">Delete</button>
		</td>
	</tr>`;
	$("tbody").append(row);
}
