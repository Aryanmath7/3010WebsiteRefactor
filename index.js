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
const dataRefRequests = database.ref("Requests");
const dataRefTL = database.ref("RPITL");

const buttonA = document.getElementById("toggle-btnA");
const buttonB = document.getElementById("toggle-btnB");
const buttonC = document.getElementById("toggle-btnC");
const buttonD = document.getElementById("toggle-btnD");

dataRefTL.on('value', (snapshot) => {
    var value = snapshot.val();
    // Display the value on the HTML page
    document.getElementById("temp-container").innerHTML = value.curTemp;  
    document.getElementById("desired-temp-container").innerHTML = value.desiredTemp;  
    document.getElementById("heater-state").innerHTML = value.heaterState;  
    document.getElementById("light-state").innerHTML = value.lightState;  
    document.getElementById("fan-speed").innerHTML = value.fanSpeed;  
    document.getElementById("desired-fan-speed").innerHTML = value.desiredFanSpeed;  


});

dataRefRequests.once('value').then(function(snapshot) {
    var value = snapshot.val();

    document.getElementById("slider-valueA").innerHTML = value.desiredFanSpeedA;  
    document.getElementById("sliderA").value = value.desiredFanSpeedA;  

    document.getElementById("slider-valueB").innerHTML = value.desiredTempA;  
    document.getElementById("sliderB").value = value.desiredTempA;

    if (value.desiredHeaterStatusA == true){
        buttonA.classList.remove("off");
        buttonA.classList.add("on");
        buttonA.textContent = "On";
    }
    else{
        buttonA.classList.remove("on");
        buttonA.classList.add("off");  
        buttonA.textContent = "Off";  
    }

    if (value.desiredLightStatusA == true){
        buttonC.classList.remove("off");
        buttonC.classList.add("on");
        buttonC.textContent = "On";
    }
    else{
        buttonC.classList.remove("on");
        buttonC.classList.add("off");  
        buttonC.textContent = "Off";  
    }

    if (value.desiredLockStatusA == true){
        buttonD.classList.remove("off");
        buttonD.classList.add("on");
        buttonD.textContent = "Locked";
    }
    else{
        buttonD.classList.remove("on");
        buttonD.classList.add("off");  
        buttonD.textContent = "Unlocked";  
    }

});



let isManual = true;
var sliderA = document.getElementById("sliderA");
var sliderValueA = document.getElementById("slider-valueA");

sliderValueA.innerHTML = sliderA.value; // Set the initial value of the slider

sliderA.oninput = function() {
    if (isManual) {
        sliderValueA.innerHTML = this.value; // Update the slider value in real-time
        dataRefRequests.update({
          desiredFanSpeedA: Number(this.value),
        })
        .then(() => {
          console.log("Update successful");
        })
        .catch((error) => {
          console.error("Update failed: ", error);
        });
    }
}

var sliderB = document.getElementById("sliderB");
var sliderValueB = document.getElementById("slider-valueB");

sliderValueB.innerHTML = sliderB.value; // Set the initial value of the slider

sliderB.oninput = function() {
    if (isManual) {
        sliderValueB.innerHTML = this.value; // Update the slider value in real-time
        dataRefRequests.update({
            desiredTempA: Number(this.value),
          })
          .then(() => {
            console.log("Update successful");
          })
          .catch((error) => {
            console.error("Update failed: ", error);
          });
    }
}





buttonA.addEventListener("click", function() {
    if (isManual) {
        if (buttonA.classList.contains("off")) {
            buttonA.classList.remove("off");
            buttonA.classList.add("on");
            buttonA.textContent = "On";
        } else {
            buttonA.classList.remove("on");
            buttonA.classList.add("off");
            buttonA.textContent = "Off";
        }

        if (buttonA.classList.contains("on")){
            var heatBoolean = true;
        }
        else{
            var heatBoolean = false;
        }

        
        dataRefRequests.update({
            desiredHeaterStatusA: heatBoolean,
          })
          .then(() => {
            console.log("Update successful");
          })
          .catch((error) => {
            console.error("Update failed: ", error);
          });
    }
});

  
  buttonC.addEventListener("click", function() {
    if (isManual) {
        if (buttonC.classList.contains("off")) {
            buttonC.classList.remove("off");
            buttonC.classList.add("on");
            buttonC.textContent = "On";
        } else {
            buttonC.classList.remove("on");
            buttonC.classList.add("off");
            buttonC.textContent = "Off";
        }

        if (buttonC.classList.contains("on")){
            var lightBoolean = true;
        }
        else{
            var lightBoolean = false;
        }

        
        dataRefRequests.update({
            desiredLightStatusA: lightBoolean,
          })
          .then(() => {
            console.log("Update successful");
          })
          .catch((error) => {
            console.error("Update failed: ", error);
          });


    }
  });

  buttonD.addEventListener("click", function() {
        if (buttonD.classList.contains("off")) {
            buttonD.classList.remove("off");
            buttonD.classList.add("on");
            buttonD.textContent = "Locked";
        } else {
            buttonD.classList.remove("on");
            buttonD.classList.add("off");
            buttonD.textContent = "Unlocked";
        }
        if (buttonD.classList.contains("on")){
            var lockBoolean = true;
        }
        else{
            var lockBoolean = false;
        }

        dataRefRequests.update({
            desiredLockStatusA: lockBoolean,
          })
          .then(() => {
            console.log("Update successful");
          })
          .catch((error) => {
            console.error("Update failed: ", error);
          });
  });

  function changeColor(element) {
    element.classList.toggle("clicked");
    if (element.textContent.indexOf("HomePi Automatic") !== -1) {
        element.textContent = "HomePi Manual";
        buttonA.textContent = "Off";
        buttonC.textContent = "Off";
        isManual = true;
    } else {
        element.textContent = "HomePi Automatic";
        buttonA.textContent = "Auto";
        buttonC.textContent = "Auto";
        isManual = false;
    }
    dataRefRequests.update({
        isAuto: !isManual,
      })
      .then(() => {
        console.log("Update successful");
      })
      .catch((error) => {
        console.error("Update failed: ", error);
      });   
  }