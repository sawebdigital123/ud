// Sample data for the application
const statesAndDistricts = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

// Sample schemes data
const schemesData = [
    {
        id: 1,
        title: "PM Kisan Samman Nidhi",
        category: "Income Support",
        description: "Financial assistance of ₹6,000 per year to all farmer families across the country in three equal installments of ₹2,000 every four months.",
        eligibility: "All farmer families across the country, including small and marginal farmers.",
        benefits: "₹6,000 per year in three installments of ₹2,000 each.",
        requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Account Details", "Identity Proof"],
        deadline: "31-12-2025",
        status: "active",
        image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 2,
        title: "Pradhan Mantri Fasal Bima Yojana",
        category: "Crop Insurance",
        description: "Comprehensive insurance coverage against crop failure, helping farmers cope with agricultural risks like droughts, floods, and pests.",
        eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
        benefits: "Premium as low as 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.",
        requiredDocuments: ["Land Records", "Aadhaar Card", "Bank Account Details", "Crop Details"],
        deadline: "31-12-2024",
        status: "active",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
    },
    {
        id: 3,
        title: "Kisan Credit Card (KCC) Scheme",
        category: "Loan",
        description: "Provides farmers with timely access to credit for agriculture and allied activities at subsidized interest rates.",
        eligibility: "Individual farmers, tenant farmers, sharecroppers, and self-help groups engaged in agriculture and allied activities.",
        benefits: "Credit up to ₹3 lakh at 4% interest per annum, with additional 3% interest subvention for timely repayment.",
        requiredDocuments: ["Land Records", "Aadhaar Card", "Identity Proof", "Address Proof", "Recent Photographs"],
        deadline: "31-03-2024",
        status: "active",
        image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
    },
    {
        id: 4,
        title: "Soil Health Card Scheme",
        category: "Sustainability",
        description: "Provides farmers with soil health cards containing crop-wise recommendations of nutrients/fertilizers required for their farms.",
        eligibility: "All farmers across the country can avail soil testing and receive soil health cards.",
        benefits: "Improved soil health, optimized fertilizer use, and increased farm productivity.",
        requiredDocuments: ["Aadhaar Card", "Land Records"],
        deadline: "31-12-2025",
        status: "active",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 5,
        title: "Pradhan Mantri Krishi Sinchai Yojana",
        category: "Irrigation",
        description: "Ensures access to water to every farm field and improving water use efficiency.",
        eligibility: "Farmers in areas with water scarcity and those dependent on rainfall for irrigation.",
        benefits: "Financial assistance for micro-irrigation, water conservation, and water harvesting structures.",
        requiredDocuments: ["Land Records", "Aadhaar Card", "Bank Account Details", "Land Ownership Proof"],
        deadline: "31-03-2026",
        status: "active",
        image: "https://images.unsplash.com/photo-1531512073836-be0c7ae1c43b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 6,
        title: "National Mission for Sustainable Agriculture",
        category: "Sustainability",
        description: "Promotes sustainable agriculture through climate change adaptation measures, biodiversity conservation, and soil health management.",
        eligibility: "Farmers practicing or willing to adopt sustainable agricultural practices.",
        benefits: "Financial assistance for sustainable farming practices, capacity building, and technology transfer.",
        requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Account Details"],
        deadline: "31-12-2024",
        status: "active",
        image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 7,
        title: "Pradhan Mantri Kisan Maan Dhan Yojana",
        category: "Pension",
        description: "Pension scheme for small and marginal farmers providing a minimum fixed pension of ₹3,000 per month on attaining the age of 60 years.",
        eligibility: "Small and marginal farmers between 18-40 years of age.",
        benefits: "Fixed pension of ₹3,000 per month after 60 years of age.",
        requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Account Details", "Age Proof"],
        deadline: "31-12-2025",
        status: "active",
        image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1494&q=80"
    },
    {
        id: 8,
        title: "Paramparagat Krishi Vikas Yojana",
        category: "Organic Farming",
        description: "Promotes organic farming through adoption of organic village by cluster approach and PGS certification.",
        eligibility: "Farmers willing to practice organic farming in a cluster of 50 acres or more.",
        benefits: `Financial assistance of ₹50,000 per hectare/3 years for organic inputs, certification, marketing, etc.`,
        requiredDocuments: ["Aadhaar Card", "Land Records", "Consent for Organic Farming"],
        deadline: "31-03-2025",
        status: "active",
        image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
    }
];

