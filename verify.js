import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const verifyForm =
    document.getElementById(
        "verifyForm"
    );

const certificateIdInput =
    document.getElementById(
        "certificateId"
    );

const verifyButton =
    document.getElementById(
        "verifyButton"
    );

const verificationResult =
    document.getElementById(
        "verificationResult"
    );

const validCertificate =
    document.getElementById(
        "validCertificate"
    );

const invalidCertificate =
    document.getElementById(
        "invalidCertificate"
    );


// ==========================================
// RESULT ELEMENTS
// ==========================================

const resultStudentName =
    document.getElementById(
        "resultStudentName"
    );

const resultTitle =
    document.getElementById(
        "resultTitle"
    );

const resultCourse =
    document.getElementById(
        "resultCourse"
    );

const resultGrade =
    document.getElementById(
        "resultGrade"
    );

const resultDate =
    document.getElementById(
        "resultDate"
    );

const resultCertificateId =
    document.getElementById(
        "resultCertificateId"
    );

const viewCertificateButton =
    document.getElementById(
        "viewCertificateButton"
    );


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(value) {

    if (!value) {
        return "—";
    }


    try {

        if (
            value &&
            typeof value.toDate === "function"
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


        if (typeof value === "string") {

            const date =
                new Date(value);


            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {

                return date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );

            }

        }


        return "—";

    } catch {

        return "—";

    }

}


// ==========================================
// HIDE RESULTS
// ==========================================

function hideResults() {

    verificationResult.classList.add(
        "hidden"
    );

    validCertificate.classList.add(
        "hidden"
    );

    invalidCertificate.classList.add(
        "hidden"
    );

}


// ==========================================
// SHOW INVALID
// ==========================================

function showInvalid() {

    verificationResult.classList.remove(
        "hidden"
    );

    validCertificate.classList.add(
        "hidden"
    );

    invalidCertificate.classList.remove(
        "hidden"
    );

}


// ==========================================
// SHOW VALID
// ==========================================

function showValid(certificate) {

    verificationResult.classList.remove(
        "hidden"
    );

    invalidCertificate.classList.add(
        "hidden"
    );

    validCertificate.classList.remove(
        "hidden"
    );


    resultStudentName.textContent =
        certificate.studentName ||
        "—";


    resultTitle.textContent =
        certificate.title ||
        "—";


    resultCourse.textContent =
        certificate.course ||
        "—";


    resultGrade.textContent =
        certificate.grade ||
        "—";


    resultDate.textContent =
        formatDate(
            certificate.issueDate ||
            certificate.createdAt
        );


    resultCertificateId.textContent =
        certificate.certificateId ||
        "—";


    viewCertificateButton.href =
        `certificate-details.html?id=${encodeURIComponent(
            certificate.documentId
        )}`;

}


// ==========================================
// VERIFY
// ==========================================

async function verifyCertificate(
    certificateId
) {

    const searchId =
        certificateId
            .trim()
            .toUpperCase();


    if (!searchId) {

        return;

    }


    verifyButton.disabled =
        true;

    verifyButton.textContent =
        "Verifying...";


    hideResults();


    try {

        const certificatesRef =
            collection(
                db,
                "certificates"
            );


        /*
         * We use getDocs without orderBy
         * so no composite Firestore index
         * is required.
         */

        const snapshot =
            await getDocs(
                certificatesRef
            );


        let foundCertificate = null;


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();


                const storedId =
                    String(
                        data.certificateId ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                if (
                    storedId === searchId
                ) {

                    foundCertificate = {

                        ...data,

                        documentId:
                            documentSnapshot.id

                    };

                }

            }
        );


        if (
            foundCertificate
        ) {

            showValid(
                foundCertificate
            );

        } else {

            showInvalid();

        }


    } catch (error) {

        console.error(
            "Certificate verification error:",
            error
        );


        showInvalid();

    } finally {

        verifyButton.disabled =
            false;

        verifyButton.textContent =
            "Verify Certificate";

    }

}


// ==========================================
// FORM
// ==========================================

verifyForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        verifyCertificate(
            certificateIdInput.value
        );

    }
);