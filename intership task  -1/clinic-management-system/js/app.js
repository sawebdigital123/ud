// Main Application Entry Point

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Clinic Management System initialized');
    
    // Check authentication status and update UI
    updateAuthUI();
    
    // Add event listeners for navigation
    setupEventListeners();
    
    // Check if we need to load sample data
    checkAndLoadSampleData();
});

// Update UI based on authentication status
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const loginSection = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard');
    
    if (currentUser) {
        // User is logged in
        if (loginSection) loginSection.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        // Show the appropriate dashboard based on user role
        if (currentUser.role === 'doctor') {
            document.getElementById('doctor-dashboard').style.display = 'block';
            document.getElementById('receptionist-dashboard').style.display = 'none';
            // Initialize doctor module if it exists
            if (typeof initDoctorModule === 'function') {
                initDoctorModule();
            }
        } else if (currentUser.role === 'receptionist') {
            document.getElementById('receptionist-dashboard').style.display = 'block';
            document.getElementById('doctor-dashboard').style.display = 'none';
            // Initialize receptionist module if it exists
            if (typeof initReceptionistModule === 'function') {
                initReceptionistModule();
            }
        }
    } else {
        // User is not logged in
        if (loginSection) loginSection.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
    }
}

// Set up event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Check if we need to load sample data
function checkAndLoadSampleData() {
    // Check if we already have data in localStorage
    const hasPatients = localStorage.getItem('patients') !== null;
    const hasAppointments = localStorage.getItem('appointments') !== null;
    const hasBills = localStorage.getItem('bills') !== null;
    
    // If no data exists, we'll load sample data
    if (!hasPatients || !hasAppointments || !hasBills) {
        // This will be handled by the respective modules (doctor.js and receptionist.js)
        // when they initialize and find no data
        console.log('No existing data found. Sample data will be loaded when needed.');
    }
}

// Get the current user from session storage
function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
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
    
    // In a real app, this would be an API call to your backend
    // For this demo, we'll use hardcoded credentials
    const users = {
        'doctor1': { username: 'doctor1', password: 'doctor123', name: 'Dr. Smith', role: 'doctor' },
        'reception1': { username: 'reception1', password: 'reception123', name: 'John Doe', role: 'receptionist' }
    };
    
    const user = users[username];
    
    if (user && user.password === password && user.role === userType) {
        // Login successful
        const { password, ...userWithoutPassword } = user; // Don't store password
        sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        // Update UI
        updateAuthUI();
        
        // Show success message
        showNotification(`Welcome back, ${user.name}!`, 'success');
        
        // Reset form
        e.target.reset();
    } else {
        // Login failed
        showNotification('Invalid username, password, or user type', 'error');
    }
}

// Handle logout
function handleLogout() {
    // Clear session
    sessionStorage.removeItem('currentUser');
    
    // Update UI
    updateAuthUI();
    
    // Show logout message
    showNotification('You have been logged out', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to the page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles if they don't exist
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            opacity: 0.95;
            transform: translateX(120%);
            animation: slideIn 0.3s forwards;
        }
        
        .notification.success { background-color: #2ecc71; }
        .notification.error { background-color: #e74c3c; }
        .notification.warning { background-color: #f39c12; }
        .notification.info { background-color: #3498db; }
        
        .fade-out {
            animation: fadeOut 0.3s forwards;
        }
        
        @keyframes slideIn {
            to { transform: translateX(0); }
        }
        
        @keyframes fadeOut {
            to { opacity: 0; transform: translateX(120%); }
        }
    `;
    document.head.appendChild(style);
}

// Utility function to generate a unique ID
function generateId(prefix = '') {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
}

// Generate a unique token for patients
function generateToken() {
    return `TK-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Generate a unique patient ID
function generatePatientId() {
    return `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Generate a unique bill number
function generateBillNumber() {
    return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make these functions available globally
window.showNotification = showNotification;
window.generateId = generateId;
window.generateToken = generateToken;
window.generatePatientId = generatePatientId;
window.generateBillNumber = generateBillNumber;
window.debounce = debounce;
