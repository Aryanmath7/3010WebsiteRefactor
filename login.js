// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAL89JGXu8sZvu4aGC3q_7iGuYfSFwpAKg",
  authDomain: "l2g4finaldemo.firebaseapp.com",
  databaseURL: "https://l2g4finaldemo-default-rtdb.firebaseio.com",
  projectId: "l2g4finaldemo",
  storageBucket: "l2g4finaldemo.appspot.com",
  messagingSenderId: "729348277533",
  appId: "1:729348277533:web:f27ce812662470f51c4df4"
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

