// Doctor Module for Clinic Management System

// Sample data (in a real app, this would come from a database)
let patients = [];
let appointments = [];

// DOM Elements
let viewPatientsBtn, viewAppointmentsBtn, doctorContent;

// Initialize Doctor Module
function initDoctorModule() {
    // Get DOM elements
    viewPatientsBtn = document.getElementById('view-patients-btn');
    viewAppointmentsBtn = document.getElementById('view-appointments-btn');
    doctorContent = document.getElementById('doctor-content');
    
    // Load sample data if empty
    if (patients.length === 0) {
        loadSampleData();
    }
    
    // Add event listeners
    if (viewPatientsBtn) {
        viewPatientsBtn.addEventListener('click', showPatientList);
    }
    
    if (viewAppointmentsBtn) {
        viewAppointmentsBtn.addEventListener('click', showAppointments);
    }
    
    // Show patients by default
    showPatientList();
}

// Load sample data
function loadSampleData() {
    // Sample patients
    patients = [
        {
            id: 'PAT-0001',
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
                },
                {
                    id: 'VIS-002',
                    date: '2025-09-15',
                    doctor: 'Dr. Smith',
                    diagnosis: 'Annual checkup',
                    notes: 'Patient in good health, advised to continue current treatment',
                    prescription: []
                }
            ]
        },
        {
            id: 'PAT-0002',
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
                    id: 'VIS-003',
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
            status: 'Scheduled'
        },
        {
            id: 'APT-002',
            patientId: 'PAT-0002',
            patientName: 'Sarah Johnson',
            date: '2025-11-21',
            time: '02:30 PM',
            reason: 'Asthma checkup',
            status: 'Scheduled'
        }
    ];
    
    // Save to localStorage
    saveDataToStorage();
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('doctor_patients', JSON.stringify(patients));
    localStorage.setItem('doctor_appointments', JSON.stringify(appointments));
}

// Load data from localStorage
function loadDataFromStorage() {
    const savedPatients = localStorage.getItem('doctor_patients');
    const savedAppointments = localStorage.getItem('doctor_appointments');
    
    if (savedPatients) patients = JSON.parse(savedPatients);
    if (savedAppointments) appointments = JSON.parse(savedAppointments);
}

