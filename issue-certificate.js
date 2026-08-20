import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ==========================================
   ELEMENTS
========================================== */

const form =
    document.getElementById("certificateForm");

const issueButton =
    document.getElementById("issueButton");

const message =
    document.getElementById("certificateMessage");

const logoutButton =
    document.getElementById("logoutButton");

const issueDate =
    document.getElementById("issueDate");


/* ==========================================
   CURRENT USER
========================================== */

let currentUser = null;


/* ==========================================
   DEFAULT DATE
========================================== */

const today =
    new Date()
        .toISOString()
        .split("T")[0];

issueDate.value = today;


/* ==========================================
   MESSAGE
========================================== */

function showMessage(
    text,
    type = "error"
) {

    message.textContent = text;

    message.className =
        `message ${type}`;

}


/* ==========================================
   GENERATE CERTIFICATE ID
========================================== */

function generateCertificateId() {

    const year =
        new Date().getFullYear();

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let randomPart = "";

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );

        randomPart +=
            characters[randomIndex];

    }

    return `CERT-${year}-${randomPart}`;

}


/* ==========================================
   AUTH CHECK
========================================== */

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }

        currentUser = user;

    }
);


/* ==========================================
   ISSUE CERTIFICATE
========================================== */

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {

            showMessage(
                "Please login again.",
                "error"
            );

            return;

        }


        const studentName =
            document
                .getElementById("studentName")
                .value
                .trim();


        const studentEmail =
            document
                .getElementById("studentEmail")
                .value
                .trim();


        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const course =
            document
                .getElementById("course")
                .value
                .trim();


        const grade =
            document
                .getElementById("grade")
                .value
                .trim();


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const selectedDate =
            issueDate.value;


        if (!studentName) {

            showMessage(
                "Please enter the student's name.",
                "error"
            );

            return;

        }


        if (!title) {

            showMessage(
                "Please enter the certificate title.",
                "error"
            );

            return;

        }


        if (!selectedDate) {

            showMessage(
                "Please select the issue date.",
                "error"
            );

            return;

        }


        issueButton.disabled = true;

        issueButton.textContent =
            "Creating Certificate...";


        try {

            const certificateId =
                generateCertificateId();


            const certificateData = {

                certificateId,

                studentName,

                studentEmail,

                title,

                course,

                grade,

                description,

                issueDate: selectedDate,

                issuerId:
                    currentUser.uid,

                issuerEmail:
                    currentUser.email || "",

                createdAt:
                    serverTimestamp()

            };


            const certificateRef =
                await addDoc(
                    collection(
                        db,
                        "certificates"
                    ),
                    certificateData
                );


            showMessage(
                "Certificate issued successfully!",
                "success"
            );


            form.reset();


            issueDate.value =
                today;


            setTimeout(() => {

                window.location.href =
                    `certificate-details.html?id=${encodeURIComponent(
                        certificateRef.id
                    )}`;

            }, 1000);


        } catch (error) {

            console.error(
                "Certificate creation error:",
                error
            );


            let errorMessage =
                "Unable to issue certificate.";


            if (
                error.code ===
                "permission-denied"
            ) {

                errorMessage =
                    "Firebase permission denied. Check your Firestore rules.";

            }


            showMessage(
                errorMessage,
                "error"
            );


            issueButton.disabled =
                false;

            issueButton.textContent =
                "Issue Certificate";

        }

    }
);


/* ==========================================
   LOGOUT
========================================== */

logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);