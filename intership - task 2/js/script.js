// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeButtons = document.querySelectorAll('.close');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const stateSelect = document.getElementById('state');
const districtSelect = document.getElementById('district');
const categoryFilter = document.getElementById('categoryFilter');
const stateFilter = document.getElementById('stateFilter');
const schemesContainer = document.getElementById('schemesContainer');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box .btn');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const toast = document.getElementById('toast');

// State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let allSchemes = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load schemes
    allSchemes = getAllSchemes();
    
    // Populate states in registration form
    populateStates();
    
    // Populate states in filter
    populateStateFilter();
    
    // Display schemes
    displaySchemes(allSchemes);
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Modal toggles
    loginBtn?.addEventListener('click', () => showModal('loginModal'));
    registerBtn?.addEventListener('click', () => showModal('registerModal'));
    
    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal'));
        });
    });
    
    // Switch between login and register modals
    showRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        showModal('registerModal');
    });
    
    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        showModal('loginModal');
    });
    
    // Form submissions
    loginForm?.addEventListener('submit', handleLogin);
    registerForm?.addEventListener('submit', handleRegister);
    
    // State and district selection
    stateSelect?.addEventListener('change', handleStateChange);
    
    // Filters
    categoryFilter?.addEventListener('change', filterSchemes);
    stateFilter?.addEventListener('change', filterSchemes);
    
    // Search
    searchButton?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                nav.classList.remove('active');
            }
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Reset forms when closing
        if (modal.id === 'loginModal' && loginForm) {
            loginForm.reset();
        } else if (modal.id === 'registerModal' && registerForm) {
            registerForm.reset();
        }
    }
}

// Populate states in registration form
function populateStates() {
    const states = getStates();
    const stateSelects = [stateSelect, stateFilter];
    
    stateSelects.forEach(select => {
        if (!select) return;
        
        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add states to the select
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            select.appendChild(option);
        });
    });
}

// Populate state filter
function populateStateFilter() {
    if (!stateFilter) return;
    
    // Clear existing options except the first one
    while (stateFilter.options.length > 1) {
        stateFilter.remove(1);
    }
    
    // Add states to the filter
    const states = getStates();
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });
}

// Handle state change in registration form
function handleStateChange(e) {
    const state = e.target.value;
    const districts = getDistrictsByState(state);
    
    // Clear existing options except the first one
    while (districtSelect.options.length > 1) {
        districtSelect.remove(1);
    }
    
    // Enable/disable district select based on state selection
    districtSelect.disabled = !state;
    
    // Add districts to the select
    if (state) {
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const mobile = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!mobile || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate API call
    const result = loginUser(mobile, password);
    
    if (result.success) {
        // Save user to localStorage
        currentUser = result.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Close modal and update UI
        closeModal(loginModal);
        checkAuthStatus();
        showToast('Login successful!', 'success');
        
        // Redirect to dashboard if user is admin
        if (currentUser.isAdmin) {
            // In a real app, you would redirect to admin dashboard
            console.log('Redirecting to admin dashboard');
        }
    } else {
        showToast(result.message, 'error');
    }
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        aadhaar: document.getElementById('aadhaar').value.trim(),
        state: document.getElementById('state').value,
        district: document.getElementById('district').value,
        village: document.getElementById('village').value.trim(),
        password: document.getElementById('password').value
    };
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (Object.values(formData).some(field => !field)) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (formData.password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
    }
    
    if (formData.aadhaar.length !== 12 || !/^\d+$/.test(formData.aadhaar)) {
        showToast('Please enter a valid 12-digit Aadhaar number', 'error');
        return;
    }
    
    // Register user
    const result = registerUser(formData);
    
    if (result.success) {
        // Auto-login after registration
        currentUser = result.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Close modal and update UI
        closeModal(registerModal);
        checkAuthStatus();
        showToast('Registration successful!', 'success');
    } else {
        showToast(result.message, 'error');
    }
}