// Sample user data
let users = [];

// Sample applications data
let applications = [];

// Check if data exists in localStorage and load it
function loadDataFromLocalStorage() {
    const savedUsers = localStorage.getItem('farmerSchemeUsers');
    const savedApplications = localStorage.getItem('farmerSchemeApplications');
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    if (savedApplications) {
        applications = JSON.parse(savedApplications);
    }
}

// Save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('farmerSchemeUsers', JSON.stringify(users));
    localStorage.setItem('farmerSchemeApplications', JSON.stringify(applications));
}

// Initialize data
loadDataFromLocalStorage();

// Add admin user if not exists
if (!users.some(user => user.isAdmin)) {
    users.push({
        id: Date.now(),
        fullName: 'Admin User',
        mobile: '9876543210',
        aadhaar: '123456789012',
        state: 'Maharashtra',
        district: 'Pune',
        village: 'Admin Village',
        password: 'admin123',
        isAdmin: true,
        createdAt: new Date().toISOString()
    });
    saveDataToLocalStorage();
}

// Function to get all schemes
function getAllSchemes() {
    return schemesData;
}

// Function to get scheme by ID
function getSchemeById(id) {
    return schemesData.find(scheme => scheme.id === id);
}

// Function to register a new user
function registerUser(userData) {
    const userExists = users.some(user => user.mobile === userData.mobile || user.aadhaar === userData.aadhaar);
    
    if (userExists) {
        return { success: false, message: 'User with this mobile or Aadhaar already exists' };
    }
    
    const newUser = {
        id: Date.now(),
        ...userData,
        isAdmin: false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveDataToLocalStorage();
    
    // Auto-login after registration
    return { 
        success: true, 
        message: 'Registration successful!', 
        user: { 
            id: newUser.id, 
            fullName: newUser.fullName, 
            mobile: newUser.mobile,
            isAdmin: false
        } 
    };
}

// Function to authenticate user
function loginUser(mobile, password) {
    const user = users.find(user => user.mobile === mobile && user.password === password);
    
    if (!user) {
        return { success: false, message: 'Invalid mobile number or password' };
    }
    
    return { 
        success: true, 
        message: 'Login successful!', 
        user: { 
            id: user.id, 
            fullName: user.fullName, 
            mobile: user.mobile,
            isAdmin: user.isAdmin || false
        } 
    };
}

// Function to submit an application
function submitApplication(applicationData) {
    const newApplication = {
        id: 'APP' + Date.now(),
        ...applicationData,
        appliedOn: new Date().toISOString(),
        status: 'Submitted',
        statusHistory: [
            {
                status: 'Submitted',
                date: new Date().toISOString(),
                comments: 'Application submitted successfully'
            }
        ]
    };
    
    applications.push(newApplication);
    saveDataToLocalStorage();
    
    return { 
        success: true, 
        message: 'Application submitted successfully!', 
        applicationId: newApplication.id 
    };
}

// Function to get applications by user ID
function getApplicationsByUserId(userId) {
    return applications.filter(app => app.farmerId === userId);
}

// Function to get application by ID
function getApplicationById(applicationId) {
    return applications.find(app => app.id === applicationId);
}

// Function to update application status (admin only)
function updateApplicationStatus(applicationId, status, comments = '') {
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) {
        return { success: false, message: 'Application not found' };
    }
    
    application.status = status;
    application.statusHistory.push({
        status,
        date: new Date().toISOString(),
        comments: comments || `Status updated to ${status}`
    });
    
    saveDataToLocalStorage();
    
    return { 
        success: true, 
        message: 'Application status updated successfully',
        application
    };
}

// Function to get all applications (admin only)
function getAllApplications() {
    return applications.map(app => {
        const user = users.find(u => u.id === app.farmerId);
        const scheme = getSchemeById(app.schemeId);
        
        return {
            ...app,
            farmerName: user ? user.fullName : 'Unknown',
            schemeName: scheme ? scheme.title : 'Unknown Scheme',
            mobile: user ? user.mobile : 'N/A'
        };
    });
}

// Function to get states
function getStates() {
    return Object.keys(statesAndDistricts).sort();
}

// Function to get districts by state
function getDistrictsByState(state) {
    return statesAndDistricts[state] || [];
}
