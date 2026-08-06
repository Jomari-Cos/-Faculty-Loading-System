<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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
</script>