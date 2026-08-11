
#  MIU CSE Routine System v2 (Firebase Edition) [Visit Here](https://nafissiddiky2.github.io/MIU-Routine-v2/)

A web-based class routine management system for the Department of Computer Science & Engineering at Manarat International University (MIU). Students can view daily class schedules, search by batch, room, or teacher, and manage their accounts.

## 🚀 Features

- **📚 View Class Routine** – Daily schedules with course codes, rooms, and teachers
- **👥 Batch-wise Search** – Filter routines by batch (e.g., 65, 67, 70(F), 70(M))
- **🏫 Room Search** – Find which classes are scheduled in specific rooms
- **👨‍🏫 Teacher Search** – View schedules for individual teachers
- **📅 Day Navigation** – Browse routines for any day of the week
- **🔐 Student Registration & Login** – Secure account creation with hashed passwords
- **📧 Forgot Password** – OTP-based password reset via email
- **📱 Responsive Design** – Optimised for desktop, tablet, and mobile
- **🔥 Firebase Firestore** – Real-time NoSQL database for student data
- **☁️ Google Sheets Integration** – Routine data synced from Google Sheets

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Database | Firebase Firestore |
| Routine Data | Google Sheets (CSV Export) |
| Authentication | Custom with hashed passwords |
| Hosting | GitHub Pages |

## 📁 Project Structure
```text
MIU-Routine-v2/
├── index.html # Entry point – redirects based on session
├── login.html # Student login page
├── register.html # Student registration with batch selector
├── dashboard.html # Main dashboard with routine display
├── forgot-password.html # OTP request page
├── verify-otp.html # OTP verification page
├── reset-password.html # New password setup
├── css/
│ └── style.css # Complete stylesheet
├── js/
│ ├── firebase-config.js # Firebase configuration & database functions
│ └── auth.js # Authentication & registration logic
└── images/
└── manarat.png # MIU logo
```

## 🔧 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Firestore Database** in test mode
3. Register a Web App and copy the `firebaseConfig`
4. Paste the config into `js/firebase-config.js`
5. Set Firestore security rules to allow student registration & login

## 📝 Student ID Format

| ID Format | Example | Batch Extraction |
|-----------|---------|-----------------|
| `YYBBXXXNNNNN` | `2465cse01176` | `65` (digits 3–4) |
| `PPP...` (alternate) | `015231005101006` | Prefix `015` → Batch `61` |

## 👨‍🏫 Teacher Shortcodes

| Code | Full Name |
|------|-----------|
| JF | Jannatul Ferdaous |
| SA | Soaib Abdullah |
| DRA | Prof. Dr. Ramit Azad |
| DMR | Prof. Dr. Mizanur Rahman |
| TK | Tahsin Kabir |
| ZH | Zahurul Haque |
| *…and more* | *(see dashboard dropdown)* |

## 🎨 Colour Palette

| Colour | Hex |
|--------|-----|
| Primary Green | `#2d6a4f` |
| Light Green | `#52b788` |
| Pale Green | `#d8f3dc` |
| Yellow | `#ffd166` |
| Light Yellow | `#fff3cd` |
| White | `#ffffff` |

## 📤 Deployment (GitHub Pages)

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Under **Branch**, select `main` and save
4. Your site will be live at `https://<username>.github.io/<repo-name>/`

## ⚠️ Important Notes

- **No backend server required** – fully static site with Firebase & Google Sheets
- **Passwords are hashed** using a simple hash function
- **Firestore rules** should be configured to restrict unauthorised access
- **Google Sheet** must be published to the web for routine data

## 📄 License

This project is created for Manarat International University, Department of Computer Science & Engineering.

---

**Developed by [S.A.Nafis](https://nafissiddiky2.github.io/Portfolio/)**