// Check authentication status and update UI
function checkAuthStatus() {
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    
    if (currentUser) {
        // Hide login/register buttons
        if (authButtons) authButtons.style.display = 'none';
        
        // Show user profile (you can create this element if it doesn't exist)
        if (!userProfile) {
            const header = document.querySelector('.header .container');
            if (header) {
                const profileHtml = `
                    <div class="user-profile">
                        <div class="user-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="user-dropdown">
                            <span>${currentUser.fullName || 'User'}</span>
                            <div class="dropdown-content">
                                <a href="#" id="myProfile">My Profile</a>
                                <a href="#" id="myApplications">My Applications</a>
                                ${currentUser.isAdmin ? '<a href="#" id="adminDashboard">Admin Dashboard</a>' : ''}
                                <a href="#" id="logoutBtn">Logout</a>
                            </div>
                        </div>
                    </div>
                `;
                header.insertAdjacentHTML('beforeend', profileHtml);
                
                // Add event listeners for dropdown items
                document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
                document.getElementById('myApplications')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    showApplications();
                });
                
                if (currentUser.isAdmin) {
                    document.getElementById('adminDashboard')?.addEventListener('click', (e) => {
                        e.preventDefault();
                        showAdminDashboard();
                    });
                }
            }
        }
    } else {
        // Show login/register buttons
        if (authButtons) authButtons.style.display = 'flex';
        
        // Remove user profile
        if (userProfile) {
            userProfile.remove();
        }
    }
}

// Handle logout
function handleLogout(e) {
    if (e) e.preventDefault();
    
    currentUser = null;
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'success');
    checkAuthStatus();
    
    // Redirect to home or refresh the page
    window.location.href = 'index.html';
}

