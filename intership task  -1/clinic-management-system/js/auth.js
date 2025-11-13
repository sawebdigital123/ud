// Authentication Module for Clinic Management System

// Sample user data (in a real app, this would be stored securely on the server)
const users = [
    {
        id: 1,
        username: 'doctor1',
        password: 'doctor123', // In a real app, never store passwords in plain text
        name: 'Dr. Smith',
        role: 'doctor',
        specialization: 'General Physician'
    },
    {
        id: 2,
        username: 'reception1',
        password: 'reception123',
        name: 'John Doe',
        role: 'receptionist'
    }
];

// Current user session
let currentUser = null;

// DOM Elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const doctorDashboard = document.getElementById('doctor-dashboard');
const receptionistDashboard = document.getElementById('receptionist-dashboard');
const logoutBtn = document.getElementById('logout-btn');

// Initialize authentication module
function initAuth() {
    // Check if user is already logged in (from sessionStorage)
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        handleSuccessfulLogin(currentUser);
    }

    // Add event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    
    // Simple validation
    if (!username || !password || !userType) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Find user
    const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === userType
    );
    
    if (user) {
        // Create a copy of the user object without the password
        const { password, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        
        // Store user in session storage
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Handle successful login
        handleSuccessfulLogin(user);
    } else {
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

// Handle successful login
function handleSuccessfulLogin(user) {
    // Hide login section, show dashboard
    if (loginSection) loginSection.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    
    // Show the appropriate dashboard based on user role
    if (user.role === 'doctor') {
        if (doctorDashboard) doctorDashboard.style.display = 'block';
        if (receptionistDashboard) receptionistDashboard.style.display = 'none';
        // Initialize doctor module
        if (typeof initDoctorModule === 'function') {
            initDoctorModule();
        }
    } else if (user.role === 'receptionist') {
        if (receptionistDashboard) receptionistDashboard.style.display = 'block';
        if (doctorDashboard) doctorDashboard.style.display = 'none';
        // Initialize receptionist module
        if (typeof initReceptionistModule === 'function') {
            initReceptionistModule();
        }
    }
    
    // Dispatch a custom event for other modules to listen to
    const loginEvent = new CustomEvent('auth:login', {
        detail: {
            user: user,
            role: user.role,
            timestamp: new Date().toISOString()
        }
    });
    document.dispatchEvent(loginEvent);
    
    showNotification(`Welcome, ${user.name}!`, 'success');
}

// Handle logout
function handleLogout() {
    // Clear session
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    
    // Reset UI
    if (dashboard) dashboard.style.display = 'none';
    if (loginSection) loginSection.style.display = 'block';
    if (doctorDashboard) doctorDashboard.style.display = 'none';
    if (receptionistDashboard) receptionistDashboard.style.display = 'none';
    
    // Reset forms
    if (loginForm) loginForm.reset();
    
    showNotification('You have been logged out successfully.', 'info');
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Check if user has specific role
function hasRole(role) {
    return currentUser && currentUser.role === role;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Initialize auth module when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Export functions for use in other modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        initAuth,
        isAuthenticated,
        hasRole,
        getCurrentUser,
        handleLogout
    };
}
