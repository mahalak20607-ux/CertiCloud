import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// HTML ELEMENTS
// =====================================================

const loading =
    document.getElementById("dashboardLoading");

const content =
    document.getElementById("dashboardContent");

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const logoutButton =
    document.getElementById("logoutButton");

const totalCertificates =
    document.getElementById("totalCertificates");

const verifiedCertificates =
    document.getElementById("verifiedCertificates");

const monthlyCertificates =
    document.getElementById("monthlyCertificates");

const recentCertificates =
    document.getElementById("recentCertificates");


// =====================================================
// PROFILE ELEMENTS
// =====================================================

const profileAvatar =
    document.getElementById("profileAvatar");

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


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showDashboard() {

    if (loading) {
        loading.classList.add("hidden");
    }

    if (content) {
        content.classList.remove("hidden");
    }
}


// =====================================================
// LOADING
// =====================================================

function showLoading() {

    if (loading) {
        loading.classList.remove("hidden");
    }

    if (content) {
        content.classList.add("hidden");
    }
}


// =====================================================
// PROFILE
// =====================================================

function loadProfile(user) {

    console.log("Loading profile:", user);


    const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "User";


    const email =
        user.email ||
        "No email";


    // Header email

    if (userEmail) {
        userEmail.textContent = email;
    }


    // Dashboard welcome name

    if (userName) {
        userName.textContent = name;
    }


    // Profile name

    if (profileName) {
        profileName.textContent = name;
    }


    // Profile email

    if (profileEmail) {
        profileEmail.textContent = email;
    }


    // Full name

    if (profileFullName) {
        profileFullName.textContent = name;
    }


    // Email

    if (profileEmailDetail) {
        profileEmailDetail.textContent = email;
    }


    // Firebase UID

    if (profileUid) {
        profileUid.textContent = user.uid;
    }


    // Avatar

    if (profileAvatar) {
        profileAvatar.textContent =
            name
                .charAt(0)
                .toUpperCase();
    }


    console.log(
        "Profile loaded successfully"
    );

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(timestamp) {

    if (!timestamp) {
        return "Date unavailable";
    }

    try {

        let date;

        if (
            timestamp &&
            typeof timestamp.toDate === "function"
        ) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }

        if (isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch (error) {

        console.error(
            "Date formatting error:",
            error
        );

        return "Date unavailable";
    }
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// =====================================================
// LOAD CERTIFICATES
// =====================================================

async function loadCertificates(user) {

    try {

        const certificatesRef =
            collection(
                db,
                "certificates"
            );


        let snapshot;


        try {

            const certificatesQuery =
                query(
                    certificatesRef,
                    where(
                        "issuerId",
                        "==",
                        user.uid
                    ),
                    orderBy(
                        "createdAt",
                        "desc"
                    )
                );

            snapshot =
                await getDocs(
                    certificatesQuery
                );

        } catch (queryError) {

            console.warn(
                "Ordered query failed. Using fallback.",
                queryError
            );


            const fallbackQuery =
                query(
                    certificatesRef,
                    where(
                        "issuerId",
                        "==",
                        user.uid
                    )
                );


            snapshot =
                await getDocs(
                    fallbackQuery
                );
        }


        let certificates =
            snapshot.docs.map(
                (document) => ({

                    id: document.id,

                    ...document.data()

                })
            );


        // Sort newest first

        certificates.sort(
            (a, b) => {

                const getTime =
                    (certificate) => {

                        const timestamp =
                            certificate.createdAt ||
                            certificate.issueDate;

                        if (
                            timestamp &&
                            typeof timestamp.toDate ===
                            "function"
                        ) {

                            return timestamp
                                .toDate()
                                .getTime();
                        }

                        const date =
                            new Date(timestamp);

                        return isNaN(
                            date.getTime()
                        )
                            ? 0
                            : date.getTime();
                    };


                return (
                    getTime(b) -
                    getTime(a)
                );
            }
        );


        // =================================================
        // TOTAL
        // =================================================

        if (totalCertificates) {

            totalCertificates.textContent =
                certificates.length;
        }


        // =================================================
        // VERIFIED
        // =================================================

        const verified =
            certificates.filter(
                (certificate) => {

                    const status =
                        String(
                            certificate.status ||
                            "verified"
                        ).toLowerCase();

                    return (
                        status === "verified" ||
                        status === "valid" ||
                        status === "active" ||
                        !certificate.status
                    );
                }
            ).length;


        if (verifiedCertificates) {

            verifiedCertificates.textContent =
                verified;
        }


        // =================================================
        // THIS MONTH
        // =================================================

        const now =
            new Date();

        const currentMonth =
            now.getMonth();

        const currentYear =
            now.getFullYear();


        const thisMonth =
            certificates.filter(
                (certificate) => {

                    const timestamp =
                        certificate.createdAt ||
                        certificate.issueDate;

                    if (!timestamp) {
                        return false;
                    }


                    const date =
                        typeof timestamp.toDate ===
                        "function"

                            ? timestamp.toDate()

                            : new Date(timestamp);


                    return (
                        date.getMonth() ===
                        currentMonth &&
                        date.getFullYear() ===
                        currentYear
                    );

                }
            ).length;


        if (monthlyCertificates) {

            monthlyCertificates.textContent =
                thisMonth;
        }


        // =================================================
        // RECENT
        // =================================================

        renderRecentCertificates(
            certificates.slice(0, 5)
        );


    } catch (error) {

        console.error(
            "Certificate loading error:",
            error
        );


        if (totalCertificates) {
            totalCertificates.textContent = "0";
        }

        if (verifiedCertificates) {
            verifiedCertificates.textContent = "0";
        }

        if (monthlyCertificates) {
            monthlyCertificates.textContent = "0";
        }

        renderRecentCertificates([]);
    }
}


// =====================================================
// RECENT CERTIFICATES
// =====================================================

function renderRecentCertificates(
    certificates
) {

    if (!recentCertificates) {
        return;
    }


    if (!certificates.length) {

        recentCertificates.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="table-empty">

                    <div class="empty-state">

                        <div class="empty-icon">
                            🎓
                        </div>

                        <h3>
                            No certificates yet
                        </h3>

                        <p>
                            Issue your first certificate
                            to see it here.
                        </p>

                        <a
                            href="issue-certificate.html"
                            class="empty-button">

                            Issue Certificate

                        </a>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    recentCertificates.innerHTML =
        certificates.map(
            (certificate) => {

                const certificateId =
                    escapeHTML(
                        certificate.certificateId ||
                        certificate.id
                    );


                const studentName =
                    escapeHTML(
                        certificate.studentName ||
                        "Student"
                    );


                const title =
                    escapeHTML(
                        certificate.title ||
                        certificate.course ||
                        "Certificate"
                    );


                const date =
                    formatDate(
                        certificate.createdAt ||
                        certificate.issueDate
                    );


                const status =
                    escapeHTML(
                        certificate.status ||
                        "Verified"
                    );


                return `

                    <tr>

                        <td>

                            <div class="certificate-table-name">

                                <span class="certificate-symbol">
                                    🎓
                                </span>

                                <div>

                                    <strong>
                                        ${studentName}
                                    </strong>

                                    <small>
                                        ${title}
                                    </small>

                                </div>

                            </div>

                        </td>


                        <td>

                            <strong>
                                ${certificateId}
                            </strong>

                        </td>


                        <td>
                            ${date}
                        </td>


                        <td>

                            <span class="certificate-status">
                                ${status}
                            </span>

                        </td>


                        <td>

                            <a
                                href="certificate-details.html?id=${encodeURIComponent(
                                    certificate.id
                                )}"
                                class="certificate-view">

                                View →

                            </a>

                        </td>

                    </tr>

                `;
            }
        ).join("");
}


// =====================================================
// AUTHENTICATION
// =====================================================

showLoading();


onAuthStateChanged(
    auth,
    async (user) => {

        console.log(
            "Firebase user:",
            user
        );


        // =================================================
        // NOT LOGGED IN
        // =================================================

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        // =================================================
        // LOAD PROFILE FIRST
        // =================================================

        loadProfile(user);


        // =================================================
        // LOAD CERTIFICATES
        // =================================================

        try {

            await loadCertificates(user);

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        } finally {

            showDashboard();
        }

    }
);


// =====================================================
// LOGOUT
// =====================================================

if (logoutButton) {

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

}