// Show list of patients
function showPatientList() {
    if (!doctorContent) return;
    
    // Set active button
    if (viewPatientsBtn) viewPatientsBtn.classList.add('active');
    if (viewAppointmentsBtn) viewAppointmentsBtn.classList.remove('active');
    
    let html = `
        <div class="table-responsive">
            <div class="table-header">
                <h3>Patient List</h3>
                <div class="search-box">
                    <input type="text" id="patient-search" placeholder="Search patients..." class="search-input">
                </div>
            </div>
            <table id="patients-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Last Visit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    patients.forEach(patient => {
        const lastVisit = patient.visits && patient.visits.length > 0 
            ? new Date(patient.visits[0].date).toLocaleDateString() 
            : 'No visits';
            
        html += `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>${lastVisit}</td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm" onclick="viewPatientDetails('${patient.id}')">View</button>
                    <button class="btn btn-secondary btn-sm" onclick="addPrescription('${patient.id}')">Add Prescription</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    doctorContent.innerHTML = html;
    
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
function viewPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        showNotification('Patient not found', 'error');
        return;
    }
    
    let html = `
        <div class="patient-details">
            <div class="patient-header">
                <h2>${patient.name} <small>${patient.id}</small></h2>
                <div class="patient-info">
                    <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
                    <p><strong>Phone:</strong> ${patient.phone} | <strong>Email:</strong> ${patient.email}</p>
                    <p><strong>Address:</strong> ${patient.address}</p>
                    <p><strong>Blood Group:</strong> ${patient.bloodGroup}</p>
                    <p><strong>Allergies:</strong> ${patient.allergies ? patient.allergies.join(', ') : 'None'}</p>
                    <p><strong>Medical History:</strong> ${patient.medicalHistory ? patient.medicalHistory.join(', ') : 'None'}</p>
                </div>
            </div>
            <div class="patient-visits">
                <h3>Visit History</h3>
    `;
    
    if (patient.visits && patient.visits.length > 0) {
        patient.visits.forEach(visit => {
            html += `
                <div class="visit-card">
                    <div class="visit-header">
                        <h4>${new Date(visit.date).toLocaleDateString()} - ${visit.doctor}</h4>
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
    } else {
        html += '<p>No visit history available for this patient.</p>';
    }
    
    html += `
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="addPrescription('${patient.id}')">Add Prescription</button>
                <button class="btn btn-secondary" onclick="showPatientList()">Back to List</button>
            </div>
        </div>
    `;
    
    doctorContent.innerHTML = html;
}

// Show add prescription form
function addPrescription(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        showNotification('Patient not found', 'error');
        return;
    }
    
    let html = `
        <div class="prescription-form">
            <h2>Add Prescription for ${patient.name}</h2>
            <form id="prescriptionForm">
                <div class="form-group">
                    <label for="diagnosis">Diagnosis:</label>
                    <input type="text" id="diagnosis" required>
                </div>
                
                <div class="form-group">
                    <label for="notes">Clinical Notes:</label>
                    <textarea id="notes" rows="4"></textarea>
                </div>
                
                <div id="medicines-container">
                    <div class="medicine-item">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Medicine</label>
                                <input type="text" class="medicine" required>
                            </div>
                            <div class="form-group">
                                <label>Dosage</label>
                                <input type="text" class="dosage" placeholder="e.g., 500mg" required>
                            </div>
                            <div class="form-group">
                                <label>Frequency</label>
                                <input type="text" class="frequency" placeholder="e.g., Twice daily" required>
                            </div>
                            <div class="form-group">
                                <label>Duration</label>
                                <input type="text" class="duration" placeholder="e.g., 7 days" required>
                            </div>
                            <div class="form-group">
                                <label>&nbsp;</label>
                                <button type="button" class="btn btn-danger btn-sm remove-medicine" style="display: none;">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <button type="button" class="btn btn-secondary" id="add-medicine">+ Add Another Medicine</button>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Prescription</button>
                    <button type="button" class="btn btn-secondary" onclick="viewPatientDetails('${patientId}')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    doctorContent.innerHTML = html;
    
    // Add medicine
    document.getElementById('add-medicine').addEventListener('click', function() {
        const container = document.getElementById('medicines-container');
        const newItem = container.children[0].cloneNode(true);
        
        // Clear input values
        newItem.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        
        // Show remove button for all but the first item
        const removeButtons = container.querySelectorAll('.remove-medicine');
        removeButtons.forEach(btn => {
            btn.style.display = 'block';
        });
        
        // Add remove functionality
        newItem.querySelector('.remove-medicine').addEventListener('click', function() {
            container.removeChild(newItem);
            
            // Hide remove button if only one item remains
            if (container.children.length === 1) {
                container.querySelector('.remove-medicine').style.display = 'none';
            }
        });
        
        container.appendChild(newItem);
    });
    
    // Handle form submission
    document.getElementById('prescriptionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const medicineItems = [];
        const medicineElements = document.querySelectorAll('.medicine-item');
        
        medicineElements.forEach(item => {
            medicineItems.push({
                medicine: item.querySelector('.medicine').value,
                dosage: item.querySelector('.dosage').value,
                frequency: item.querySelector('.frequency').value,
                duration: item.querySelector('.duration').value
            });
        });
        
        // Create new visit record
        const newVisit = {
            id: 'VIS-' + String(1000 + Math.floor(Math.random() * 9000)),
            date: new Date().toISOString().split('T')[0],
            doctor: getCurrentUser().name,
            diagnosis: document.getElementById('diagnosis').value,
            notes: document.getElementById('notes').value,
            prescription: medicineItems
        };
        
        // Add to patient's visits
        const patientIndex = patients.findIndex(p => p.id === patientId);
        if (patientIndex !== -1) {
            if (!patients[patientIndex].visits) {
                patients[patientIndex].visits = [];
            }
            patients[patientIndex].visits.unshift(newVisit); // Add to beginning of array
            
            // Save to localStorage
            saveDataToStorage();
            
            showNotification('Prescription saved successfully!', 'success');
            viewPatientDetails(patientId);
        }
    });
}

// Show appointments
function showAppointments() {
    if (!doctorContent) return;
    
    // Set active button
    if (viewAppointmentsBtn) viewAppointmentsBtn.classList.add('active');
    if (viewPatientsBtn) viewPatientsBtn.classList.remove('active');
    
    // Filter appointments for today and future
    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = appointments
        .filter(apt => apt.date >= today)
        .sort((a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return a.date.localeCompare(b.date);
        });
    
    let html = `
        <div class="appointments-container">
            <div class="appointments-header">
                <h3>Upcoming Appointments</h3>
                <div class="view-options">
                    <button class="btn btn-sm ${'active'}" id="view-upcoming">Upcoming</button>
                    <button class="btn btn-sm" id="view-past">Past Appointments</button>
                </div>
            </div>
            
            <div id="appointments-list">
    `;
    
    if (upcomingAppointments.length > 0) {
        upcomingAppointments.forEach(apt => {
            const patient = patients.find(p => p.id === apt.patientId);
            const lastVisit = patient && patient.visits && patient.visits.length > 0 
                ? new Date(patient.visits[0].date).toLocaleDateString() 
                : 'First visit';
            
            html += `
                <div class="appointment-card">
                    <div class="appointment-info">
                        <div class="appointment-time">
                            <div class="date">${new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div class="time">${apt.time}</div>
                        </div>
                        <div class="appointment-details">
                            <h4>${apt.patientName}</h4>
                            <p><strong>Reason:</strong> ${apt.reason}</p>
                            <p><strong>Last Visit:</strong> ${lastVisit}</p>
                        </div>
                    </div>
                    <div class="appointment-actions">
                        <button class="btn btn-primary btn-sm" onclick="viewPatientDetails('${apt.patientId}')">View Patient</button>
                        <button class="btn btn-success btn-sm" onclick="startAppointment('${apt.id}')">Start Consultation</button>
                    </div>
                </div>
            `;
        });
    } else {
        html += '<p>No upcoming appointments found.</p>';
    }
    
    html += `
            </div>
        </div>
    `;
    
    doctorContent.innerHTML = html;
    
    // Add event listeners for view options
    document.getElementById('view-upcoming').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('view-past').classList.remove('active');
        showAppointments(); // Reload with upcoming appointments
    });
    
    document.getElementById('view-past').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('view-upcoming').classList.remove('active');
        showPastAppointments();
    });
}

