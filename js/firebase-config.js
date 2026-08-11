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

// ============================================
// DATABASE FUNCTIONS
// ============================================

// Register new student
async function registerStudent(studentId, email, phone, batch, password) {
    try {
        const docRef = db.collection('students').doc(studentId);
        const doc = await docRef.get();
        if (doc.exists) {
            return { success: false, error: 'Student ID already registered' };
        }
        await docRef.set({
            student_id: studentId,
            email: email,
            phone: phone,
            batch: batch,
            batch_number: batch.replace(/\([FM]\)/, '').trim(),
            password: password,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, message: 'Registered successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Login student
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

// Reset password
async function resetStudentPassword(studentId, newPassword) {
    try {
        const docRef = db.collection('students').doc(studentId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return { success: false, error: 'Student ID not found' };
        }
        await docRef.update({ password: newPassword });
        return { success: true, message: 'Password reset successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Find student by ID (for forgot password)
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

// Store OTP temporarily
async function storeOTP(studentId, otp) {
    await db.collection('otps').doc(studentId).set({
        otp: otp,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });
}

// Verify OTP
async function verifyOTP(studentId, otp) {
    const docRef = db.collection('otps').doc(studentId);
    const doc = await docRef.get();
    if (!doc.exists) return { success: false, error: 'No OTP requested' };
    const data = doc.data();
    if (data.expires_at.toDate() < new Date()) {
        await docRef.delete();
        return { success: false, error: 'OTP expired' };
    }
    if (data.otp === otp) {
        await docRef.delete();
        return { success: true, message: 'OTP verified' };
    }
    return { success: false, error: 'Invalid OTP' };
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