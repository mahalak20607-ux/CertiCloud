import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const loading =
    document.getElementById(
        "certificateLoading"
    );

const errorBox =
    document.getElementById(
        "certificateError"
    );

const certificateContainer =
    document.getElementById(
        "certificateContainer"
    );

const printButton =
    document.getElementById(
        "printButton"
    );


// ==========================================
// GET CERTIFICATE ID FROM URL
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const documentId =
    urlParams.get("id");


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(value) {

    if (!value) {
        return "—";
    }


    try {

        if (
            typeof value === "string"
        ) {

            const date =
                new Date(value);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return value;
            }

            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

        }


        if (
            value &&
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );

        }


        return "—";

    } catch (error) {

        return "—";

    }

}


// ==========================================
// ESCAPE TEXT
// ==========================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.textContent =
        value || "—";

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError() {

    loading.classList.add(
        "hidden"
    );

    certificateContainer.classList.add(
        "hidden"
    );

    errorBox.classList.remove(
        "hidden"
    );

}


// ==========================================
// LOAD CERTIFICATE
// ==========================================

async function loadCertificate() {

    if (!documentId) {

        showError();

        return;

    }


    try {

        const certificateRef =
            doc(
                db,
                "certificates",
                documentId
            );


        const certificateSnapshot =
            await getDoc(
                certificateRef
            );


        if (
            !certificateSnapshot.exists()
        ) {

            showError();

            return;

        }


        const data =
            certificateSnapshot.data();


        // ==================================
        // POPULATE CERTIFICATE
        // ==================================

        setText(
            "certificateTitle",
            data.title
        );


        setText(
            "studentName",
            data.studentName
        );


        setText(
            "certificateDescription",
            data.description ||
            `Successfully completed ${data.course || "the program"}.`
        );


        setText(
            "course",
            data.course ||
            "—"
        );


        setText(
            "grade",
            data.grade ||
            "—"
        );


        setText(
            "issueDate",
            formatDate(
                data.issueDate
            )
        );


        setText(
            "certificateId",
            data.certificateId ||
            documentId
        );


        // ==================================
        // SHOW
        // ==================================

        loading.classList.add(
            "hidden"
        );

        certificateContainer.classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(
            "Certificate loading error:",
            error
        );

        showError();

    }

}


// ==========================================
// AUTH
// ==========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        loadCertificate();

    }
);


// ==========================================
// PRINT
// ==========================================

printButton.addEventListener(
    "click",
    () => {

        window.print();

    }
);