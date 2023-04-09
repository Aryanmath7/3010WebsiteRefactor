// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBUvBfwHh9EU7G0p9JWFql96sxLEN4xrX8",
  authDomain: "comms-d888a.firebaseapp.com",
  databaseURL: "https://comms-d888a-default-rtdb.firebaseio.com/",
  projectId: "comms-d888a",
  storageBucket: "comms-d888a.appspot.com",
  messagingSenderId: "951543729690",
  appId: "1:951543729690:web:6b235bacbd1d90daaecba3",
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const dataRefUsers = database.ref('users');

function login(event) {
  event.preventDefault(); // prevent the form from submitting normally

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Check if the username and password are correct
  // Replace the following code block with the appropriate Firebase API calls
  dataRefUsers.child(username).once("value", snapshot => {    
    console.log(snapshot);
    if (snapshot.exists()) {
      // Username exists in Firebase, now check the password
      const userData = snapshot.val();
      if (userData.password === password) {
        window.location.href = `homepage.html?username=${username}`; // Redirect to success page with 'username' as query parameter
      } else {
        alert("Invalid username or password."); // Show an error message
      }
    } else {
      alert("Invalid username or password."); // Show an error message
    }
  }, error => {
    console.error(error); // Log any errors that occur while querying Firebase
  });
}

