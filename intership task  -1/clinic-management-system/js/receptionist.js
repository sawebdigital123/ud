// Receptionist Module for Clinic Management System

// Sample data (in a real app, this would come from a database)
if (typeof patients === 'undefined') {
    var patients = [];
}
if (typeof appointments === 'undefined') {
    var appointments = [];
}
if (typeof bills === 'undefined') {
    var bills = [];
}

// DOM Elements
let registerPatientBtn, viewAllPatientsBtn, generateBillBtn, receptionistContent;

// Initialize Receptionist Module
function initReceptionistModule() {
    console.log('Initializing receptionist module...');
    
    try {
        // Get DOM elements
        registerPatientBtn = document.getElementById('register-patient-btn');
        viewAllPatientsBtn = document.getElementById('view-all-patients-btn');
        generateBillBtn = document.getElementById('generate-bill-btn');
        receptionistContent = document.getElementById('receptionist-content');
        
        console.log('Register button element:', registerPatientBtn);
        
        // Load data from localStorage
        loadDataFromStorage();
        
        // If no data, load sample data
        if (patients.length === 0) {
            console.log('No patient data found, loading sample data...');
            loadSampleData();
        }
        
        // Add event listeners
        if (registerPatientBtn) {
            // Remove any existing event listeners to prevent duplicates
            const newRegisterBtn = registerPatientBtn.cloneNode(true);
            registerPatientBtn.parentNode.replaceChild(newRegisterBtn, registerPatientBtn);
            registerPatientBtn = newRegisterBtn;
            
            // Add click event listener
            registerPatientBtn.addEventListener('click', function(e) {
                console.log('Register button clicked');
                e.preventDefault();
                showPatientRegistrationForm();
            });
            
            console.log('Event listener added to register button');
        } else {
            console.error('Register patient button not found in the DOM');
        }
        
        if (viewAllPatientsBtn) {
            viewAllPatientsBtn.addEventListener('click', showAllPatients);
        }
        
        if (generateBillBtn) {
            generateBillBtn.addEventListener('click', showBillingSection);
        }
        
        // Show all patients by default
        showAllPatients();
        
    } catch (error) {
        console.error('Error initializing receptionist module:', error);
    }
    showAllPatients();
}

