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
const dataLog = database.ref("logs");
const dataRT = database.ref("videoStream");

const buttonA = document.getElementById("toggle-btnA");
const buttonB = document.getElementById("toggle-btnB");
const buttonC = document.getElementById("toggle-btnC");
const buttonD = document.getElementById("toggle-btnD");

const MAX_LOG_MESSAGES = 100; // Maximum number of log messages to display

const log = document.getElementById("log");

function logMessage(message) {
    const now = new Date();
    const timestamp = now.toLocaleString();
    const logText = `${timestamp}: ${message}<br>`;
    log.innerHTML += logText;

    dataLog.update({
        logString: log.innerHTML,
      })
      .then(() => {
        console.log("Update successful");
      })
      .catch((error) => {
        console.error("Update failed: ", error);
      });


    // Scroll to the bottom of the log
    log.scrollTop = log.scrollHeight - log.clientHeight;
}




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

dataLog.on('value', (snapshot) => {
    var value = snapshot.val();
    log.innerHTML = value.logString;
});

// dataRT.on('value', (snapshot) => {
//     var value = snapshot.val();
//     console.log(value.realTimeScreenshot);
    
//     var imageElement = document.getElementById("my-image");
    
//     var screenshotB64 = value.realTimeScreenshot;
//     var screenshotBytes = Uint8Array.from(atob(screenshotB64), c => c.charCodeAt(0));
//     var screenshotBlob = new Blob([screenshotBytes], { type: 'image/png' });
//     var screenshotUrl = URL.createObjectURL(screenshotBlob);
    
//     imageElement.src = screenshotUrl;
// });

var imageElement = document.getElementById("my-image");

function getImage() {
    $.ajax({
        type: 'GET',
        url: 'https://homepivideofeed.com:5000/get_base64_image',
        success: function(response) {
            // Decode the base64-encoded image data
            console.log(response.encoded_image);
            var decoded_image_data = atob(response.encoded_image);

            // Create an Image object from the decoded data
            var img = new Image();
            imageElement.src = 'data:image/jpeg;base64,' + response.encoded_image;

            // Append the image to the DOM
            document.body.appendChild(img);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

setInterval(getImage, 100);




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
          logMessage("Desired Fan Speed updated to: " + this.value);
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
    if (!isManual) {
        sliderValueB.innerHTML = this.value; // Update the slider value in real-time
        dataRefRequests.update({
            desiredTempA: Number(this.value),
          })
          .then(() => {
            console.log("Update successful");
            logMessage("Desired Temperature updated to: " + this.value);

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
            logMessage("Desired heater status updated to: " + String(heatBoolean));
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
            logMessage("Desired light status updated to: " + String(lightBoolean));
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
            logMessage("Desired lock status updated to: " + buttonD.textContent);
          })
          .catch((error) => {
            console.error("Update failed: ", error);
          });
  });


  const clear = document.getElementById("toggle-btn-clear-log");

  clear.addEventListener("click", () => {
    clear.innerHTML = "Cleared!";
    clear.classList.add("active");


    dataLog.update({
        logString: "",
      })
      .then(() => {
        console.log("Update successful");
      })
      .catch((error) => {
        console.error("Update failed: ", error);
      });

  setTimeout(() => {
    clear.innerHTML = "Clear Log";
    clear.classList.remove("active");
  }, 1000);
  });

  function changeColor(element) {
    element.classList.toggle("clicked");
    if (element.textContent.indexOf("HomePi Automatic") !== -1) {
        element.textContent = "HomePi Manual";
        buttonA.textContent = "Off";
        buttonC.textContent = "Off";
        isManual = true;
        logMessage("Mode changed to: " + element.textContent);
    } else {
        element.textContent = "HomePi Automatic";
        buttonA.textContent = "Auto";
        buttonC.textContent = "Auto";
        isManual = false;
        logMessage("Mode changed to: " + element.textContent);
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

  


