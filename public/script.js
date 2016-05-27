$(() => {
	const API_URL	= "https://superproductify.firebaseio.com/";
	let token = null;

	const getTasks = () => {
		$.get({
			url: `${API_URL}.json?auth=${token}`
		}).done((data) => {
				if (data === null) {
					return;
				}
				Object.keys(data).forEach((id) => {
					addItemToTable(data[id], id);
				});
			});
	}

	$(".add form").submit((e) => {
		// e.preventDefault();
		$.ajax({
			url: `${API_URL}.json`,
			method: "POST",
			data: JSON.stringify(createItem())
		}).done();
	})

	$('tbody').on("click", ".delete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${id}.json?auth=${token}`,
			method: "DELETE"
		}).done(() => {
			row.remove();
		});
	});

	$("tbody").on("click", ".complete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${id}/complete.json?auth=${token}`,
			method: "PUT",
			data: JSON.stringify("Complete")
		}).done(() => {
			row.children(".status-text").attr("value", "Complete");
			row.children(".status-text").text("Complete");
			completeColor(row);
		});
	});

	$("tbody").on("click", ".undo_complete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${id}/complete.json?auth=${token}`,
			method: "PUT",
			data: JSON.stringify("Incomplete")
		}).done(() => {
			row.children(".status-text").attr("value", "Incomplete");
			row.children(".status-text").text("Incomplete");
			completeColor(row);
		});
	});

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBdk1zTU2crZvALCbJmyGqKVhmaWc_Ug34",
    authDomain: "superproductify.firebaseapp.com",
    databaseURL: "https://superproductify.firebaseio.com",
    storageBucket: "superproductify.appspot.com",
  };
  firebase.initializeApp(config);

// const login = (email, password) => (
//   firebase.auth().signInWithEmailAndPassword(email, password)
// )

// const register = (user, password) => (
//   firebase.auth().createUserWithEmailAndPassword(user, password)
// )

//   $('.login form').submit((e) => {
//     const form = $(e.target);
//     const email = form.find('input[type="text"]').val();
//     const password = form.find('input[type="password"]').val();

//     login(email, password)
//       .then(console.log)
//       .catch(console.err)

//     e.preventDefault()
//   })

//   $('input[value="Register"]').click((e) => {
//     const form = $(e.target).closest('form');
//     const email = form.find('input[type="text"]').val();
//     const password = form.find('input[type="password"]').val();

//     register(email, password)
//       .then(() => login(email, password))
//       .then(console.log)
//       .catch(console.err)

//     e.preventDefault()
//   })

})


// CREATE: form submit event to POST data to firebase

// READ: GET data from firebase and display in table

// UPDATE: click event on complete to edit task

// DELETE: click event on delete to delete task

function addItemToTable (item, id) {
	const row = $(`<tr data-id="${id}">
		<td>${item.task}</td>
		<td>
			<button class="btn btn-success complete">Complete</button>
			<button class="btn btn-warning undo_complete">Undo Complete</button>
			<button class="btn btn-danger delete">Delete</button>
		</td>
		<td class="status-text" value="${(item.complete)}">${item.complete}</td>
	</tr>`);
	$("tbody").append(row);
	completeColor(row, item);
}

function completeColor (row) {
	let status = row.children(".status-text").attr("value");
	if (status === "Incomplete") {
			row.children(".status-text").addClass("incomplete").removeClass("done");
		} else if (status === "Complete") {
			row.children(".status-text").addClass("done").removeClass("incomplete");
	}
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
