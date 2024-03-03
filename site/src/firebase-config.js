import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAcMPaGAb8ivJ2u1RkyjSl4JoCI4zHfJro",
    authDomain: "team20-e9c98.firebaseapp.com",
    databaseURL: "https://team20-e9c98-default-rtdb.firebaseio.com",
    projectId: "team20-e9c98",
    storageBucket: "team20-e9c98.appspot.com",
    messagingSenderId: "1067700620122",
    appId: "1:1067700620122:web:7c519531f11d5d631fc163",
    measurementId: "G-JFQ1C3BJLT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
