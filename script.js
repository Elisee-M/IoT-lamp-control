// Debugging initialization
console.log("Firebase control script loaded");

// Firebase Configuration
const firebaseConfig = {
    databaseURL: "https://lamp-control-81d5d-default-rtdb.firebaseio.com/"
};

try {
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
    
    const database = firebase.database();
    const lampRef = database.ref('lamp');
    
    // DOM Elements
    const subscriptionStatus = document.getElementById('subscriptionStatus');
    const lampStateDisplay = document.getElementById('lampStateDisplay');
    
    // Connection state handler
    function handleConnection(connected) {
        if (connected) {
            subscriptionStatus.textContent = "Connected to Firebase";
            subscriptionStatus.style.color = "#4CAF50";
            window.enableControls(); // Enable buttons
        } else {
            subscriptionStatus.textContent = "Disconnected from Firebase";
            subscriptionStatus.style.color = "#F44336";
        }
    }
    
    // State change handler
    function handleStateChange(snapshot) {
        const state = snapshot.val() || "OFF";
        lampStateDisplay.textContent = `Lamp State: ${state}`;
        console.log("State changed to:", state);
    }
    
    // Error handler
    function handleError(error) {
        console.error("Firebase error:", error);
        subscriptionStatus.textContent = "Connection error";
        subscriptionStatus.style.color = "#FF9800";
    }
    
    // Control function
    window.controlLamp = function(state) {
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
    
    // Set up real-time listener
    lampRef.on('value', handleStateChange, handleError);
    
    // Monitor connection state
    database.ref('.info/connected').on('value', (snapshot) => {
        handleConnection(snapshot.val() === true);
    });
    
    // Initial state fetch
    lampRef.once('value')
        .then(handleStateChange)
        .catch(handleError);

} catch (error) {
    console.error("Initialization failed:", error);
    document.getElementById('subscriptionStatus').textContent = "Initialization failed!";
    document.getElementById('subscriptionStatus').style.color = "red";
}