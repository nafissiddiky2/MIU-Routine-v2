// ============================================
// FIREBASE CONFIGURATION
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyCtBSWRlXe4YgLaPqzpV3xIkcg8YtZ64wg",
  authDomain: "miu-routine-v2.firebaseapp.com",
  projectId: "miu-routine-v2",
  storageBucket: "miu-routine-v2.firebasestorage.app",
  messagingSenderId: "910374084193",
  appId: "1:910374084193:web:97ba0001acebee1ef5d420"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Google Apps Script URL for email sending
const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaaH0K_rl8Kzbox5Xt__QoczAUTG3hSFPSPzxyicIPgQuDiPRUFTvdan3esQ_kcXm1/exec';

// ============================================
// DATABASE FUNCTIONS
// ============================================

// Register new student (Firebase + Google Sheet)
async function registerStudent(studentId, email, phone, batch, password) {
    try {
        // Check Firebase first
        const docRef = db.collection('students').doc(studentId);
        const doc = await docRef.get();
        if (doc.exists) {
            return { success: false, error: 'Student ID already registered' };
        }
        
        // Save to Firebase (hashed password)
        await docRef.set({
            student_id: studentId,
            email: email,
            phone: phone,
            batch: batch,
            batch_number: batch.replace(/\([FM]\)/, '').trim(),
            password: password, // Already hashed from auth.js
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Also save to Google Sheet (ID + Email + Hashed Password only, for email sending)
        saveToSheetForEmail(studentId, email);
        
        return { success: true, message: 'Registered successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function saveToSheetForEmail(studentId, email) {
    try {
        await fetch(SHEET_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'register_email_only',
                student_id: studentId,
                email: email
            })
        });
    } catch (e) {
        console.log('Sheet sync skipped');
    }
}
// Login student (Firebase only)
async function loginStudent(studentId, password) {
    try {
        const docRef = db.collection('students').doc(studentId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return { success: false, error: 'Student ID not found' };
        }
        const data = doc.data();
        if (data.password === password) {
            return { 
                success: true, 
                student_id: data.student_id,
                batch: data.batch,
                email: data.email,
                phone: data.phone
            };
        }
        return { success: false, error: 'Invalid password' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Reset password (Firebase only)
async function resetStudentPassword(studentId, newPassword) {
    try {
        const docRef = db.collection('students').doc(studentId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return { success: false, error: 'Student ID not found' };
        }
        await docRef.update({ password: newPassword });
        
        // Also update in Google Sheet
        updatePasswordInSheet(studentId, newPassword);
        
        return { success: true, message: 'Password reset successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Update password in Google Sheet
async function updatePasswordInSheet(studentId, newPassword) {
    try {
        await fetch(SHEET_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'update_password',
                student_id: studentId,
                new_password: newPassword
            })
        });
    } catch (e) {
        console.log('Sheet password update skipped');
    }
}

// Find student by ID (Firebase)
async function findStudentById(studentId) {
    try {
        const docRef = db.collection('students').doc(studentId);
        const doc = await docRef.get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        return null;
    }
}

// Send OTP via Google Apps Script (sheet handles everything)
async function sendOTPFromSheet(studentId) {
    try {
        const res = await fetch(SHEET_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'forgot_password',
                student_id: studentId
            })
        });
        return await res.json();
    } catch (e) {
        return { success: false, error: 'Connection error' };
    }
}
// ============================================
// UTILITY FUNCTIONS
// ============================================

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'x' + Math.abs(hash).toString(16);
}

function getBatchFromId(studentId) {
    const id = String(studentId).trim();
    const match1 = id.match(/^\d{2}(\d{2})[a-zA-Z]/i);
    if (match1) return match1[1];
    const match2 = id.match(/^(\d{3})/);
    if (match2) {
        const prefix = match2[1];
        const batchMap = {'015': '61', '015': '62'};
        return batchMap[prefix] || prefix;
    }
    return '00';
}
