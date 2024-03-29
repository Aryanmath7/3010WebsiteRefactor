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

// Get the value of the 'username' query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');


const database = firebase.database();

const databaseMain = database.ref('users/'+username);
const dataRefTL = database.ref('users/'+username+'/RPITL');
const dataRefRequests = database.ref('users/'+username+'/Requests');
const dataLog = database.ref('users/'+username +'/logs');
const dataFD = database.ref('users/'+username+'/RPIDoorLock');

const buttonA = document.getElementById("toggle-btnA");
const buttonB = document.getElementById("toggle-btnB");
const buttonC = document.getElementById("toggle-btnC");
const buttonD = document.getElementById("toggle-btnD");
const titleCont = document.getElementById("automan");

var isManual;

const MAX_LOG_MESSAGES = 100; // Maximum number of log messages to display
const log = document.getElementById("log");

function logMessage(message) {
  const now = new Date();
  const timestamp = now.toLocaleString();
  const logText = `${timestamp}: ${message}<br>`;
  log.innerHTML += logText;

  dataLog
    .update({
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

dataRefTL.on("value", (snapshot) => {
  var value = snapshot.val();
  // Display the value on the HTML page
  document.getElementById("temp-container").innerHTML = value.curTemp;

  document.getElementById("heater-state").innerHTML = String(
    value.heaterState
  ).toUpperCase();
  document.getElementById("light-state").innerHTML = String(
    value.lightState
  ).toUpperCase();
  document.getElementById("fan-speed").innerHTML = value.fanSpeed;
});

dataFD.on("value", (snapshot) => {
  var value = snapshot.val();
  document.getElementById("lock-state").innerHTML = String(value.lockState).toUpperCase();
});



dataLog.on("value", (snapshot) => {
  var value = snapshot.val();
  log.innerHTML = value.logString;
});


var imageElement = document.getElementById("my-image");

function getImage() {
  $.ajax({
    type: "GET",
    url: "https://homepivideofeed.com:5000/get_base64_image",
    success: function (response) {
      // Decode the base64-encoded image data
      var decoded_image_data = atob(response.encoded_image);

      // Create an Image object from the decoded data
      var img = new Image();
      imageElement.src = "data:image/jpeg;base64," + response.encoded_image;

      // Append the image to the DOM
      document.body.appendChild(img);
      console.log("ooga");
    },
    error: function (error) {
      console.log(error);
    },
  });
}
setInterval(getImage, 100);

//set all initial
dataRefRequests.once("value").then(function (snapshot) {
  var value = snapshot.val();

  document.getElementById("slider-valueA").innerHTML = value.desiredFanSpeed;
  document.getElementById("sliderA").value = value.desiredFanSpeed;

  document.getElementById("slider-valueB").innerHTML = value.desiredTemp;
  document.getElementById("sliderB").value = value.desiredTemp;

  if (value.desiredHeaterState == true) {
    buttonA.classList.remove("off");
    buttonA.classList.add("on");
    buttonA.textContent = "ON";
  } else {
    buttonA.classList.remove("on");
    buttonA.classList.add("off");
    buttonA.textContent = "OFF";
  }

  if (value.desiredLightState == true) {
    buttonC.classList.remove("off");
    buttonC.classList.add("on");
    buttonC.textContent = "ON";
  } else {
    buttonC.classList.remove("on");
    buttonC.classList.add("off");
    buttonC.textContent = "OFF";
  }

  if (value.desiredLockState == true) {
    buttonD.classList.remove("off");
    buttonD.classList.add("on");
    buttonD.textContent = "LOCKED";
  } else {
    buttonD.classList.remove("on");
    buttonD.classList.add("off");
    buttonD.textContent = "UNLOCKED";
  }

  if (value.isAuto == true){
    isManual = false;
    titleCont.classList.toggle("clicked");
    titleCont.textContent = "HomePi Automatic";
    buttonA.textContent = "AUTO";
    //buttonA.style.backgroundColor = "#000000";
    buttonC.textContent = "AUTO";
    //buttonC.style.backgroundColor = "#000000";
    tempSlider.style.display = "";
    fanSlider.style.display = "none";
  }
  else{
    isManual = true;
    tempSlider.style.display = "none";
    fanSlider.style.display = "";
  }

});


var sliderA = document.getElementById("sliderA");
var fanSlider = document.getElementById("fanSlider");
var sliderValueA = document.getElementById("slider-valueA");

sliderValueA.innerHTML = sliderA.value; // Set the initial value of the slider

sliderA.oninput = function () {
  if (isManual) {
    sliderValueA.innerHTML = this.value; // Update the slider value in real-time
    dataRefRequests
      .update({
        desiredFanSpeed: Number(this.value),
      })
      .then(() => {
        console.log("Update successful");
        logMessage("Desired Fan Speed updated to: " + this.value);
      })
      .catch((error) => {
        console.error("Update failed: ", error);
      });
  }
};

var sliderB = document.getElementById("sliderB");
var tempSlider = document.getElementById("tempSlider");
var sliderValueB = document.getElementById("slider-valueB");

sliderValueB.innerHTML = sliderB.value; // Set the initial value of the slider

sliderB.oninput = function () {
  if (!isManual) {
    sliderValueB.innerHTML = this.value; // Update the slider value in real-time
    dataRefRequests
      .update({
        desiredTemp: Number(this.value),
      })
      .then(() => {
        console.log("Update successful");
        logMessage("Desired Temperature updated to: " + this.value);
      })
      .catch((error) => {
        console.error("Update failed: ", error);
      });
  }
};

buttonA.addEventListener("click", function () {
  if (isManual) {
    if (buttonA.classList.contains("off")) {
      buttonA.classList.remove("off");
      buttonA.classList.add("on");
      buttonA.textContent = "ON";
    } else {
      buttonA.classList.remove("on");
      buttonA.classList.add("off");
      buttonA.textContent = "OFF";
    }

    if (buttonA.classList.contains("on")) {
      var heatBoolean = true;
    } else {
      var heatBoolean = false;
    }

    dataRefRequests
      .update({
        desiredHeaterState: heatBoolean,
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

buttonC.addEventListener("click", function () {
  if (isManual) {
    if (buttonC.classList.contains("off")) {
      buttonC.classList.remove("off");
      buttonC.classList.add("on");
      buttonC.textContent = "ON";
    } else {
      buttonC.classList.remove("on");
      buttonC.classList.add("off");
      buttonC.textContent = "OFF";
    }

    if (buttonC.classList.contains("on")) {
      var lightBoolean = true;
    } else {
      var lightBoolean = false;
    }

    dataRefRequests
      .update({
        desiredLightState: lightBoolean,
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

buttonD.addEventListener("click", function () {
  if (buttonD.classList.contains("off")) {
    buttonD.classList.remove("off");
    buttonD.classList.add("on");
    buttonD.textContent = "LOCKED";
  } else {
    buttonD.classList.remove("on");
    buttonD.classList.add("off");
    buttonD.textContent = "UNLOCKED";
  }
  if (buttonD.classList.contains("on")) {
    var lockBoolean = true;
  } else {
    var lockBoolean = false;
  }

  dataRefRequests
    .update({
      desiredLockState: lockBoolean,
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
  clear.innerHTML = "CLEARED";
  clear.classList.add("active");

  dataLog
    .update({
      logString: "",
    })
    .then(() => {
      console.log("Update successful");
    })
    .catch((error) => {
      console.error("Update failed: ", error);
    });

  setTimeout(() => {
    clear.innerHTML = "CLEAR-LOG";
    clear.classList.remove("active");
  }, 1000);
});

function changeColor(element) {
  element.classList.toggle("clicked");
  if (element.textContent.indexOf("HomePi Automatic") !== -1) {
    element.textContent = "HomePi Manual";
    buttonA.textContent = "OFF";
    buttonC.textContent = "OFF";
    tempSlider.style.display = "none";
    fanSlider.style.display = "";
    isManual = true;
    logMessage("Mode changed to: " + element.textContent);
  } else {
    element.textContent = "HomePi Automatic";
    buttonA.textContent = "AUTO";
    buttonC.textContent = "AUTO";
    tempSlider.style.display = "";
    fanSlider.style.display = "none";
    isManual = false;
    logMessage("Mode changed to: " + element.textContent);
  }
  dataRefRequests
    .update({
      isAuto: !isManual,
    })
    .then(() => {
      console.log("Update successful");
    })
    .catch((error) => {
      console.error("Update failed: ", error);
    });
}

const data = {
  labels: [],
  datasets: [
    {
      label: "Temperature",
      data: [],
      backgroundColor: "rgba(0, 255, 0, 0.2)",
      borderColor: "rgba(0, 255, 0, 1)",
      borderWidth: 1,
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {
    scales: {
      y: {
        min: 20,
        max: 50,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "TEMPERATURE",
        color: "rgba(255, 255, 255, 1)", // Set title color here
        font: {
          family: "Courier, monospace",
          size: 18,
          weight: "bold",
        },
      },
      legend: {
        display: false,
      },
    },
  },
};

const ctx = document.getElementById("graph").getContext("2d");
const chart = new Chart(ctx, config);

function updateChart() {
  dataRefTL.once("value").then(function (snapshot) {
    var value = snapshot.val();
    var newTemperature = value.curTemp;

    const currentTime = new Date().toLocaleTimeString();

    // Add new data to chart
    chart.data.labels.push(currentTime);
    chart.data.datasets[0].data.push(newTemperature);

    // Remove oldest data if chart has too many data points
    if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    // Update chart
    chart.update();
  });

  // Call updateChart() again after 1 second
  setTimeout(updateChart, 5000);
}

// Start updating the chart
updateChart();


const contDiv = document.getElementById('cont');
const thermoDiv = document.getElementById('obs');
const otherDriv = document.getElementById('other');

// Function to update flex-direction based on screen width
function updateFlexDirection() {
  console.log('hello?');
  if (window.innerWidth < 760) {
    contDiv.style.flexDirection = 'column';
    thermoDiv.style.width = '100%';
    otherDriv.style.width = '100%';
  } else {
    contDiv.style.flexDirection = 'row';
    thermoDiv.style.width = '50%';
    otherDriv.style.width = '50%';
  }
}

// Call the function on page load
updateFlexDirection();

// Call the function on window resize
window.addEventListener('resize', updateFlexDirection);

