// Firebase control script
console.log("Firebase control script loaded");

const firebaseConfig = {
    databaseURL: "https://lamp-control-81d5d-default-rtdb.firebaseio.com/"
};

try {
    const app = firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");

    const database = firebase.database();
    const lampRef = database.ref('lamp');

    const subscriptionStatus = document.getElementById('subscriptionStatus');
    const lampStateDisplay = document.getElementById('lampStateDisplay');

    function handleConnection(connected) {
        if (connected) {
            subscriptionStatus.textContent = "Connected to Firebase";
            subscriptionStatus.style.color = "#4CAF50";
            window.enableControls(); // Enable ON/OFF buttons
        } else {
            subscriptionStatus.textContent = "Disconnected from Firebase";
            subscriptionStatus.style.color = "#F44336";
        }
    }

    function handleStateChange(snapshot) {
        const state = snapshot.val() || "OFF";
        lampStateDisplay.textContent = `Lamp State: ${state}`;
        console.log("State changed to:", state);
    }

    function handleError(error) {
        console.error("Firebase error:", error);
        subscriptionStatus.textContent = "Connection error";
        subscriptionStatus.style.color = "#FF9800";
    }

    window.controlLamp = function (state) {
        if (!firebase.apps.length) {
            console.error("Firebase not initialized");
            return;
        }
        lampRef.set(state)
            .then(() => console.log("State update sent:", state))
            .catch(error => {
                console.error("Update failed:", error);
                subscriptionStatus.textContent = "Update failed - retrying";
                setTimeout(() => controlLamp(state), 1000);
            });
    };

    lampRef.on('value', handleStateChange, handleError);

    database.ref('.info/connected').on('value', (snapshot) => {
        handleConnection(snapshot.val() === true);
    });

    lampRef.once('value').then(handleStateChange).catch(handleError);

} catch (error) {
    console.error("Initialization failed:", error);
    document.getElementById('subscriptionStatus').textContent = "Initialization failed!";
    document.getElementById('subscriptionStatus').style.color = "red";
}

// 🔐 Account Options
function changePassword() {
    window.location.href = "change_password.html";
}

// Logout function
function logout() {
    localStorage.removeItem("isLoggedIn");
    alert("You have been logged out.");
    window.location.href = "index.html";
}

  

// ℹ️ Modal Info
function showInfo() {
    document.getElementById("infoModal").style.display = "block";
}

function closeInfo() {
    document.getElementById("infoModal").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("infoModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
