// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX5XLeSoA6zSQ3q_JYqy5s-nCfwxGkkIc",
  authDomain: "compra-unida.firebaseapp.com",
  projectId: "compra-unida",
  storageBucket: "compra-unida.appspot.com",
  messagingSenderId: "391334868161",
  appId: "1:391334868161:web:04aaba94022bb4d98ed040"
};

/*const firebaseConfig = {
    apiKey: "AIzaSyCMM0TqmaLeO_0nRU4C6of4s4V8xq4oYHM",
    authDomain: "projeto-residencia-dd823.firebaseapp.com",
    projectId: "projeto-residencia-dd823",
    storageBucket: "projeto-residencia-dd823.appspot.com",
    messagingSenderId: "755601312431",
    appId: "1:755601312431:web:d6095bc1e4a6692ce3a25a",
    measurementId: "G-3LZT7FN92J"
  };*/

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);

export default getFirestore(app);