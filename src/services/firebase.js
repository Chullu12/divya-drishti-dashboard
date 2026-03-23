import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your exact Divya-Drishti Database credentials
const firebaseConfig = {
    apiKey: "AIzaSyAWFoALX9qKeCvnECmJJ_DmH6l07CUbJFY",
    databaseURL: "https://divya-drishti-d71bc-default-rtdb.firebaseio.com/",
    projectId: "divya-drishti-d71bc"
};

// Initialize Firebase and export the database connection
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);