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

	$("form").submit((e) => {
		$.ajax({
			url: `${API_URL}.json`,
			method: "POST",
			data: JSON.stringify(createItem())
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

	$("tbody").on("click", ".complete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${id}/complete.json`,
			method: "PUT",
			data: JSON.stringify("Complete")
		});
	});

	$("tbody").on("click", ".undo_complete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${id}/complete.json`,
			method: "PUT",
			data: JSON.stringify("Incomplete")
		}).done(() => {

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
			<button class="btn btn-success complete">Complete</button>
			<button class="btn btn-warning undo_complete">Undo Complete</button>
			<button class="btn btn-danger delete">Delete</button>
		</td>
		<td class="status-text">${item.complete}</td>
	</tr>`;
	$("tbody").append(row);
	console.log("kids: ", $(row).children(".status-text"));
	if (item.complete === "Incomplete") {
		console.debug("item incomplete");
		$(row).children(".status-text").addClass("incomplete");
	} else if (item.complete === "Complete") {
		console.debug("item complete");
		$(row).children(".status-text").addClass("done");
	}
	console.log("kids after: ", $(row).children(".status-text"));
}

function Task (description) {
	this.task = description;
	this.complete = "Incomplete";
}

function createItem () {
	const newDesc = $("input[type=text]").val();
	const newTask = new Task(newDesc);
	return newTask;
}
