<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBrqaRrm-aRwrY1siF7rgOItvOQxxsYsYU",
    authDomain: "faculty-loading-system.firebaseapp.com",
    databaseURL: "https://faculty-loading-system-default-rtdb.firebaseio.com",
    projectId: "faculty-loading-system",
    storageBucket: "faculty-loading-system.firebasestorage.app",
    messagingSenderId: "539426552220",
    appId: "1:539426552220:web:b74ef07502d03f48637059",
    measurementId: "G-PRJE18C1DN"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getDatabase(app);

  // Make database globally accessible for script.js
  window.firebaseDatabase = database;
</script>