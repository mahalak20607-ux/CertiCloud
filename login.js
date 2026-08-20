import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const loginForm =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");

const message =
    document.getElementById("loginMessage");


function showMessage(text, type = "error") {

    message.textContent = text;

    message.className =
        `message ${type}`;

}


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;


        loginButton.disabled = true;

        loginButton.textContent =
            "Signing in...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 700);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            let errorMessage =
                "Unable to sign in.";


            switch (error.code) {

                case "auth/invalid-credential":

                    errorMessage =
                        "Incorrect email or password.";

                    break;


                case "auth/user-not-found":

                    errorMessage =
                        "No account found with this email.";

                    break;


                case "auth/wrong-password":

                    errorMessage =
                        "Incorrect password.";

                    break;


                case "auth/invalid-email":

                    errorMessage =
                        "Please enter a valid email address.";

                    break;


                case "auth/too-many-requests":

                    errorMessage =
                        "Too many attempts. Please try again later.";

                    break;


                case "auth/network-request-failed":

                    errorMessage =
                        "Network error. Check your internet connection.";

                    break;

            }


            showMessage(
                errorMessage,
                "error"
            );


            loginButton.disabled = false;

            loginButton.textContent =
                "Sign In";

        }

    }
);