// Load sample data
function loadSampleData() {
    // Sample patients (same as in doctor.js but with additional fields)
    patients = [
        {
            id: 'PAT-0001',
            token: 'TK-0001',
            registrationDate: '2025-01-15',
            name: 'John Smith',
            age: 45,
            gender: 'Male',
            phone: '555-0101',
            email: 'john.smith@example.com',
            address: '123 Main St, Anytown, USA',
            bloodGroup: 'A+',
            allergies: ['Penicillin'],
            medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
            visits: [
                {
                    id: 'VIS-001',
                    date: '2025-10-15',
                    doctor: 'Dr. Smith',
                    diagnosis: 'Hypertension follow-up',
                    notes: 'Patient reports feeling better with current medication',
                    prescription: [
                        { medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
                        { medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
                    ]
                }
            ]
        },
        {
            id: 'PAT-0002',
            token: 'TK-0002',
            registrationDate: '2025-02-20',
            name: 'Sarah Johnson',
            age: 32,
            gender: 'Female',
            phone: '555-0102',
            email: 'sarah.j@example.com',
            address: '456 Oak Ave, Somewhere, USA',
            bloodGroup: 'O-',
            allergies: ['Sulfa'],
            medicalHistory: ['Asthma', 'Seasonal Allergies'],
            visits: [
                {
                    id: 'VIS-002',
                    date: '2025-10-10',
                    doctor: 'Dr. Smith',
                    diagnosis: 'Asthma exacerbation',
                    notes: 'Patient reports increased use of rescue inhaler',
                    prescription: [
                        { medicine: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', duration: '30 days' },
                        { medicine: 'Fluticasone', dosage: '110mcg', frequency: 'Twice daily', duration: '30 days' }
                    ]
                }
            ]
        }
    ];
    
    // Sample appointments
    appointments = [
        {
            id: 'APT-001',
            patientId: 'PAT-0001',
            patientName: 'John Smith',
            date: '2025-11-20',
            time: '10:00 AM',
            reason: 'Follow-up for hypertension',
            status: 'Scheduled',
            token: 'TK-0001'
        },
        {
            id: 'APT-002',
            patientId: 'PAT-0002',
            patientName: 'Sarah Johnson',
            date: '2025-11-21',
            time: '02:30 PM',
            reason: 'Asthma checkup',
            status: 'Scheduled',
            token: 'TK-0002'
        }
    ];
    
    // Sample bills
    bills = [
        {
            id: 'INV-1001',
            patientId: 'PAT-0001',
            patientName: 'John Smith',
            date: '2025-10-15',
            items: [
                { description: 'Consultation Fee', amount: 50.00 },
                { description: 'Blood Test', amount: 75.00 }
            ],
            tax: 12.50,
            discount: 0.00,
            status: 'Paid',
            paymentMethod: 'Credit Card',
            paymentDate: '2025-10-15'
        }
    ];
    
    // Save to localStorage
    saveDataToStorage();
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('receptionist_patients', JSON.stringify(patients));
    localStorage.setItem('receptionist_appointments', JSON.stringify(appointments));
    localStorage.setItem('bills', JSON.stringify(bills));
}

// Load data from localStorage
function loadDataFromStorage() {
    try {
        const savedPatients = localStorage.getItem('receptionist_patients');
        const savedAppointments = localStorage.getItem('receptionist_appointments');
        const savedBills = localStorage.getItem('bills');
        
        if (savedPatients) {
            const parsedPatients = JSON.parse(savedPatients);
            if (Array.isArray(parsedPatients)) {
                patients = parsedPatients;
            }
        }
        
        if (savedAppointments) {
            const parsedAppointments = JSON.parse(savedAppointments);
            if (Array.isArray(parsedAppointments)) {
                appointments = parsedAppointments;
            }
        }
        
        if (savedBills) {
            const parsedBills = JSON.parse(savedBills);
            if (Array.isArray(parsedBills)) {
                bills = parsedBills;
            }
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Initialize with empty arrays if there's an error
        patients = patients || [];
        appointments = appointments || [];
        bills = bills || [];
    }
}

// Show patient registration form
function showPatientRegistrationForm() {
    if (!receptionistContent) return;
    
    // Generate a new token
    const newToken = generateToken();
    
    const html = `
        <div class="registration-form">
            <h2>Register New Patient</h2>
            <form id="patientRegistrationForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="token">Token Number</label>
                        <input type="text" id="token" value="${newToken}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="registrationDate">Registration Date</label>
                        <input type="date" id="registrationDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                
                <h3>Personal Information</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">Full Name <span class="required">*</span></label>
                        <input type="text" id="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="dateOfBirth">Date of Birth <span class="required">*</span></label>
                        <input type="date" id="dateOfBirth" required onchange="calculateAge()">
                    </div>
                    <div class="form-group">
                        <label for="age">Age</label>
                        <input type="number" id="age" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="gender">Gender <span class="required">*</span></label>
                        <select id="gender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="bloodGroup">Blood Group</label>
                        <select id="bloodGroup">
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                </div>
                
                <h3>Contact Information</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="phone">Phone Number <span class="required">*</span></label>
                        <input type="tel" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="address">Address</label>
                    <textarea id="address" rows="2"></textarea>
                </div>
                
                <h3>Medical Information</h3>
                <div class="form-group">
                    <label for="allergies">Allergies (comma separated)</label>
                    <input type="text" id="allergies" placeholder="e.g., Penicillin, Peanuts">
                </div>
                
                <div class="form-group">
                    <label for="medicalHistory">Medical History (comma separated)</label>
                    <input type="text" id="medicalHistory" placeholder="e.g., Hypertension, Diabetes">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Register Patient</button>
                    <button type="button" class="btn btn-secondary" onclick="showAllPatients()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    receptionistContent.innerHTML = html;
    
    // Add form submission handler
    document.getElementById('patientRegistrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const registrationDate = document.getElementById('registrationDate').value;
        const fullName = document.getElementById('fullName').value.trim();
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const bloodGroup = document.getElementById('bloodGroup').value;
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const allergies = document.getElementById('allergies').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        const medicalHistory = document.getElementById('medicalHistory').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        
        // Create new patient object
        const newPatient = {
            id: generatePatientId(),
            token: newToken,
            registrationDate: registrationDate,
            name: fullName,
            dateOfBirth: dateOfBirth,
            age: parseInt(age) || 0,
            gender: gender,
            bloodGroup: bloodGroup || 'Not specified',
            phone: phone,
            email: email || '',
            address: address || '',
            allergies: allergies,
            medicalHistory: medicalHistory,
            visits: []
        };
        
        // Add to patients array
        patients.unshift(newPatient);
        
        // Save to localStorage
        saveDataToStorage();
        
        // Show success message
        showNotification('Patient registered successfully!', 'success');
        
        // Show the newly registered patient
        showPatientDetails(newPatient.id);
    });
}

// Calculate age from date of birth
function calculateAge() {
    const dobInput = document.getElementById('dateOfBirth');
    const ageInput = document.getElementById('age');
    
    if (dobInput.value) {
        const birthDate = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        ageInput.value = age;
    } else {
        ageInput.value = '';
    }
}

// Show all patients
function showAllPatients() {
    if (!receptionistContent) return;
    
    let html = `
        <div class="patients-list">
            <div class="list-header">
                <h2>Patient Records</h2>
                <div class="search-box">
                    <input type="text" id="patient-search" placeholder="Search patients..." class="search-input">
                </div>
            </div>
            
            <div class="table-responsive">
                <table id="patients-table">
                    <thead>
                        <tr>
                            <th>Token No.</th>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Registration Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    patients.forEach(patient => {
        html += `
            <tr>
                <td>${patient.token || 'N/A'}</td>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>${new Date(patient.registrationDate).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm" onclick="showPatientDetails('${patient.id}')">View</button>
                    <button class="btn btn-secondary btn-sm" onclick="editPatient('${patient.id}')">Edit</button>
                    <button class="btn btn-success btn-sm" onclick="createAppointment('${patient.id}')">Appointment</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    receptionistContent.innerHTML = html;
    
    // Add search functionality
    const searchInput = document.getElementById('patient-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#patients-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }, 300));
    }
}

// Show patient details
function showPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        showNotification('Patient not found', 'error');
        return;
    }
    
    let html = `
        <div class="patient-details">
            <div class="patient-header">
                <div class="header-actions">
                    <h2>${patient.name} <small>${patient.id}</small></h2>
                    <div>
                        <button class="btn btn-secondary btn-sm" onclick="editPatient('${patient.id}')">Edit</button>
                        <button class="btn btn-success btn-sm" onclick="createAppointment('${patient.id}')">New Appointment</button>
                        <button class="btn btn-primary btn-sm" onclick="showAllPatients()">Back to List</button>
                    </div>
                </div>
                <div class="patient-info">
                    <p><strong>Token No.:</strong> ${patient.token || 'N/A'} | <strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
                    <p><strong>Phone:</strong> ${patient.phone} | <strong>Email:</strong> ${patient.email || 'N/A'}</p>
                    <p><strong>Address:</strong> ${patient.address || 'N/A'}</p>
                    <p><strong>Blood Group:</strong> ${patient.bloodGroup || 'Not specified'}</p>
                    <p><strong>Allergies:</strong> ${patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}</p>
                    <p><strong>Medical History:</strong> ${patient.medicalHistory && patient.medicalHistory.length > 0 ? patient.medicalHistory.join(', ') : 'None'}</p>
                    <p><strong>Registration Date:</strong> ${new Date(patient.registrationDate).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="patient-tabs">
                <div class="tabs">
                    <button class="tab-btn active" data-tab="appointments">Appointments</button>
                    <button class="tab-btn" data-tab="visits">Visit History</button>
                    <button class="tab-btn" data-tab="bills">Bills</button>
                </div>
                
                <div class="tab-content">
                    <div id="appointments-tab" class="tab-pane active">
                        <div class="tab-header">
                            <h3>Appointments</h3>
                            <button class="btn btn-primary btn-sm" onclick="createAppointment('${patient.id}')">New Appointment</button>
                        </div>
                        ${renderAppointmentsTab(patient.id)}
                    </div>
                    
                    <div id="visits-tab" class="tab-pane">
                        <h3>Visit History</h3>
                        ${renderVisitsTab(patient.visits || [])}
                    </div>
                    
                    <div id="bills-tab" class="tab-pane">
                        <div class="tab-header">
                            <h3>Billing History</h3>
                            <button class="btn btn-primary btn-sm" onclick="generateBill('${patient.id}')">Generate Bill</button>
                        </div>
                        ${renderBillsTab(patient.id)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    receptionistContent.innerHTML = html;
    
    // Add tab switching functionality
    setupTabs();
}

// Render appointments tab
function renderAppointmentsTab(patientId) {
    const patientAppointments = appointments.filter(apt => apt.patientId === patientId);
    
    if (patientAppointments.length === 0) {
        return '<p>No appointments found for this patient.</p>';
    }
    
    let html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Appointment ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Token</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    patientAppointments.forEach(apt => {
        html += `
            <tr>
                <td>${apt.id}</td>
                <td>${new Date(apt.date).toLocaleDateString()}</td>
                <td>${apt.time}</td>
                <td>${apt.reason}</td>
                <td><span class="status-badge ${apt.status.toLowerCase()}">${apt.status}</span></td>
                <td>${apt.token || 'N/A'}</td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm" onclick="viewAppointment('${apt.id}')">View</button>
                    <button class="btn btn-warning btn-sm" onclick="rescheduleAppointment('${apt.id}')">Reschedule</button>
                    <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${apt.id}')">Cancel</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Render visits tab
function renderVisitsTab(visits) {
    if (visits.length === 0) {
        return '<p>No visit history available for this patient.</p>';
    }
    
    let html = `
        <div class="visits-list">
    `;
    
    visits.forEach(visit => {
        html += `
            <div class="visit-card">
                <div class="visit-header">
                    <h4>${new Date(visit.date).toLocaleDateString()} - ${visit.doctor || 'Doctor'}</h4>
                    <span class="badge">${visit.diagnosis || 'No diagnosis'}</span>
                </div>
                <div class="visit-notes">
                    <p><strong>Notes:</strong> ${visit.notes || 'No notes available'}</p>
                </div>
        `;
        
        if (visit.prescription && visit.prescription.length > 0) {
            html += `
                <div class="prescription">
                    <h5>Prescription</h5>
                    <table class="prescription-table">
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            visit.prescription.forEach(med => {
                html += `
                    <tr>
                        <td>${med.medicine}</td>
                        <td>${med.dosage}</td>
                        <td>${med.frequency}</td>
                        <td>${med.duration}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        html += `</div>`; // Close visit-card
    });
    
    html += `</div>`; // Close visits-list
    
    return html;
}

// Render bills tab
function renderBillsTab(patientId) {
    const patientBills = bills.filter(bill => bill.patientId === patientId);
    
    if (patientBills.length === 0) {
        return '<p>No billing history available for this patient.</p>';
    }
    
    let html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Bill No.</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    patientBills.forEach(bill => {
        const totalAmount = bill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const taxAmount = parseFloat(bill.tax) || 0;
        const discountAmount = parseFloat(bill.discount) || 0;
        const grandTotal = totalAmount + taxAmount - discountAmount;
        
        html += `
            <tr>
                <td>${bill.id}</td>
                <td>${new Date(bill.date).toLocaleDateString()}</td>
                <td>$${grandTotal.toFixed(2)}</td>
                <td><span class="status-badge ${bill.status.toLowerCase()}">${bill.status}</span></td>
                <td>${bill.paymentMethod || 'N/A'}</td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm" onclick="viewBill('${bill.id}')">View</button>
                    <button class="btn btn-success btn-sm" onclick="printBill('${bill.id}')">Print</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Set up tab switching
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Create a new appointment
function createAppointment(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        showNotification('Patient not found', 'error');
        return;
    }
    
    // Generate a new token
    const newToken = generateToken();
    
    const html = `
        <div class="appointment-form">
            <h2>New Appointment for ${patient.name}</h2>
            <form id="appointmentForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="appointmentDate">Date <span class="required">*</span></label>
                        <input type="date" id="appointmentDate" min="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="appointmentTime">Time <span class="required">*</span></label>
                        <input type="time" id="appointmentTime" required>
                    </div>
                    <div class="form-group">
                        <label for="token">Token Number</label>
                        <input type="text" id="token" value="${newToken}" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reason">Reason for Visit <span class="required">*</span></label>
                    <input type="text" id="reason" required>
                </div>
                
                <div class="form-group">
                    <label for="notes">Notes</label>
                    <textarea id="notes" rows="3"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Schedule Appointment</button>
                    <button type="button" class="btn btn-secondary" onclick="showPatientDetails('${patientId}')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal(html);
    
    // Set default time to next hour
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    document.getElementById('appointmentTime').value = 
        `${String(nextHour.getHours()).padStart(2, '0')}:${String(nextHour.getMinutes()).padStart(2, '0')}`;
    
    // Handle form submission
    document.getElementById('appointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const reason = document.getElementById('reason').value.trim();
        const notes = document.getElementById('notes').value.trim();
        
        // Create new appointment
        const newAppointment = {
            id: 'APT-' + String(1000 + Math.floor(Math.random() * 9000)),
            patientId: patientId,
            patientName: patient.name,
            date: date,
            time: formatTimeString(time),
            reason: reason,
            notes: notes || '',
            status: 'Scheduled',
            token: newToken,
            createdAt: new Date().toISOString()
        };
        
        // Add to appointments array
        appointments.push(newAppointment);
        
        // Save to localStorage
        saveDataToStorage();
        
        // Close modal
        closeModal();
        
        // Show success message
        showNotification('Appointment scheduled successfully!', 'success');
        
        // Refresh the view
        showPatientDetails(patientId);
    });
}

// Format time string (HH:MM) to 12-hour format
function formatTimeString(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// View appointment details
function viewAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === appointment.patientId);
    
    const html = `
        <div class="appointment-details">
            <h2>Appointment Details</h2>
            
            <div class="detail-group">
                <h3>Appointment Information</h3>
                <p><strong>Appointment ID:</strong> ${appointment.id}</p>
                <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Status:</strong> <span class="status-badge ${appointment.status.toLowerCase()}">${appointment.status}</span></p>
                <p><strong>Token No.:</strong> ${appointment.token || 'N/A'}</p>
            </div>
            
            <div class="detail-group">
                <h3>Patient Information</h3>
                <p><strong>Name:</strong> ${appointment.patientName}</p>
                ${patient ? `
                    <p><strong>Age:</strong> ${patient.age || 'N/A'}</p>
                    <p><strong>Gender:</strong> ${patient.gender || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${patient.phone || 'N/A'}</p>
                ` : ''}
            </div>
            
            <div class="detail-group">
                <h3>Visit Details</h3>
                <p><strong>Reason for Visit:</strong> ${appointment.reason || 'Not specified'}</p>
                <p><strong>Notes:</strong> ${appointment.notes || 'No additional notes'}</p>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-primary" onclick="rescheduleAppointment('${appointment.id}')">Reschedule</button>
                <button class="btn btn-danger" onclick="cancelAppointment('${appointment.id}')">Cancel Appointment</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    showModal(html);
}

// Reschedule appointment
function rescheduleAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    // For simplicity, we'll just update the appointment status to "Rescheduled"
    // In a real app, you would provide a form to select a new date/time
    appointment.status = 'Rescheduled';
    saveDataToStorage();
    
    showNotification('Appointment has been marked as Rescheduled', 'success');
    
    // Close the modal if open
    closeModal();
    
    // Refresh the view
    if (appointment.patientId) {
        showPatientDetails(appointment.patientId);
    } else {
        showAllPatients();
    }
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    // Update appointment status
    appointment.status = 'Cancelled';
    saveDataToStorage();
    
    showNotification('Appointment has been cancelled', 'success');
    
    // Close the modal if open
    closeModal();
    
    // Refresh the view
    if (appointment.patientId) {
        showPatientDetails(appointment.patientId);
    } else {
        showAllPatients();
    }
}

// Show billing section
function showBillingSection() {
    if (!receptionistContent) return;
    
    // Get today's bills
    const today = new Date().toISOString().split('T')[0];
    const todayBills = bills.filter(bill => bill.date === today);
    
    // Calculate totals
    const totalBills = bills.length;
    const totalRevenue = bills.reduce((sum, bill) => {
        const subtotal = bill.items.reduce((s, item) => s + parseFloat(item.amount), 0);
        const tax = parseFloat(bill.tax) || 0;
        const discount = parseFloat(bill.discount) || 0;
        return sum + (subtotal + tax - discount);
    }, 0);
    
    const todayRevenue = todayBills.reduce((sum, bill) => {
        const subtotal = bill.items.reduce((s, item) => s + parseFloat(item.amount), 0);
        const tax = parseFloat(bill.tax) || 0;
        const discount = parseFloat(bill.discount) || 0;
        return sum + (subtotal + tax - discount);
    }, 0);
    
    let html = `
        <div class="billing-dashboard">
            <div class="billing-header">
                <h2>Billing & Invoicing</h2>
                <div class="billing-stats">
                    <div class="stat-card">
                        <h3>Today's Revenue</h3>
                        <p class="amount">$${todayRevenue.toFixed(2)}</p>
                        <p class="meta">${todayBills.length} bills</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Revenue</h3>
                        <p class="amount">$${totalRevenue.toFixed(2)}</p>
                        <p class="meta">${totalBills} total bills</p>
                    </div>
                </div>
            </div>
            
            <div class="billing-actions">
                <button class="btn btn-primary" onclick="generateBill()">Generate New Bill</button>
                <button class="btn btn-secondary" id="viewAllBillsBtn">View All Bills</button>
            </div>
            
            <div class="recent-bills">
                <h3>Recent Bills</h3>
                ${renderRecentBills()}
            </div>
        </div>
    `;
    
    receptionistContent.innerHTML = html;
    
    // Add event listener for view all bills button
    const viewAllBillsBtn = document.getElementById('viewAllBillsBtn');
    if (viewAllBillsBtn) {
        viewAllBillsBtn.addEventListener('click', showAllBills);
    }
}

// Render recent bills
function renderRecentBills(limit = 5) {
    if (bills.length === 0) {
        return '<p>No bills found.</p>';
    }
    
    // Sort by date (newest first)
    const sortedBills = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentBills = sortedBills.slice(0, limit);
    
    let html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Bill No.</th>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    recentBills.forEach(bill => {
        const patient = patients.find(p => p.id === bill.patientId);
        const totalAmount = bill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const taxAmount = parseFloat(bill.tax) || 0;
        const discountAmount = parseFloat(bill.discount) || 0;
        const grandTotal = totalAmount + taxAmount - discountAmount;
        
        html += `
            <tr>
                <td>${bill.id}</td>
                <td>${new Date(bill.date).toLocaleDateString()}</td>
                <td>${patient ? patient.name : bill.patientName || 'Unknown'}</td>
                <td>$${grandTotal.toFixed(2)}</td>
                <td><span class="status-badge ${bill.status.toLowerCase()}">${bill.status}</span></td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm" onclick="viewBill('${bill.id}')">View</button>
                    <button class="btn btn-success btn-sm" onclick="printBill('${bill.id}')">Print</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Show all bills
function showAllBills() {
    if (!receptionistContent) return;
    
    let html = `
        <div class="all-bills">
            <div class="bills-header">
                <h2>All Bills</h2>
                <div class="filters">
                    <div class="form-group">
                        <label for="billStatusFilter">Status:</label>
                        <select id="billStatusFilter">
                            <option value="">All</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="billDateFrom">From:</label>
                        <input type="date" id="billDateFrom">
                    </div>
                    <div class="form-group">
                        <label for="billDateTo">To:</label>
                        <input type="date" id="billDateTo">
                    </div>
                    <button class="btn btn-primary" id="applyBillFilters">Apply</button>
                    <button class="btn btn-secondary" onclick="showBillingSection()">Back to Dashboard</button>
                </div>
            </div>
            
            <div class="bills-list">
                ${renderBillsTable(bills)}
            </div>
        </div>
    `;
    
    receptionistContent.innerHTML = html;
    
    // Add event listeners for filters
    const applyFiltersBtn = document.getElementById('applyBillFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyBillFilters);
    }
}

// Apply bill filters
function applyBillFilters() {
    const statusFilter = document.getElementById('billStatusFilter').value;
    const dateFrom = document.getElementById('billDateFrom').value;
    const dateTo = document.getElementById('billDateTo').value;
    
    let filteredBills = [...bills];
    
    // Apply status filter
    if (statusFilter) {
        filteredBills = filteredBills.filter(bill => bill.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateFrom) {
        filteredBills = filteredBills.filter(bill => bill.date >= dateFrom);
    }
    
    if (dateTo) {
        filteredBills = filteredBills.filter(bill => bill.date <= dateTo);
    }
    
    // Update the table with filtered results
    const billsList = document.querySelector('.bills-list');
    if (billsList) {
        billsList.innerHTML = renderBillsTable(filteredBills);
    }
}

// Render bills table
function renderBillsTable(billsToRender) {
    if (billsToRender.length === 0) {
        return '<p>No bills found matching the selected criteria.</p>';
    }
    
    let html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Bill No.</th>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    billsToRender.forEach(bill => {
        const patient = patients.find(p => p.id === bill.patientId);
        const totalAmount = bill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const taxAmount = parseFloat(bill.tax) || 0;
        const discountAmount = parseFloat(bill.discount) || 0;
        const grandTotal = totalAmount + taxAmount - discountAmount;
        
        html += `
            <tr>
                <td>${bill.id}</td>
                <td>${new Date(bill.date).toLocaleDateString()}</td>
                <td>${patient ? patient.name : bill.patientName || 'Unknown'}</td>
                <td>${bill.items.length} items</td>
                <td>$${grandTotal.toFixed(2)}</td>
                <td><span class="status-badge ${bill.status.toLowerCase()}">${bill.status}</span></td>
                <td>${bill.paymentMethod || 'N/A'}</td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm" onclick="viewBill('${bill.id}')">View</button>
                    <button class="btn btn-success btn-sm" onclick="printBill('${bill.id}')">Print</button>
                    ${bill.status === 'Pending' ? `
                        <button class="btn btn-warning btn-sm" onclick="recordPayment('${bill.id}')">Record Payment</button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Generate a new bill
function generateBill(patientId = '') {
    let patient = null;
    
    if (patientId) {
        patient = patients.find(p => p.id === patientId);
    }
    
    const html = `
        <div class="bill-form">
            <h2>${patient ? `Generate Bill for ${patient.name}` : 'New Bill'}</h2>
            <form id="billForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="billDate">Date</label>
                        <input type="date" id="billDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="billPatient">Patient <span class="required">*</span></label>
                        <select id="billPatient" ${patient ? 'disabled' : ''} required>
                            ${patient ? 
                                `<option value="${patient.id}" selected>${patient.name} (${patient.id})</option>` : 
                                '<option value="">Select Patient</option>'
                            }
                            ${!patient ? patients.map(p => 
                                `<option value="${p.id}">${p.name} (${p.id})</option>`
                            ).join('') : ''}
                        </select>
                    </div>
                </div>
                
                <div class="bill-items">
                    <h3>Bill Items</h3>
                    <div id="billItemsContainer">
                        <div class="bill-item">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Description</label>
                                    <input type="text" class="item-desc" required>
                                </div>
                                <div class="form-group">
                                    <label>Quantity</label>
                                    <input type="number" class="item-qty" value="1" min="1" required>
                                </div>
                                <div class="form-group">
                                    <label>Unit Price ($)</label>
                                    <input type="number" class="item-price" step="0.01" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label>Amount ($)</label>
                                    <input type="text" class="item-amount" value="0.00" readonly>
                                </div>
                                <div class="form-group">
                                    <label>&nbsp;</label>
                                    <button type="button" class="btn btn-danger btn-sm remove-item" style="display: none;">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button type="button" class="btn btn-secondary btn-sm" id="addBillItem">+ Add Item</button>
                </div>
                
                <div class="bill-summary">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="subtotal">Subtotal ($)</label>
                            <input type="text" id="subtotal" value="0.00" readonly>
                        </div>
                        <div class="form-group">
                            <label for="tax">Tax ($)</label>
                            <input type="number" id="tax" value="0.00" step="0.01" min="0">
                        </div>
                        <div class="form-group">
                            <label for="discount">Discount ($)</label>
                            <input type="number" id="discount" value="0.00" step="0.01" min="0">
                        </div>
                        <div class="form-group">
                            <label for="total">Total ($)</label>
                            <input type="text" id="total" value="0.00" readonly>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="paymentMethod">Payment Method</label>
                    <select id="paymentMethod" required>
                        <option value="">Select Payment Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="billNotes">Notes</label>
                    <textarea id="billNotes" rows="2"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Bill</button>
                    <button type="button" class="btn btn-secondary" onclick="${patientId ? `showPatientDetails('${patientId}')` : 'showBillingSection()'}">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    if (patientId) {
        // Show in the main content area if called from patient details
        receptionistContent.innerHTML = html;
    } else {
        // Show in a modal if called from billing section
        showModal(html);
    }
    
    // Add event listeners for bill items
    setupBillItemListeners();
    
    // Add item button
    const addItemBtn = document.getElementById('addBillItem');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addBillItem);
    }
    
    // Handle form submission
    const billForm = document.getElementById('billForm');
    if (billForm) {
        billForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveBill();
        });
    }
    
    // Calculate totals when values change
    const billItemsContainer = document.getElementById('billItemsContainer');
    if (billItemsContainer) {
        billItemsContainer.addEventListener('input', calculateBillTotals);
    }
    
    const taxInput = document.getElementById('tax');
    const discountInput = document.getElementById('discount');
    
    if (taxInput) taxInput.addEventListener('change', calculateBillTotals);
    if (discountInput) discountInput.addEventListener('change', calculateBillTotals);
}

// Set up event listeners for bill items
function setupBillItemListeners() {
    // Show/hide remove buttons based on number of items
    const billItems = document.querySelectorAll('.bill-item');
    billItems.forEach((item, index) => {
        const removeBtn = item.querySelector('.remove-item');
        if (removeBtn) {
            // Show remove button if there's more than one item
            removeBtn.style.display = billItems.length > 1 ? 'block' : 'none';
            
            // Add remove functionality
            removeBtn.addEventListener('click', function() {
                item.remove();
                calculateBillTotals();
                
                // Update remove buttons visibility
                const remainingItems = document.querySelectorAll('.bill-item');
                remainingItems.forEach(remainingItem => {
                    const btn = remainingItem.querySelector('.remove-item');
                    if (btn) {
                        btn.style.display = remainingItems.length > 1 ? 'block' : 'none';
                    }
                });
            });
        }
        
        // Add event listeners for quantity and price changes
        const qtyInput = item.querySelector('.item-qty');
        const priceInput = item.querySelector('.item-price');
        
        if (qtyInput && priceInput) {
            qtyInput.addEventListener('input', calculateItemAmount);
            priceInput.addEventListener('input', calculateItemAmount);
        }
    });
}

// Add a new bill item
function addBillItem() {
    const container = document.getElementById('billItemsContainer');
    if (!container) return;
    
    const newItem = document.createElement('div');
    newItem.className = 'bill-item';
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Description</label>
                <input type="text" class="item-desc" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="item-qty" value="1" min="1" required>
            </div>
            <div class="form-group">
                <label>Unit Price ($)</label>
                <input type="number" class="item-price" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <label>Amount ($)</label>
                <input type="text" class="item-amount" value="0.00" readonly>
            </div>
            <div class="form-group">
                <label>&nbsp;</label>
                <button type="button" class="btn btn-danger btn-sm remove-item">Remove</button>
            </div>
        </div>
    `;
    
    container.appendChild(newItem);
    
    // Set up event listeners for the new item
    setupBillItemListeners();
    
    // Focus on the description field of the new item
    const descInput = newItem.querySelector('.item-desc');
    if (descInput) descInput.focus();
}

// Calculate amount for a single bill item
function calculateItemAmount(e) {
    const item = e.target.closest('.bill-item');
    if (!item) return;
    
    const qtyInput = item.querySelector('.item-qty');
    const priceInput = item.querySelector('.item-price');
    const amountInput = item.querySelector('.item-amount');
    
    if (!qtyInput || !priceInput || !amountInput) return;
    
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const amount = qty * price;
    
    amountInput.value = amount.toFixed(2);
    
    // Recalculate totals
    calculateBillTotals();
}

// Calculate bill totals
function calculateBillTotals() {
    const items = document.querySelectorAll('.bill-item');
    let subtotal = 0;
    
    items.forEach(item => {
        const amountInput = item.querySelector('.item-amount');
        if (amountInput) {
            subtotal += parseFloat(amountInput.value) || 0;
        }
    });
    
    const taxInput = document.getElementById('tax');
    const discountInput = document.getElementById('discount');
    const subtotalInput = document.getElementById('subtotal');
    const totalInput = document.getElementById('total');
    
    if (!taxInput || !discountInput || !subtotalInput || !totalInput) return;
    
    const tax = parseFloat(taxInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    
    // Update subtotal
    subtotalInput.value = subtotal.toFixed(2);
    
    // Calculate and update total
    const total = subtotal + tax - discount;
    totalInput.value = total.toFixed(2);
}

// Save bill
function saveBill() {
    const billDate = document.getElementById('billDate').value;
    const patientId = document.getElementById('billPatient').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const notes = document.getElementById('billNotes').value;
    const tax = parseFloat(document.getElementById('tax').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    
    // Get bill items
    const items = [];
    document.querySelectorAll('.bill-item').forEach(item => {
        const desc = item.querySelector('.item-desc').value.trim();
        const qty = parseFloat(item.querySelector('.item-qty').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const amount = parseFloat(item.querySelector('.item-amount').value) || 0;
        
        if (desc && qty > 0 && price > 0) {
            items.push({
                description: desc,
                quantity: qty,
                unitPrice: price,
                amount: amount
            });
        }
    });
    
    // Validate
    if (!patientId) {
        showNotification('Please select a patient', 'error');
        return;
    }
    
    if (items.length === 0) {
        showNotification('Please add at least one bill item', 'error');
        return;
    }
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // Get patient info
    const patient = patients.find(p => p.id === patientId);
    
    // Create new bill
    const newBill = {
        id: generateBillNumber(),
        patientId: patientId,
        patientName: patient ? patient.name : 'Unknown',
        date: billDate,
        items: items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount
        })),
        tax: tax,
        discount: discount,
        status: 'Pending',
        paymentMethod: paymentMethod,
        notes: notes,
        createdAt: new Date().toISOString()
    };
    
    // Add to bills array
    bills.push(newBill);
    
    // Save to localStorage
    saveDataToStorage();
    
    // Show success message
    showNotification('Bill saved successfully!', 'success');
    
    // Close modal if open
    closeModal();
    
    // Show the billing section or patient details based on context
    if (document.querySelector('.billing-dashboard')) {
        showBillingSection();
    } else if (patientId) {
        showPatientDetails(patientId);
    }
}

// View bill details
function viewBill(billId) {
    const bill = bills.find(b => b.id === billId);
    if (!bill) {
        showNotification('Bill not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === bill.patientId);
    const subtotal = bill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const tax = parseFloat(bill.tax) || 0;
    const discount = parseFloat(bill.discount) || 0;
    const total = subtotal + tax - discount;
    
    let html = `
        <div class="bill-details">
            <div class="bill-header">
                <div class="clinic-info">
                    <h2>Clinic Management System</h2>
                    <p>123 Healthcare Ave, Medical District</p>
                    <p>City, State 12345</p>
                    <p>Phone: (555) 123-4567 | Email: info@clinic.com</p>
                </div>
                <div class="bill-info">
                    <h1>INVOICE</h1>
                    <p><strong>Invoice #:</strong> ${bill.id}</p>
                    <p><strong>Date:</strong> ${new Date(bill.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${bill.status.toLowerCase()}">${bill.status}</span></p>
                </div>
            </div>
            
            <div class="bill-patient">
                <div class="bill-from">
                    <h3>Bill From</h3>
                    <p><strong>Clinic Management System</strong></p>
                    <p>123 Healthcare Ave</p>
                    <p>Medical District, City, State 12345</p>
                    <p>Phone: (555) 123-4567</p>
                </div>
                
                <div class="bill-to">
                    <h3>Bill To</h3>
                    <p><strong>${patient ? patient.name : bill.patientName || 'Unknown'}</strong></p>
                    ${patient ? `
                        <p>${patient.address || 'N/A'}</p>
                        <p>Phone: ${patient.phone || 'N/A'}</p>
                        <p>Email: ${patient.email || 'N/A'}</p>
                    ` : ''}
                </div>
            </div>
            
            <div class="bill-items">
                <table class="bill-items-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    bill.items.forEach((item, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${parseFloat(item.unitPrice).toFixed(2)}</td>
                <td>$${parseFloat(item.amount).toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" class="text-right"><strong>Subtotal:</strong></td>
                            <td>$${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-right"><strong>Tax:</strong></td>
                            <td>$${tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-right"><strong>Discount:</strong></td>
                            <td>$${discount.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="4" class="text-right"><strong>Total:</strong></td>
                            <td><strong>$${total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <div class="bill-notes">
                <p><strong>Payment Method:</strong> ${bill.paymentMethod || 'N/A'}</p>
                ${bill.paymentDate ? `<p><strong>Payment Date:</strong> ${new Date(bill.paymentDate).toLocaleDateString()}</p>` : ''}
                ${bill.notes ? `<p><strong>Notes:</strong> ${bill.notes}</p>` : ''}
            </div>
            
            <div class="bill-actions">
                <button class="btn btn-primary" onclick="printBill('${bill.id}')">Print Bill</button>
                ${bill.status === 'Pending' ? 
                    `<button class="btn btn-success" onclick="recordPayment('${bill.id}')">Record Payment</button>` : 
                    ''
                }
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    showModal(html);
}

// Record payment for a bill
function recordPayment(billId) {
    const bill = bills.find(b => b.id === billId);
    if (!bill) {
        showNotification('Bill not found', 'error');
        return;
    }
    
    const html = `
        <div class="record-payment">
            <h2>Record Payment</h2>
            <form id="paymentForm">
                <div class="form-group">
                    <label for="paymentAmount">Amount ($)</label>
                    <input type="number" id="paymentAmount" value="${calculateBillTotal(bill).toFixed(2)}" step="0.01" min="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="paymentMethod">Payment Method <span class="required">*</span></label>
                    <select id="paymentMethod" required>
                        <option value="">Select Payment Method</option>
                        <option value="Cash" ${bill.paymentMethod === 'Cash' ? 'selected' : ''}>Cash</option>
                        <option value="Credit Card" ${bill.paymentMethod === 'Credit Card' ? 'selected' : ''}>Credit Card</option>
                        <option value="Debit Card" ${bill.paymentMethod === 'Debit Card' ? 'selected' : ''}>Debit Card</option>
                        <option value="Bank Transfer" ${bill.paymentMethod === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
                        <option value="Other" ${bill.paymentMethod === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="paymentDate">Payment Date</label>
                    <input type="date" id="paymentDate" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                
                <div class="form-group">
                    <label for="paymentNotes">Notes</label>
                    <textarea id="paymentNotes" rows="2"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Record Payment</button>
                    <button type="button" class="btn btn-secondary" onclick="viewBill('${billId}')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal(html);
    
    // Handle form submission
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Update bill status and payment info
        bill.status = 'Paid';
        bill.paymentMethod = document.getElementById('paymentMethod').value;
        bill.paymentDate = document.getElementById('paymentDate').value;
        bill.paymentNotes = document.getElementById('paymentNotes').value;
        
        // Save to localStorage
        saveDataToStorage();
        
        // Show success message
        showNotification('Payment recorded successfully!', 'success');
        
        // Close the modal and refresh the view
        closeModal();
        
        // If we're on the billing section, refresh it
        if (document.querySelector('.billing-dashboard')) {
            showBillingSection();
        }
        
        // If we're viewing the bill, update it
        if (document.querySelector('.bill-details')) {
            viewBill(billId);
        }
    });
}

// Calculate total for a bill
function calculateBillTotal(bill) {
    const subtotal = bill.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const tax = parseFloat(bill.tax) || 0;
    const discount = parseFloat(bill.discount) || 0;
    return subtotal + tax - discount;
}

// Print bill
function printBill(billId) {
    // In a real app, this would open a print dialog with a nicely formatted bill
    // For now, we'll just show a message
    showNotification('Printing bill ' + billId, 'info');
    
    // In a real implementation, you would open a new window with the bill content
    // and call window.print() on it
    /*
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<h1>Printing Bill ' + billId + '</h1>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    */
}

// Edit patient details
function editPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        showNotification('Patient not found', 'error');
        return;
    }
    
    const html = `
        <div class="edit-patient-form">
            <h2>Edit Patient: ${patient.name}</h2>
            <form id="editPatientForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editToken">Token Number</label>
                        <input type="text" id="editToken" value="${patient.token || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="editPatientId">Patient ID</label>
                        <input type="text" id="editPatientId" value="${patient.id}" readonly>
                    </div>
                </div>
                
                <h3>Personal Information</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editFullName">Full Name <span class="required">*</span></label>
                        <input type="text" id="editFullName" value="${patient.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editDateOfBirth">Date of Birth <span class="required">*</span></label>
                        <input type="date" id="editDateOfBirth" value="${patient.dateOfBirth || ''}" onchange="calculateEditAge()">
                    </div>
                    <div class="form-group">
                        <label for="editAge">Age</label>
                        <input type="number" id="editAge" value="${patient.age || ''}" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editGender">Gender <span class="required">*</span></label>
                        <select id="editGender" required>
                            <option value="" ${!patient.gender ? 'selected' : ''}>Select Gender</option>
                            <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${patient.gender === 'Other' ? 'selected' : ''}>Other</option>
                            <option value="Prefer not to say" ${patient.gender === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editBloodGroup">Blood Group</label>
                        <select id="editBloodGroup">
                            <option value="" ${!patient.bloodGroup ? 'selected' : ''}>Select Blood Group</option>
                            <option value="A+" ${patient.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                            <option value="A-" ${patient.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                            <option value="B+" ${patient.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                            <option value="B-" ${patient.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                            <option value="AB+" ${patient.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                            <option value="AB-" ${patient.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                            <option value="O+" ${patient.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                            <option value="O-" ${patient.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                        </select>
                    </div>
                </div>
                
                <h3>Contact Information</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editPhone">Phone Number <span class="required">*</span></label>
                        <input type="tel" id="editPhone" value="${patient.phone || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Email Address</label>
                        <input type="email" id="editEmail" value="${patient.email || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editAddress">Address</label>
                    <textarea id="editAddress" rows="2">${patient.address || ''}</textarea>
                </div>
                
                <h3>Medical Information</h3>
                <div class="form-group">
                    <label for="editAllergies">Allergies (comma separated)</label>
                    <input type="text" id="editAllergies" value="${patient.allergies ? patient.allergies.join(', ') : ''}" placeholder="e.g., Penicillin, Peanuts">
                </div>
                
                <div class="form-group">
                    <label for="editMedicalHistory">Medical History (comma separated)</label>
                    <input type="text" id="editMedicalHistory" value="${patient.medicalHistory ? patient.medicalHistory.join(', ') : ''}" placeholder="e.g., Hypertension, Diabetes">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="showPatientDetails('${patient.id}')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    receptionistContent.innerHTML = html;
    
    // Add form submission handler
    document.getElementById('editPatientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('editFullName').value.trim();
        const dateOfBirth = document.getElementById('editDateOfBirth').value;
        const age = document.getElementById('editAge').value;
        const gender = document.getElementById('editGender').value;
        const bloodGroup = document.getElementById('editBloodGroup').value;
        const phone = document.getElementById('editPhone').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const address = document.getElementById('editAddress').value.trim();
        const allergies = document.getElementById('editAllergies').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        const medicalHistory = document.getElementById('editMedicalHistory').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        
        // Update patient object
        const patientIndex = patients.findIndex(p => p.id === patientId);
        if (patientIndex !== -1) {
            patients[patientIndex] = {
                ...patients[patientIndex],
                name: fullName,
                dateOfBirth: dateOfBirth,
                age: parseInt(age) || 0,
                gender: gender,
                bloodGroup: bloodGroup || 'Not specified',
                phone: phone,
                email: email || '',
                address: address || '',
                allergies: allergies,
                medicalHistory: medicalHistory
            };
            
            // Save to localStorage
            saveDataToStorage();
            
            // Show success message
            showNotification('Patient details updated successfully!', 'success');
            
            // Show the updated patient details
            showPatientDetails(patientId);
        }
    });
}

// Calculate age in edit form
function calculateEditAge() {
    const dobInput = document.getElementById('editDateOfBirth');
    const ageInput = document.getElementById('editAge');
    
    if (dobInput.value) {
        const birthDate = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        ageInput.value = age;
    } else {
        ageInput.value = '';
    }
}

// Make functions available globally
window.showPatientDetails = showPatientDetails;
window.editPatient = editPatient;
window.createAppointment = createAppointment;
window.viewAppointment = viewAppointment;
window.rescheduleAppointment = rescheduleAppointment;
window.cancelAppointment = cancelAppointment;
window.showAllPatients = showAllPatients;
window.generateBill = generateBill;
window.viewBill = viewBill;
window.printBill = printBill;
window.recordPayment = recordPayment;
window.calculateAge = calculateAge;
window.calculateEditAge = calculateEditAge;

// Expose the initialization function
window.initReceptionistModule = initReceptionistModule;

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    // Initialize when the page loads if we're on the receptionist dashboard
    const initializeIfOnReceptionistPage = () => {
        const receptionistDashboard = document.getElementById('receptionist-dashboard');
        if (receptionistDashboard) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initReceptionistModule);
            } else {
                initReceptionistModule();
            }
        }
    };
    
    // Check if the receptionist dashboard is present on the page
    if (document.getElementById('receptionist-dashboard')) {
        initializeIfOnReceptionistPage();
    } else {
        // If not, wait for the auth module to handle the initialization
        document.addEventListener('auth:login', (event) => {
            if (event.detail.role === 'receptionist') {
                initializeIfOnReceptionistPage();
            }
        });
    }
}
