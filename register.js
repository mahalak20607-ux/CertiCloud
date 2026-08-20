import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const registerForm =
    document.getElementById("registerForm");

const registerButton =
    document.getElementById("registerButton");

const message =
    document.getElementById("registerMessage");


function showMessage(text, type = "error") {

    message.textContent = text;

    message.className =
        `message ${type}`;

}


registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        registerButton.disabled = true;

        registerButton.textContent =
            "Creating account...";


        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            await updateProfile(
                user,
                {
                    displayName: name
                }
            );


            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: "issuer",
                    createdAt: serverTimestamp()
                }
            );


            showMessage(
                "Account created successfully. Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            let errorMessage =
                "Unable to create your account.";


            switch (error.code) {

                case "auth/email-already-in-use":

                    errorMessage =
                        "This email is already registered.";

                    break;


                case "auth/invalid-email":

                    errorMessage =
                        "Please enter a valid email address.";

                    break;


                case "auth/weak-password":

                    errorMessage =
                        "Password is too weak.";

                    break;


                case "auth/network-request-failed":

                    errorMessage =
                        "Network error. Check your internet connection.";

                    break;


                case "permission-denied":

                    errorMessage =
                        "Firebase permissions are blocking this request.";

                    break;

            }


            showMessage(
                errorMessage,
                "error"
            );


            registerButton.disabled = false;

            registerButton.textContent =
                "Create Account";

        }

    }
);