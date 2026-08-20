# 🎓 CertiCloud – Certificate Management System

CertiCloud is a web-based **Certificate Management System** that allows users to create, manage, view, and track digital certificates using **Firebase Authentication and Cloud Firestore**.

The project provides a simple and professional dashboard where users can manage their certificates and access certificate details easily.

## 🚀 Features

* 🔐 User Registration & Login
* 👤 User Dashboard
* 🎓 Issue Digital Certificates
* 🆔 Automatic Certificate ID Generation
* 📜 View Certificate Details
* 📋 Recent Certificates on Dashboard
* 🔎 Certificate Management
* ☁️ Firebase Cloud Firestore Database
* 🔑 Firebase Authentication
* 📱 Responsive Web Interface
* 📊 Certificate Status Management

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* Firebase Authentication
* Firebase Cloud Firestore
* Bootstrap
* Visual Studio Code
* Git & GitHub

## 📁 Project Structure

```text
CertiCloud/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── certificates.html
├── certificate-details.html
├── issue-certificate.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── firebase.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── certificates.js
│   └── certificate.js
│
└── README.md
```

## 🔥 Firebase Setup

1. Create a project in Firebase Console.
2. Enable **Authentication**.
3. Enable **Cloud Firestore Database**.
4. Register your web application.
5. Copy the Firebase configuration.
6. Add the configuration to your Firebase JavaScript file.

Example:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

> Never publish private credentials or service-account keys in your repository.

## 🎓 Certificate Workflow

```text
User Login
    ↓
Dashboard
    ↓
Issue Certificate
    ↓
Enter Certificate Details
    ↓
Generate Certificate ID
    ↓
Save to Firestore
    ↓
Certificate Created
    ↓
Display in Recent Certificates
    ↓
View Certificate Details
```

## 🗃️ Firestore

Certificate information can be stored in a `certificates` collection.

Example document:

```text
certificates
│
└── certificateDocument
    ├── certificateId
    ├── studentName
    ├── studentEmail
    ├── title
    ├── course
    ├── description
    ├── grade
    ├── issuedDate
    ├── status
    └── createdAt
```

## 🔢 Certificate ID

Each certificate receives a unique certificate ID when it is issued.

Example:

```text
CERT-2026-00001
CERT-2026-00002
CERT-2026-00003
```

## 📊 Dashboard

The dashboard displays:

* Total Certificates
* Recent Certificates
* Certificate ID
* Issued Date
* Certificate Status
* View Certificate option

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

Open the project folder in **Visual Studio Code**.

### 3. Start Live Server

Right-click `index.html` and select:

```text
Open with Live Server
```

### 4. Configure Firebase

Add your Firebase configuration and make sure Authentication and Firestore are enabled.

## 🔒 Security

Firestore security rules should be configured properly before deploying the application publicly.

Do not expose Firebase Admin SDK credentials or service-account private keys in frontend JavaScript.

## 🌟 Future Improvements

* QR Code verification
* Download certificate as PDF
* Email certificate delivery
* Public certificate verification
* Certificate templates
* Admin dashboard
* Certificate expiration management
* Digital signatures
* Cloud Storage integration

## 👩‍💻 Developer

**Mahalakshmi S**

BE Computer Science and Engineering
Prathyusha Engineering College

## 📄 License

This project is created for educational and project-development purposes.

Developer: Mahalakshmi S
---

⭐ If you find this project useful, consider giving the repository a star!