// Display schemes in the UI
function displaySchemes(schemes) {
    if (!schemesContainer) return;
    
    if (schemes.length === 0) {
        schemesContainer.innerHTML = '<div class="no-results">No schemes found matching your criteria.</div>';
        return;
    }
    
    const schemesHtml = schemes.map(scheme => `
        <div class="scheme-card" data-id="${scheme.id}">
            <div class="scheme-image" style="background-image: url('${scheme.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80'}')">
                <span class="scheme-category">${scheme.category}</span>
            </div>
            <div class="scheme-content">
                <h3>${scheme.title}</h3>
                <p class="scheme-description">${scheme.description}</p>
                <div class="scheme-meta">
                    <span class="scheme-deadline">Apply by: ${scheme.deadline}</span>
                    <button class="btn btn-outline btn-sm view-details" data-id="${scheme.id}">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
    
    schemesContainer.innerHTML = schemesHtml;
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const schemeId = parseInt(e.target.getAttribute('data-id'));
            showSchemeDetails(schemeId);
        });
    });
}

// Show scheme details
function showSchemeDetails(schemeId) {
    const scheme = getSchemeById(schemeId);
    if (!scheme) {
        showToast('Scheme not found', 'error');
        return;
    }
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal" id="schemeDetailsModal">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close">&times;</span>
                <h2>${scheme.title}</h2>
                <div class="scheme-details">
                    <div class="scheme-detail-row">
                        <div class="scheme-detail-col">
                            <div class="scheme-image-large" style="background-image: url('${scheme.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80'}')"></div>
                        </div>
                        <div class="scheme-detail-col">
                            <div class="detail-item">
                                <h4>Category</h4>
                                <p>${scheme.category}</p>
                            </div>
                            <div class="detail-item">
                                <h4>Deadline</h4>
                                <p>${scheme.deadline}</p>
                            </div>
                            <div class="detail-item">
                                <h4>Status</h4>
                                <span class="status-badge ${scheme.status === 'active' ? 'active' : 'inactive'}">
                                    ${scheme.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            ${currentUser ? `
                                <button class="btn btn-primary btn-block apply-now" data-id="${scheme.id}">
                                    Apply Now
                                </button>
                            ` : `
                                <button class="btn btn-primary btn-block" onclick="showModal('loginModal')">
                                    Login to Apply
                                </button>
                            `}
                        </div>
                    </div>
                    
                    <div class="scheme-section">
                        <h3>Description</h3>
                        <p>${scheme.description}</p>
                    </div>
                    
                    <div class="scheme-section">
                        <h3>Eligibility Criteria</h3>
                        <p>${scheme.eligibility}</p>
                    </div>
                    
                    <div class="scheme-section">
                        <h3>Benefits</h3>
                        <p>${scheme.benefits}</p>
                    </div>
                    
                    <div class="scheme-section">
                        <h3>Required Documents</h3>
                        <ul class="document-list">
                            ${scheme.requiredDocuments.map(doc => `<li>${doc}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="scheme-actions">
                        ${currentUser ? `
                            <button class="btn btn-primary apply-now" data-id="${scheme.id}">
                                <i class="fas fa-edit"></i> Apply Now
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="showModal('loginModal')">
                                <i class="fas fa-sign-in-alt"></i> Login to Apply
                            </button>
                        `}
                        <button class="btn btn-outline close-modal-btn">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show the modal
    const modal = document.getElementById('schemeDetailsModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('.close-modal-btn')?.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    // Apply now button
    modal.querySelectorAll('.apply-now').forEach(button => {
        button.addEventListener('click', () => {
            const schemeId = parseInt(button.getAttribute('data-id'));
            showApplicationForm(schemeId);
            modal.remove();
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Show application form
function showApplicationForm(schemeId) {
    const scheme = getSchemeById(schemeId);
    if (!scheme) {
        showToast('Scheme not found', 'error');
        return;
    }
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal" id="applicationModal">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close">&times;</span>
                <h2>Apply for ${scheme.title}</h2>
                <form id="applicationForm">
                    <input type="hidden" id="schemeId" value="${scheme.id}">
                    
                    <div class="form-section">
                        <h3>Personal Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="applicantName">Full Name</label>
                                <input type="text" id="applicantName" value="${currentUser?.fullName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="applicantMobile">Mobile Number</label>
                                <input type="tel" id="applicantMobile" value="${currentUser?.mobile || ''}" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="applicantAadhaar">Aadhaar Number</label>
                                <input type="text" id="applicantAadhaar" value="${currentUser?.aadhaar || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="applicantEmail">Email (Optional)</label>
                                <input type="email" id="applicantEmail">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="applicantState">State</label>
                                <select id="applicantState" required>
                                    <option value="">Select State</option>
                                    ${getStates().map(state => 
                                        `<option value="${state}" ${currentUser?.state === state ? 'selected' : ''}>${state}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="applicantDistrict">District</label>
                                <select id="applicantDistrict" required>
                                    <option value="">Select District</option>
                                    ${currentUser?.state ? getDistrictsByState(currentUser.state).map(district => 
                                        `<option value="${district}" ${currentUser?.district === district ? 'selected' : ''}>${district}</option>`
                                    ).join('') : ''}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="applicantVillage">Village/Town</label>
                                <input type="text" id="applicantVillage" value="${currentUser?.village || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="applicantPincode">Pincode</label>
                                <input type="text" id="applicantPincode" pattern="[0-9]{6}" title="Please enter a valid 6-digit pincode">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Scheme Details</h3>
                        <div class="scheme-summary">
                            <p><strong>Scheme Name:</strong> ${scheme.title}</p>
                            <p><strong>Category:</strong> ${scheme.category}</p>
                            <p><strong>Benefits:</strong> ${scheme.benefits}</p>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Required Documents</h3>
                        <p>Please upload the following documents (PDF, JPG, or PNG, max 5MB each):</p>
                        
                        <div class="document-upload-list">
                            ${scheme.requiredDocuments.map((doc, index) => `
                                <div class="document-upload-item">
                                    <label for="doc${index}">${doc}</label>
                                    <div class="file-upload">
                                        <input type="file" id="doc${index}" class="file-input" data-doc="${doc}" accept=".pdf,.jpg,.jpeg,.png" required>
                                        <label for="doc${index}" class="file-label">Choose File</label>
                                        <span class="file-name">No file chosen</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <div class="form-group">
                            <label for="additionalInfo">Additional Information (Optional)</label>
                            <textarea id="additionalInfo" rows="3" placeholder="Any additional information you'd like to provide..."></textarea>
                        </div>
                        
                        <div class="form-group terms-checkbox">
                            <input type="checkbox" id="agreeTerms" required>
                            <label for="agreeTerms">I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that any false information may lead to rejection of my application.</label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Submit Application
                        </button>
                        <button type="button" class="btn btn-outline close-modal-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show the modal
    const modal = document.getElementById('applicationModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize file upload previews
    initFileUploads();
    
    // Handle state change
    document.getElementById('applicantState')?.addEventListener('change', (e) => {
        const state = e.target.value;
        const districtSelect = document.getElementById('applicantDistrict');
        
        // Clear existing options except the first one
        while (districtSelect.options.length > 1) {
            districtSelect.remove(1);
        }
        
        // Enable/disable district select based on state selection
        districtSelect.disabled = !state;
        
        // Add districts to the select
        if (state) {
            const districts = getDistrictsByState(state);
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
    
    // Handle form submission
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitApplicationForm(scheme);
        });
    }
    
    // Close modal
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('.close-modal-btn')?.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Initialize file upload previews
function initFileUploads() {
    document.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name || 'No file chosen';
            const fileSize = this.files[0]?.size || 0; // in bytes
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            
            if (fileSize > maxSize) {
                showToast('File size should be less than 5MB', 'error');
                this.value = ''; // Clear the file input
                this.nextElementSibling.nextElementSibling.textContent = 'No file chosen';
                return;
            }
            
            this.nextElementSibling.nextElementSibling.textContent = fileName;
        });
    });
}

// Submit application form
function submitApplicationForm(scheme) {
    if (!currentUser) {
        showToast('Please login to apply', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        schemeId: scheme.id,
        farmerId: currentUser.id,
        personalInfo: {
            name: document.getElementById('applicantName').value.trim(),
            mobile: document.getElementById('applicantMobile').value.trim(),
            aadhaar: document.getElementById('applicantAadhaar').value.trim(),
            email: document.getElementById('applicantEmail').value.trim(),
            state: document.getElementById('applicantState').value,
            district: document.getElementById('applicantDistrict').value,
            village: document.getElementById('applicantVillage').value.trim(),
            pincode: document.getElementById('applicantPincode').value.trim()
        },
        additionalInfo: document.getElementById('additionalInfo').value.trim(),
        documents: []
    };
    
    // Get uploaded files (in a real app, you would upload these to a server)
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach((input, index) => {
        if (input.files.length > 0) {
            formData.documents.push({
                name: input.getAttribute('data-doc'),
                fileName: input.files[0].name,
                fileSize: input.files[0].size,
                fileType: input.files[0].type
                // In a real app, you would upload the file and store the URL/path
            });
        }
    });
    
    // Validate form
    if (!formData.personalInfo.name || !formData.personalInfo.mobile || !formData.personalInfo.aadhaar || 
        !formData.personalInfo.state || !formData.personalInfo.district || !formData.personalInfo.village) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (formData.personalInfo.mobile.length !== 10 || !/^\d+$/.test(formData.personalInfo.mobile)) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
    }
    
    if (formData.personalInfo.aadhaar.length !== 12 || !/^\d+$/.test(formData.personalInfo.aadhaar)) {
        showToast('Please enter a valid 12-digit Aadhaar number', 'error');
        return;
    }
    
    if (formData.personalInfo.pincode && (formData.personalInfo.pincode.length !== 6 || !/^\d+$/.test(formData.personalInfo.pincode))) {
        showToast('Please enter a valid 6-digit pincode', 'error');
        return;
    }
    
    if (formData.documents.length < scheme.requiredDocuments.length) {
        showToast(`Please upload all required documents (${scheme.requiredDocuments.length - formData.documents.length} remaining)`, 'error');
        return;
    }
    
    // In a real app, you would upload files to a server here
    // and then submit the form data including file URLs
    
    // For demo purposes, we'll simulate a successful submission
    setTimeout(() => {
        // Submit application
        const result = submitApplication({
            schemeId: formData.schemeId,
            farmerId: formData.farmerId,
            personalInfo: formData.personalInfo,
            additionalInfo: formData.additionalInfo,
            documents: formData.documents,
            status: 'Submitted',
            appliedOn: new Date().toISOString()
        });
        
        if (result.success) {
            // Close the modal
            const modal = document.getElementById('applicationModal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
            
            // Show success message
            showToast('Application submitted successfully!', 'success');
            
            // In a real app, you might want to show the application details or redirect
            console.log('Application ID:', result.applicationId);
        } else {
            showToast('Failed to submit application. Please try again.', 'error');
        }
    }, 1500);
}

// Show user's applications
function showApplications() {
    if (!currentUser) {
        showToast('Please login to view your applications', 'error');
        return;
    }
    
    const userApplications = getApplicationsByUserId(currentUser.id);
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal" id="applicationsModal">
            <div class="modal-content" style="max-width: 1000px;">
                <span class="close">&times;</span>
                <h2>My Applications</h2>
                
                ${userApplications.length === 0 ? `
                    <div class="no-applications">
                        <i class="fas fa-folder-open"></i>
                        <p>You haven't applied to any schemes yet.</p>
                        <button class="btn btn-primary" onclick="document.getElementById('applicationsModal').remove();">
                            Browse Schemes
                        </button>
                    </div>
                ` : `
                    <div class="applications-list">
                        <table class="applications-table">
                            <thead>
                                <tr>
                                    <th>Application ID</th>
                                    <th>Scheme</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${userApplications.map(app => {
                                    const scheme = getSchemeById(app.schemeId);
                                    const appliedDate = new Date(app.appliedOn).toLocaleDateString();
                                    
                                    return `
                                        <tr>
                                            <td>${app.id}</td>
                                            <td>${scheme?.title || 'N/A'}</td>
                                            <td>${appliedDate}</td>
                                            <td>
                                                <span class="status-badge ${app.status.toLowerCase()}">
                                                    ${app.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-outline view-application" data-id="${app.id}">
                                                    <i class="fas fa-eye"></i> View
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show the modal
    const modal = document.getElementById('applicationsModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    // View application details
    modal.querySelectorAll('.view-application').forEach(button => {
        button.addEventListener('click', () => {
            const applicationId = button.getAttribute('data-id');
            showApplicationDetails(applicationId);
            modal.remove();
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Show application details
function showApplicationDetails(applicationId) {
    const application = getApplicationById(applicationId);
    if (!application) {
        showToast('Application not found', 'error');
        return;
    }
    
    const scheme = getSchemeById(application.schemeId);
    const appliedDate = new Date(application.appliedOn).toLocaleString();
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal" id="applicationDetailsModal">
            <div class="modal-content" style="max-width: 800px;">
                <span class="close">&times;</span>
                <h2>Application Details</h2>
                
                <div class="application-details">
                    <div class="detail-section">
                        <h3>Application Summary</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Application ID:</span>
                                <span class="detail-value">${application.id}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Scheme Name:</span>
                                <span class="detail-value">${scheme?.title || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Applied On:</span>
                                <span class="detail-value">${appliedDate}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="status-badge ${application.status.toLowerCase()}">
                                    ${application.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Applicant Information</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Full Name:</span>
                                <span class="detail-value">${application.personalInfo?.name || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mobile:</span>
                                <span class="detail-value">${application.personalInfo?.mobile || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Aadhaar:</span>
                                <span class="detail-value">${application.personalInfo?.aadhaar || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${application.personalInfo?.email || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Address:</span>
                                <span class="detail-value">
                                    ${[application.personalInfo?.village, application.personalInfo?.district, application.personalInfo?.state, application.personalInfo?.pincode].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Application Status</h3>
                        <div class="timeline">
                            ${application.statusHistory?.map((status, index) => {
                                const statusDate = new Date(status.date).toLocaleString();
                                return `
                                    <div class="timeline-item ${index === 0 ? 'active' : ''}">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <h4>${status.status}</h4>
                                            <p>${status.comments || 'No comments'}</p>
                                            <span class="timeline-date">${statusDate}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    ${application.additionalInfo ? `
                        <div class="detail-section">
                            <h3>Additional Information</h3>
                            <p>${application.additionalInfo}</p>
                        </div>
                    ` : ''}
                    
                    <div class="detail-section">
                        <h3>Uploaded Documents</h3>
                        <div class="document-list">
                            ${application.documents?.length > 0 ? 
                                application.documents.map(doc => `
                                    <div class="document-item">
                                        <i class="fas fa-file-alt"></i>
                                        <div class="document-info">
                                            <span class="document-name">${doc.name}</span>
                                            <span class="document-meta">${doc.fileName} • ${formatFileSize(doc.fileSize)}</span>
                                        </div>
                                        <button class="btn btn-sm btn-outline view-document" data-doc="${doc.name}">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                    </div>
                                `).join('') : 
                                '<p>No documents uploaded.</p>'
                            }
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-outline close-modal-btn">
                            <i class="fas fa-arrow-left"></i> Back to Applications
                        </button>
                        ${application.status === 'Submitted' ? `
                            <button class="btn btn-outline" id="printApplication">
                                <i class="fas fa-print"></i> Print Application
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show the modal
    const modal = document.getElementById('applicationDetailsModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('.close-modal-btn')?.addEventListener('click', () => {
        modal.remove();
        showApplications();
    });
    
    // Print application
    const printBtn = document.getElementById('printApplication');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // View document (in a real app, this would open the actual document)
    modal.querySelectorAll('.view-document').forEach(button => {
        button.addEventListener('click', () => {
            const docName = button.getAttribute('data-doc');
            showToast(`Viewing document: ${docName} (demo only)`, 'info');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Show admin dashboard
function showAdminDashboard() {
    if (!currentUser || !currentUser.isAdmin) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    const allApplications = getAllApplications();
    const pendingApplications = allApplications.filter(app => app.status === 'Submitted');
    const approvedApplications = allApplications.filter(app => app.status === 'Approved');
    const rejectedApplications = allApplications.filter(app => app.status === 'Rejected');
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal" id="adminDashboardModal">
            <div class="modal-content" style="max-width: 1200px; width: 95%;">
                <span class="close">&times;</span>
                <h2>Admin Dashboard</h2>
                
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${allApplications.length}</h3>
                            <p>Total Applications</p>
                        </div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${pendingApplications.length}</h3>
                            <p>Pending Review</p>
                        </div>
                    </div>
                    
                    <div class="stat-card success">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${approvedApplications.length}</h3>
                            <p>Approved</p>
                        </div>
                    </div>
                    
                    <div class="stat-card danger">
                        <div class="stat-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${rejectedApplications.length}</h3>
                            <p>Rejected</p>
                        </div>
                    </div>
                </div>
                
                <div class="admin-actions">
                    <div class="search-filter">
                        <div class="form-group" style="flex: 1;">
                            <input type="text" id="adminSearch" placeholder="Search applications..." class="form-control">
                        </div>
                        <div class="form-group">
                            <select id="filterStatus" class="form-control">
                                <option value="">All Status</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <select id="filterScheme" class="form-control">
                                <option value="">All Schemes</option>
                                ${Array.from(new Set(allApplications.map(app => app.schemeId))).map(schemeId => {
                                    const scheme = getSchemeById(schemeId);
                                    return scheme ? `<option value="${schemeId}">${scheme.title}</option>` : '';
                                }).join('')}
                            </select>
                        </div>
                        <button class="btn btn-primary" id="applyFilters">
                            <i class="fas fa-filter"></i> Apply
                        </button>
                    </div>
                </div>
                
                <div class="applications-table-container">
                    <table class="applications-table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Applicant</th>
                                <th>Scheme</th>
                                <th>Mobile</th>
                                <th>Applied On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminApplicationsList">
                            ${allApplications.length === 0 ? `
                                <tr>
                                    <td colspan="7" class="text-center">No applications found.</td>
                                </tr>
                            ` : allApplications.map(app => {
                                const appliedDate = new Date(app.appliedOn).toLocaleDateString();
                                return `
                                    <tr data-id="${app.id}" data-status="${app.status}" data-scheme="${app.schemeId}">
                                        <td>${app.id}</td>
                                        <td>${app.farmerName || 'N/A'}</td>
                                        <td>${app.schemeName || 'N/A'}</td>
                                        <td>${app.mobile || 'N/A'}</td>
                                        <td>${appliedDate}</td>
                                        <td>
                                            <span class="status-badge ${app.status.toLowerCase().replace(' ', '-')}">
                                                ${app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-outline view-application" data-id="${app.id}">
                                                <i class="fas fa-eye"></i> View
                                            </button>
                                            ${app.status === 'Submitted' ? `
                                                <button class="btn btn-sm btn-success approve-application" data-id="${app.id}">
                                                    <i class="fas fa-check"></i> Approve
                                                </button>
                                                <button class="btn btn-sm btn-danger reject-application" data-id="${app.id}">
                                                    <i class="fas fa-times"></i> Reject
                                                </button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="form-actions" style="margin-top: 20px;">
                    <button class="btn btn-outline close-modal-btn">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="btn btn-primary" id="exportApplications">
                        <i class="fas fa-file-export"></i> Export to Excel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show the modal
    const modal = document.getElementById('adminDashboardModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('.close-modal-btn')?.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    // View application
    modal.querySelectorAll('.view-application').forEach(button => {
        button.addEventListener('click', () => {
            const applicationId = button.getAttribute('data-id');
            modal.remove();
            showAdminApplicationDetails(applicationId);
        });
    });
    
    // Approve application
    modal.querySelectorAll('.approve-application').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const applicationId = button.getAttribute('data-id');
            updateApplicationStatus(applicationId, 'Approved', 'Application approved by admin');
            showToast('Application approved successfully', 'success');
            button.closest('tr').querySelector('.status-badge').textContent = 'Approved';
            button.closest('tr').querySelector('.status-badge').className = 'status-badge approved';
            button.closest('td').innerHTML = `
                <button class="btn btn-sm btn-outline view-application" data-id="${applicationId}">
                    <i class="fas fa-eye"></i> View
                </button>
            `;
        });
    });
    
    // Reject application
    modal.querySelectorAll('.reject-application').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const applicationId = button.getAttribute('data-id');
            const reason = prompt('Please enter the reason for rejection:');
            if (reason) {
                updateApplicationStatus(applicationId, 'Rejected', `Application rejected: ${reason}`);
                showToast('Application rejected', 'success');
                button.closest('tr').querySelector('.status-badge').textContent = 'Rejected';
                button.closest('tr').querySelector('.status-badge').className = 'status-badge rejected';
                button.closest('td').innerHTML = `
                    <button class="btn btn-sm btn-outline view-application" data-id="${applicationId}">
                        <i class="fas fa-eye"></i> View
                    </button>
                `;
            }
        });
    });
    
    // Apply filters
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyAdminFilters);
    }
    
    // Search functionality
    const searchInput = document.getElementById('adminSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                applyAdminFilters();
            }
        });
    }
    
    // Export to Excel
    const exportBtn = document.getElementById('exportApplications');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // In a real app, this would generate and download an Excel file
            showToast('Exporting to Excel... (demo only)', 'info');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Apply filters in admin dashboard
function applyAdminFilters() {
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const schemeFilter = document.getElementById('filterScheme')?.value || '';
    const searchQuery = document.getElementById('adminSearch')?.value.toLowerCase() || '';
    
    const rows = document.querySelectorAll('#adminApplicationsList tr');
    
    rows.forEach(row => {
        const status = row.getAttribute('data-status') || '';
        const scheme = row.getAttribute('data-scheme') || '';
        const text = row.textContent.toLowerCase();
        
        const statusMatch = !statusFilter || status === statusFilter;
        const schemeMatch = !schemeFilter || scheme === schemeFilter;
        const searchMatch = !searchQuery || text.includes(searchQuery);
        
        if (statusMatch && schemeMatch && searchMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Show admin application details
function showAdminApplicationDetails(applicationId) {
    const application = getApplicationById(applicationId);
    if (!application) {
        showToast('Application not found', 'error');
        return;
    }
    
    const scheme = getSchemeById(application.schemeId);
    const user = users.find(u => u.id === application.farmerId);
    const appliedDate = new Date(application.appliedOn).toLocaleString();
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal" id="adminApplicationDetailsModal">
            <div class="modal-content" style="max-width: 900px;">
                <span class="close">&times;</span>
                <h2>Application Details</h2>
                
                <div class="application-details">
                    <div class="detail-header">
                        <div>
                            <h3>${scheme?.title || 'N/A'}</h3>
                            <p>Application ID: ${application.id}</p>
                        </div>
                        <div class="application-actions">
                            <span class="status-badge ${application.status.toLowerCase()}">
                                ${application.status}
                            </span>
                            ${application.status === 'Submitted' ? `
                                <button class="btn btn-sm btn-success" id="adminApproveBtn">
                                    <i class="fas fa-check"></i> Approve
                                </button>
                                <button class="btn btn-sm btn-danger" id="adminRejectBtn">
                                    <i class="fas fa-times"></i> Reject
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Applicant Information</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Full Name:</span>
                                <span class="detail-value">${application.personalInfo?.name || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mobile:</span>
                                <span class="detail-value">${application.personalInfo?.mobile || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Aadhaar:</span>
                                <span class="detail-value">${application.personalInfo?.aadhaar || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${application.personalInfo?.email || 'N/A'}</span>
                            </div>
                            <div class="detail-item full-width">
                                <span class="detail-label">Address:</span>
                                <span class="detail-value">
                                    ${[application.personalInfo?.village, application.personalInfo?.district, application.personalInfo?.state, application.personalInfo?.pincode].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Application Timeline</h3>
                        <div class="timeline">
                            ${application.statusHistory?.map((status, index) => {
                                const statusDate = new Date(status.date).toLocaleString();
                                return `
                                    <div class="timeline-item ${index === 0 ? 'active' : ''}">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <h4>${status.status}</h4>
                                            <p>${status.comments || 'No comments'}</p>
                                            <span class="timeline-date">${statusDate}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Update Status</h3>
                        <div class="form-group">
                            <label for="statusUpdate">Status</label>
                            <select id="statusUpdate" class="form-control">
                                <option value="" ${application.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                                <option value="Under Review" ${application.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                                <option value="Approved" ${application.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                <option value="Rejected" ${application.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="statusComments">Comments</label>
                            <textarea id="statusComments" rows="3" class="form-control" placeholder="Enter comments..."></textarea>
                        </div>
                        <button class="btn btn-primary" id="updateStatusBtn">
                            <i class="fas fa-save"></i> Update Status
                        </button>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Uploaded Documents</h3>
                        <div class="document-list">
                            ${application.documents?.length > 0 ? 
                                application.documents.map(doc => `
                                    <div class="document-item">
                                        <i class="fas fa-file-alt"></i>
                                        <div class="document-info">
                                            <span class="document-name">${doc.name}</span>
                                            <span class="document-meta">${doc.fileName} • ${formatFileSize(doc.fileSize)}</span>
                                        </div>
                                        <button class="btn btn-sm btn-outline view-document" data-doc="${doc.name}">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                        <button class="btn btn-sm btn-outline download-document" data-doc="${doc.name}">
                                            <i class="fas fa-download"></i> Download
                                        </button>
                                    </div>
                                `).join('') : 
                                '<p>No documents uploaded.</p>'
                            }
                        </div>
                    </div>
                    
                    ${application.additionalInfo ? `
                        <div class="detail-section">
                            <h3>Additional Information</h3>
                            <p>${application.additionalInfo}</p>
                        </div>
                    ` : ''}
                    
                    <div class="form-actions">
                        <button class="btn btn-outline close-modal-btn">
                            <i class="fas fa-arrow-left"></i> Back to Applications
                        </button>
                        <div>
                            <button class="btn btn-outline" id="printApplication">
                                <i class="fas fa-print"></i> Print
                            </button>
                            <button class="btn btn-primary" id="sendMessageBtn">
                                <i class="fas fa-envelope"></i> Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show the modal
    const modal = document.getElementById('adminApplicationDetailsModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('.close-modal-btn')?.addEventListener('click', () => {
        modal.remove();
        showAdminDashboard();
    });
    
    // Approve application
    const approveBtn = document.getElementById('adminApproveBtn');
    if (approveBtn) {
        approveBtn.addEventListener('click', () => {
            updateApplicationStatus(application.id, 'Approved', 'Application approved by admin');
            showToast('Application approved successfully', 'success');
            modal.remove();
            showAdminDashboard();
        });
    }
    
    // Reject application
    const rejectBtn = document.getElementById('adminRejectBtn');
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            const reason = prompt('Please enter the reason for rejection:');
            if (reason) {
                updateApplicationStatus(application.id, 'Rejected', `Application rejected: ${reason}`);
                showToast('Application rejected', 'success');
                modal.remove();
                showAdminDashboard();
            }
        });
    }
    
    // Update status
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', () => {
            const newStatus = document.getElementById('statusUpdate').value;
            const comments = document.getElementById('statusComments').value.trim() || 'Status updated by admin';
            
            if (!newStatus) {
                showToast('Please select a status', 'error');
                return;
            }
            
            updateApplicationStatus(application.id, newStatus, comments);
            showToast('Status updated successfully', 'success');
            modal.remove();
            showAdminApplicationDetails(application.id);
        });
    }
    
    // Print application
    const printBtn = document.getElementById('printApplication');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // Send message
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', () => {
            const message = prompt('Enter your message to the applicant:');
            if (message) {
                // In a real app, this would send a notification or email to the applicant
                showToast(`Message sent to applicant: ${message}`, 'success');
            }
        });
    }
    
    // View document
    modal.querySelectorAll('.view-document').forEach(button => {
        button.addEventListener('click', () => {
            const docName = button.getAttribute('data-doc');
            showToast(`Viewing document: ${docName} (demo only)`, 'info');
        });
    });
    
    // Download document
    modal.querySelectorAll('.download-document').forEach(button => {
        button.addEventListener('click', () => {
            const docName = button.getAttribute('data-doc');
            showToast(`Downloading document: ${docName} (demo only)`, 'info');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Filter schemes based on search and filters
function filterSchemes() {
    const category = categoryFilter?.value || '';
    const state = stateFilter?.value || '';
    const searchTerm = searchInput?.value.toLowerCase() || '';
    
    let filtered = [...allSchemes];
    
    // Filter by category
    if (category) {
        filtered = filtered.filter(scheme => 
            scheme.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Filter by state (in a real app, this would filter schemes available in the selected state)
    if (state) {
        // For demo, we'll just show all schemes if a state is selected
        // In a real app, you would filter schemes based on the selected state
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(scheme => 
            scheme.title.toLowerCase().includes(searchTerm) ||
            scheme.description.toLowerCase().includes(searchTerm) ||
            scheme.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Display filtered schemes
    displaySchemes(filtered);
}

// Handle search
function handleSearch() {
    filterSchemes();
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast show';
    
    // Add type class
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'success') {
        toast.classList.add('success');
    } else if (type === 'warning') {
        toast.classList.add('warning');
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Any additional initialization code can go here
});
