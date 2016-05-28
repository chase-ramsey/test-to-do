$(() => {
	const API_URL	= "https://superproductify.firebaseio.com/task";
	let token = null;
	let userID = null;

	const getTasks = () => {
		$.get({
			url: `${API_URL}/${userID}.json?auth=${token}`
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
		e.preventDefault();
		$.ajax({
			url: `${API_URL}/${userID}.json?auth=${token}`,
			method: "POST",
			data: JSON.stringify(createItem())
		}).done(() => {
			$("tbody").empty();
			$(".add input[type='text']").val("");
			getTasks();
		});
	})

	$("tbody").on("click", ".delete", (e) => {
		const row = $(e.target).closest("tr");
		const taskID = row.data("id");
		$.ajax({
			url: `${API_URL}/${userID}/${taskID}.json?auth=${token}`,
			method: "DELETE"
		}).done(() => {
			row.remove();
		});
	});

	$("tbody").on("click", ".complete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${userID}/${id}/complete.json?auth=${token}`,
			method: "PUT",
			data: JSON.stringify("Complete")
		}).done(() => {
			row.children(".status-text").attr("value", "Complete");
			row.children(".status-text").text("Complete");
			row.find(".complete").attr("disabled", "disabled");
			row.find(".undo_complete").removeAttr("disabled");
			completeStatus(row);
		});
	});

	$("tbody").on("click", ".undo_complete", (e) => {
		const row = $(e.target).closest("tr");
		const id = row.data("id");
		$.ajax({
			url: `${API_URL}/${userID}/${id}/complete.json?auth=${token}`,
			method: "PUT",
			data: JSON.stringify("Incomplete")
		}).done(() => {
			row.children(".status-text").attr("value", "Incomplete");
			row.children(".status-text").text("Incomplete");
			row.find(".undo_complete").attr("disabled", "disabled");
			row.find(".complete").removeAttr("disabled");
			completeStatus(row);
		});
	});

	$(".logout").click(() => {
		firebase.auth().signOut();
		$(".log_text").text("Not logged in");
		$(".logout").attr("disabled", "disabled");
		$("tbody").empty();
	});

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBdk1zTU2crZvALCbJmyGqKVhmaWc_Ug34",
    authDomain: "superproductify.firebaseapp.com",
    databaseURL: "https://superproductify.firebaseio.com",
    storageBucket: "superproductify.appspot.com",
  };
  firebase.initializeApp(config);

// login/register functions
	// takes email and password values gathered on submit
	// passes them into the firebase auth() sign-in method, which returns a user

  const login = (user_email, user_password) => {
  	return firebase.auth()
  		.signInWithEmailAndPassword(user_email, user_password);
  }

  const register = (user_email, user_password) => {
  	return firebase.auth()
  		.createUserWithEmailAndPassword(user_email, user_password);
  }

// Using parentheses a la ES6 would alleviate the need to include the return statement in the functions above
// I'm leaving them in for now so I can see better exactly how values are getting passed around
	// The firebase promise is returning the user object into the login/register functions...
	// ...but they have to be returned out of the login/register functions to be used later
	// Again, ES6 anonymous functions with parentheses (instead of brackets) automatically return the result, so no return statements would be needed

  $(".login form").submit((e) => {
  	const form = $(e.target);
  	const email = form.find("input[type='text']").val();
  	const password = form.find("input[type='password']").val();
  	login(email, password)
  		.then(console.log)
  		.catch((error) => {
  			alert(error);
  			console.error(error);
  		});
		e.preventDefault();
  });

  $("input[value='Register']").click((e) => {
  	const form = $(e.target).closest("form");
  	const email = form.find("input[type='text']").val();
  	const password = form.find("input[type='password']").val();
  	register(email, password)
  		.then(() => login(email, password))
  		.then(console.log)
  		.catch(console.error);
		e.preventDefault();
  });

  firebase.auth().onAuthStateChanged((user) => {
  	if (user) {

  		$(".login").hide();
  		$(".login input[type='text']").val("");
  		$(".login input[type='password']").val("");

  		$(".app").show();
  		$(".log_text").text(`Logged in as ${user.email}`);
  		$(".logout").removeAttr("disabled");

  		userID = user.uid;
  		user.getToken()
  		.then(t => token = t)
  		.then(getTasks);

  	} else {
  		$(".app").hide();
  		$(".login").show();
  	}
  });

})

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
	completeStatus(row, item);
}

function completeStatus (row) {
	let status = row.children(".status-text").attr("value");
	if (status === "Incomplete") {
			row.children(".status-text").addClass("incomplete").removeClass("done");
			row.find(".undo_complete").attr("disabled", "disabled");
		} else if (status === "Complete") {
			row.children(".status-text").addClass("done").removeClass("incomplete");
			row.find(".complete").attr("disabled", "disabled");
	}
}

function Task (description) {
	this.task = description;
	this.complete = "Incomplete";
}

function createItem () {
	const form = $(".add form");
	const newDesc = form.find("input[type='text']").val();
	const newTask = new Task(newDesc);
	return newTask;
}
