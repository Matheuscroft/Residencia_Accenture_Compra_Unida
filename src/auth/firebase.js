import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/*const firebaseConfig = {
  apiKey: "AIzaSyCX5XLeSoA6zSQ3q_JYqy5s-nCfwxGkkIc",
  authDomain: "compra-unida.firebaseapp.com",
  projectId: "compra-unida",
  storageBucket: "compra-unida.appspot.com",
  messagingSenderId: "391334868161",
  appId: "1:391334868161:web:04aaba94022bb4d98ed040"
};*/

const firebaseConfig = {
  apiKey: "AIzaSyDQyVFyLAoOQp_dFiEgxG9uUe6LoBbkRUs",
  authDomain: "parte-2-8a33d.firebaseapp.com",
  projectId: "parte-2-8a33d",
  storageBucket: "parte-2-8a33d.appspot.com",
  messagingSenderId: "661911123578",
  appId: "1:661911123578:web:ce59be7d370c4e37e8adc3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);

export const db = getFirestore(app);