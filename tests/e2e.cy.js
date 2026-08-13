// ============================================
// END-TO-END TESTS - MIU Routine System v2
// ============================================

describe('Registration Flow', () => {
    it('should register a new student', () => {
        cy.visit('/register.html');
        cy.get('#studentId').type('2465cse01999');
        cy.get('#batch').select('65');
        cy.get('#email').type('test@student.com');
        cy.get('#phone').type('01712345678');
        cy.get('#password').type('123456');
        cy.get('#confirmPassword').type('123456');
        cy.get('button[type="submit"]').click();
        cy.contains('Registration successful').should('be.visible');
        cy.url().should('include', 'login.html');
    });
});

describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/login.html');
    });

    it('should login with valid credentials', () => {
        cy.get('#studentId').type('2465cse01176');
        cy.get('#password').type('123456');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', 'dashboard.html');
    });

    it('should show error with invalid password', () => {
        cy.get('#studentId').type('2465cse01176');
        cy.get('#password').type('wrongpass');
        cy.get('button[type="submit"]').click();
        cy.get('#errorMessage').should('be.visible');
    });
});

describe('Forgot Password Flow', () => {
    it('should send OTP for valid ID', () => {
        cy.visit('/forgot-password.html');
        cy.get('#studentId').type('2465cse01176');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', 'verify-otp');
    });
});

describe('Dashboard Flow', () => {
    beforeEach(() => {
        // Login first
        cy.visit('/login.html');
        cy.get('#studentId').type('2465cse01176');
        cy.get('#password').type('123456');
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
    });

    it('should display today\'s routine', () => {
        cy.get('#routineTable table').should('exist');
        cy.get('#routineTable table tbody tr').should('have.length.greaterThan', 0);
    });

    it('should navigate to tomorrow', () => {
        cy.get('#nextDayBtn').click();
        cy.wait(1000);
        cy.get('#currentDay').should('be.visible');
    });

    it('should navigate to yesterday', () => {
        cy.get('#prevDayBtn').click();
        cy.wait(1000);
        cy.get('#currentDay').should('be.visible');
    });

    it('should filter by batch', () => {
        cy.get('#searchBatch').select('67');
        cy.wait(500);
        cy.get('#routineTable table tbody tr').should('exist');
    });

    it('should filter by room', () => {
        cy.get('#searchRoom').select('C209');
        cy.wait(500);
        cy.get('#routineTable').should('be.visible');
    });

    it('should filter by teacher', () => {
        cy.get('#searchTeacher').select('SA');
        cy.wait(500);
        cy.get('#routineTable').should('be.visible');
    });

    it('should reset filters', () => {
        cy.get('#resetBtn').click();
        cy.wait(500);
        cy.get('#routineTable table').should('exist');
    });

    it('should logout', () => {
        cy.get('#logoutBtn').click();
        cy.url().should('include', 'login.html');
    });
});