// Show past appointments
function showPastAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const pastAppointments = appointments
        .filter(apt => apt.date < today)
        .sort((a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return b.date.localeCompare(a.date); // Reverse order for past appointments
        });
    
    let html = '<div class="past-appointments">';
    
    if (pastAppointments.length > 0) {
        pastAppointments.forEach(apt => {
            const patient = patients.find(p => p.id === apt.patientId);
            const lastVisit = patient && patient.visits && patient.visits.length > 0 
                ? new Date(patient.visits[0].date).toLocaleDateString() 
                : 'No visits';
            
            html += `
                <div class="appointment-card">
                    <div class="appointment-info">
                        <div class="appointment-time">
                            <div class="date">${new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div class="time">${apt.time}</div>
                        </div>
                        <div class="appointment-details">
                            <h4>${apt.patientName}</h4>
                            <p><strong>Reason:</strong> ${apt.reason}</p>
                            <p><strong>Status:</strong> ${apt.status || 'Completed'}</p>
                        </div>
                    </div>
                    <div class="appointment-actions">
                        <button class="btn btn-primary btn-sm" onclick="viewPatientDetails('${apt.patientId}')">View Patient</button>
                    </div>
                </div>
            `;
        });
    } else {
        html += '<p>No past appointments found.</p>';
    }
    
    html += '</div>';
    
    document.getElementById('appointments-list').innerHTML = html;
}

// Start appointment
function startAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    // In a real app, you would navigate to a consultation screen
    // For now, we'll just show a message and mark as in-progress
    appointment.status = 'In Progress';
    saveDataToStorage();
    
    // Find the patient and view their details
    const patient = patients.find(p => p.id === appointment.patientId);
    if (patient) {
        // Show patient details with a form for the consultation
        viewPatientDetails(patient.id);
        showNotification(`Consultation started with ${patient.name}`, 'success');
    } else {
        showNotification('Patient not found', 'error');
    }
}

// Make functions available globally
window.viewPatientDetails = viewPatientDetails;
window.addPrescription = addPrescription;
window.startAppointment = startAppointment;
window.showPatientList = showPatientList;

// Initialize when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDoctorModule);
} else {
    initDoctorModule();
}
