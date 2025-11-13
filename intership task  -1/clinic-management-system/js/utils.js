// Utility functions for the Clinic Management System

// DOM Elements
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');

// Show modal with content
function showModal(content) {
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
}

// Event listener for close button
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Format date to YYYY-MM-DD
function formatDate(date = new Date()) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Format time to HH:MM
function formatTime(date = new Date()) {
    const d = new Date(date);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${ampm}`;
}

// Generate a unique token (for demo purposes)
let lastToken = 0;
function generateToken() {
    lastToken++;
    return `TK-${String(lastToken).padStart(4, '0')}`;
}

// Generate a unique patient ID
let lastPatientId = 0;
function generatePatientId() {
    lastPatientId++;
    return `PAT-${String(lastPatientId).padStart(4, '0')}`;
}

// Generate a unique bill number
let lastBillNumber = 1000;
function generateBillNumber() {
    lastBillNumber++;
    return `INV-${lastBillNumber}`;
}

// Simple validation for email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Simple validation for phone number (basic check for 10 digits)
function isValidPhone(phone) {
    const re = /^\d{10}$/;
    return re.test(phone);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
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

// Export functions for use in other modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        showModal,
        closeModal,
        formatDate,
        formatTime,
        generateToken,
        generatePatientId,
        generateBillNumber,
        isValidEmail,
        isValidPhone,
        showNotification,
        debounce
    };
}
