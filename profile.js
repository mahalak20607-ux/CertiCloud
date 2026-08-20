import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const loading =
    document.getElementById("profileLoading");

const content =
    document.getElementById("profileContent");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileFullName =
    document.getElementById("profileFullName");

const profileEmailDetail =
    document.getElementById("profileEmailDetail");

const profileUid =
    document.getElementById("profileUid");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileHeaderEmail =
    document.getElementById("profileHeaderEmail");

const logoutButton =
    document.getElementById("profileLogoutButton");


onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        const name =
            user.displayName ||
            user.email?.split("@")[0] ||
            "User";


        const email =
            user.email ||
            "No email";


        profileName.textContent =
            name;

        profileEmail.textContent =
            email;

        profileFullName.textContent =
            name;

        profileEmailDetail.textContent =
            email;

        profileUid.textContent =
            user.uid;

        profileHeaderEmail.textContent =
            email;


        profileAvatar.textContent =
            name
                .charAt(0)
                .toUpperCase();


        loading.classList.add(
            "hidden"
        );

        content.classList.remove(
            "hidden"
        );

    }
);


logoutButton.addEventListener(
    "click",
    async () => {

        logoutButton.disabled =
            true;

        logoutButton.textContent =
            "Logging out...";


        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            logoutButton.disabled =
                false;

            logoutButton.textContent =
                "Logout";
        }

    }
);