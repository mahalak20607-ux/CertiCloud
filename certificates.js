import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const loading =
    document.getElementById("certificatesLoading");

const tableWrapper =
    document.getElementById("certificateTableWrapper");

const tableBody =
    document.getElementById("certificateTableBody");

const emptyState =
    document.getElementById("certificatesEmpty");

const errorBox =
    document.getElementById("certificatesError");

const errorText =
    document.getElementById("errorText");

const retryButton =
    document.getElementById("retryButton");

const searchInput =
    document.getElementById("searchInput");

const certificateCount =
    document.getElementById("certificateCount");

const logoutButton =
    document.getElementById("logoutButton");


// ==========================================
// VARIABLES
// ==========================================

let currentUser = null;
let allCertificates = [];


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(value) {

    if (!value) {
        return "—";
    }

    try {

        if (typeof value === "string") {

            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return value;
            }

            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
        }


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
                        month: "short",
                        year: "numeric"
                    }
                );
        }

        return "—";

    } catch {

        return "—";

    }
}


// ==========================================
// GET TIME
// ==========================================

function getTime(value) {

    if (!value) {
        return 0;
    }

    try {

        if (
            value &&
            typeof value.toDate === "function"
        ) {
            return value.toDate().getTime();
        }

        if (typeof value === "string") {
            return new Date(value).getTime();
        }

    } catch {
        return 0;
    }

    return 0;
}


// ==========================================
// UI STATES
// ==========================================

function hideAllStates() {

    loading.classList.add("hidden");

    tableWrapper.classList.add("hidden");

    emptyState.classList.add("hidden");

    errorBox.classList.add("hidden");

}


function showLoading() {

    hideAllStates();

    loading.classList.remove("hidden");

}


function showEmpty() {

    hideAllStates();

    emptyState.classList.remove("hidden");

}


function showError(text) {

    hideAllStates();

    errorText.textContent =
        text || "Unable to load certificates.";

    errorBox.classList.remove("hidden");

}


// ==========================================
// LOAD CERTIFICATES
// ==========================================

async function loadCertificates() {

    if (!currentUser) {
        return;
    }

    showLoading();

    try {

        /*
         * IMPORTANT:
         * No orderBy() here.
         *
         * Therefore Firestore does not need
         * a composite index.
         */

        const certificatesQuery = query(
            collection(db, "certificates"),
            where(
                "issuerId",
                "==",
                currentUser.uid
            )
        );


        const snapshot =
            await getDocs(
                certificatesQuery
            );


        allCertificates =
            snapshot.docs.map(
                item => ({
                    id: item.id,
                    ...item.data()
                })
            );


        // Sort locally instead of using
        // Firestore orderBy()

        allCertificates.sort(
            (a, b) => {

                const timeA =
                    getTime(
                        a.createdAt ||
                        a.issueDate
                    );

                const timeB =
                    getTime(
                        b.createdAt ||
                        b.issueDate
                    );

                return timeB - timeA;

            }
        );


        certificateCount.textContent =
            allCertificates.length;


        renderCertificates(
            allCertificates
        );


    } catch (error) {

        console.error(
            "Certificate loading error:",
            error
        );


        showError(
            error.message ||
            "Unable to load certificates."
        );

    }
}


// ==========================================
// RENDER
// ==========================================

function renderCertificates(
    certificates
) {

    if (!certificates.length) {

        showEmpty();

        return;

    }


    hideAllStates();

    tableWrapper.classList.remove(
        "hidden"
    );


    tableBody.innerHTML =
        certificates.map(
            certificate => {

                const documentId =
                    escapeHTML(
                        certificate.id
                    );


                const certificateId =
                    escapeHTML(
                        certificate.certificateId ||
                        certificate.id
                    );


                const studentName =
                    escapeHTML(
                        certificate.studentName ||
                        "Unknown Student"
                    );


                const studentEmail =
                    escapeHTML(
                        certificate.studentEmail ||
                        ""
                    );


                const title =
                    escapeHTML(
                        certificate.title ||
                        "Certificate"
                    );


                const course =
                    escapeHTML(
                        certificate.course ||
                        "—"
                    );


                const date =
                    formatDate(
                        certificate.issueDate ||
                        certificate.createdAt
                    );


                const initial =
                    studentName
                        .charAt(0)
                        .toUpperCase();


                return `

                    <tr>

                        <td>

                            <div class="table-student">

                                <div class="table-avatar">
                                    ${initial}
                                </div>

                                <div>

                                    <strong>
                                        ${studentName}
                                    </strong>

                                    <span>
                                        ${studentEmail}
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>

                            <span class="table-certificate-id">
                                ${certificateId}
                            </span>

                        </td>


                        <td>

                            <div class="table-course">

                                <strong>
                                    ${title}
                                </strong>

                                <span>
                                    ${course}
                                </span>

                            </div>

                        </td>


                        <td>
                            ${date}
                        </td>


                        <td>

                            <span class="status-badge">
                                Active
                            </span>

                        </td>


                        <td>

                            <div class="table-actions">

                                <a
                                    href="certificate-details.html?id=${encodeURIComponent(documentId)}"
                                    class="table-view-button">

                                    View

                                </a>


                                <button
                                    class="table-delete-button"
                                    data-id="${documentId}">

                                    Delete

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    attachDeleteButtons();

}


// ==========================================
// DELETE BUTTONS
// ==========================================

function attachDeleteButtons() {

    document
        .querySelectorAll(
            ".table-delete-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        await deleteCertificate(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// ==========================================
// DELETE CERTIFICATE
// ==========================================

async function deleteCertificate(
    certificateId
) {

    const certificate =
        allCertificates.find(
            item =>
                item.id === certificateId
        );


    if (!certificate) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete the certificate for "${certificate.studentName || "this student"}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "certificates",
                certificateId
            )
        );


        allCertificates =
            allCertificates.filter(
                item =>
                    item.id !== certificateId
            );


        certificateCount.textContent =
            allCertificates.length;


        applySearch();


    } catch (error) {

        console.error(
            "Delete certificate error:",
            error
        );


        alert(
            "Unable to delete this certificate."
        );

    }
}


// ==========================================
// SEARCH
// ==========================================

function applySearch() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!search) {

        renderCertificates(
            allCertificates
        );

        return;

    }


    const filtered =
        allCertificates.filter(
            certificate => {

                const name =
                    String(
                        certificate.studentName || ""
                    ).toLowerCase();


                const id =
                    String(
                        certificate.certificateId ||
                        certificate.id ||
                        ""
                    ).toLowerCase();


                const title =
                    String(
                        certificate.title || ""
                    ).toLowerCase();


                const course =
                    String(
                        certificate.course || ""
                    ).toLowerCase();


                return (
                    name.includes(search) ||
                    id.includes(search) ||
                    title.includes(search) ||
                    course.includes(search)
                );

            }
        );


    renderCertificates(
        filtered
    );

}


searchInput.addEventListener(
    "input",
    applySearch
);


// ==========================================
// RETRY
// ==========================================

retryButton.addEventListener(
    "click",
    loadCertificates
);


// ==========================================
// LOGOUT
// ==========================================

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


// ==========================================
// AUTH
// ==========================================

onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        currentUser =
            user;


        loadCertificates();

    }
);