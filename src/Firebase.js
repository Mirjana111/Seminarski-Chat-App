import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_VSh1cXMhVnQPcCzqlj_Ih8BWnUUBPlQ",
  authDomain: "loginwith-dd3bc.firebaseapp.com",
  projectId: "loginwith-dd3bc",
  storageBucket: "loginwith-dd3bc.appspot.com",
  messagingSenderId: "67181350775",
  appId: "1:67181350775:web:d4f757e13e1deebb259b72"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = (onSuccess) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
      console.log(result);
      onSuccess && onSuccess(name); // Call the onSuccess callback with the user's name
    })
    .catch((error) => {
      console.log(error);
    });
};

