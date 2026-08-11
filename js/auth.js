// ============================================
// AUTHENTICATION & REGISTRATION
// ============================================

// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const password = simpleHash(document.getElementById('password').value);
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    const errorDiv = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!studentId || !document.getElementById('password').value) {
        errorDiv.textContent = 'Please fill all fields';
        errorDiv.classList.add('show');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    const result = await loginStudent(studentId, password);
    
    if (result.success) {
        const userData = {
            student_id: result.student_id,
            batch: result.batch || getBatchFromId(studentId),
            email: result.email,
            phone: result.phone,
            loggedIn: true,
            loginTime: Date.now()
        };
        localStorage.setItem('miu_user', JSON.stringify(userData));
        if (rememberMe) localStorage.setItem('miu_remember', 'true');
        window.location.href = 'dashboard.html';
    } else {
        errorDiv.textContent = result.error || 'Invalid credentials';
        errorDiv.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});

// Register Form
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const batch = document.getElementById('batch').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = simpleHash(document.getElementById('password').value);
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorDiv = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!batch) { errorDiv.textContent = 'Please select your batch!'; errorDiv.classList.add('show'); return; }
    if (simpleHash(confirmPassword) !== password) { errorDiv.textContent = 'Passwords do not match!'; errorDiv.classList.add('show'); return; }
    if (confirmPassword.length < 6) { errorDiv.textContent = 'Password min 6 characters!'; errorDiv.classList.add('show'); return; }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    const result = await registerStudent(studentId, email, phone, batch, password);
    
    if (result.success) {
        alert('✅ Registration successful! Please login.');
        window.location.href = 'login.html';
    } else {
        errorDiv.textContent = result.error;
        errorDiv.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
});