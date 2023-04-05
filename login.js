function login(event) {
  event.preventDefault(); // prevent the form from submitting normally

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // check if the username and password are correct
  if (username === "aryanmathur" && password === "1234") {
    window.location.href = "homepage.html"; // redirect to success page
  } else {
    alert("Invalid username or password."); // show an error message
  }
}
