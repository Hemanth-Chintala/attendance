// Student Attendance System - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mock data (replace with actual API calls in production)
    const mockData = {
        professors: [
            { id: 1, name: 'Dr. Jane Smith', email: 'jane@gmail.com', password: 'password', role: 'admin' },
            { id: 2, name: 'Prof. John Doe', email: 'john@gmail.com', password: 'password', role: 'professor' }
        ],
        students: [
            // { id: 'STU001', name: 'Alice Johnson', course: 'CS101', registrationDate: '2024-01-15', faceData: null },
            // { id: 'STU002', name: 'Bob Williams', course: 'CS101', registrationDate: '2024-01-15', faceData: null },
            // { id: 'STU003', name: 'Charlie Brown', course: 'CS202', registrationDate: '2024-01-16', faceData: null },
            // { id: 'STU004', name: 'Diana Miller', course: 'CS202', registrationDate: '2024-01-17', faceData: null },
            // { id: 'STU005', name: 'Edward Davis', course: 'CS303', registrationDate: '2024-01-18', faceData: null }
        ],
        courses: [
            { id: 'CS101', name: 'Introduction to Computer Science', professor: 1 },
            { id: 'CS202', name: 'Data Structures and Algorithms', professor: 1 },
            { id: 'CS303', name: 'Database Systems', professor: 2 },
            { id: 'CS404', name: 'Artificial Intelligence', professor: 2 }
        ],
        attendance: [
            { id: 1, studentId: 'STU001', course: 'CS101', date: '2024-03-18', session: 'morning', timeIn: '09:15', status: 'present' },
            { id: 2, studentId: 'STU002', course: 'CS101', date: '2024-03-18', session: 'morning', timeIn: '09:20', status: 'present' },
            { id: 3, studentId: 'STU003', course: 'CS202', date: '2024-03-18', session: 'afternoon', timeIn: '14:05', status: 'present' },
            { id: 4, studentId: 'STU004', course: 'CS202', date: '2024-03-18', session: 'afternoon', timeIn: '14:30', status: 'late' },
            { id: 5, studentId: 'STU001', course: 'CS101', date: '2024-03-17', session: 'morning', timeIn: '09:10', status: 'present' },
            { id: 6, studentId: 'STU002', course: 'CS101', date: '2024-03-17', session: 'morning', timeIn: null, status: 'absent' },
            { id: 7, studentId: 'STU003', course: 'CS202', date: '2024-03-17', session: 'afternoon', timeIn: '14:10', status: 'present' },
            { id: 8, studentId: 'STU004', course: 'CS202', date: '2024-03-17', session: 'afternoon', timeIn: null, status: 'excused' }
        ],
        activities: [
            { id: 1, action: 'Login', user: 'Dr. Jane Smith', timestamp: '2024-03-19 08:45' },
            { id: 2, action: 'Started attendance session', user: 'Dr. Jane Smith', course: 'CS101', timestamp: '2024-03-19 09:00' },
            { id: 3, action: 'Marked attendance', user: 'System', student: 'Alice Johnson', course: 'CS101', timestamp: '2024-03-19 09:10' },
            { id: 4, action: 'Marked attendance', user: 'System', student: 'Bob Williams', course: 'CS101', timestamp: '2024-03-19 09:15' },
            { id: 5, action: 'Ended attendance session', user: 'Dr. Jane Smith', course: 'CS101', timestamp: '2024-03-19 09:30' }
        ]
    };

    // Current session state
    let currentUser = null;
    let currentSession = {
        active: false,
        course: null,
        date: null,
        session: null
    };

    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');
    const userName = document.getElementById('user-name');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contentSections = document.querySelectorAll('.content-section');

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simple authentication (replace with proper authentication in production)
            const user = mockData.professors.find(prof => prof.email === email && prof.password === password);
            
            if (user) {
                // Store current user
                currentUser = user;
                
                // Update UI with user name
                userName.textContent = user.name;
                
                // Hide login, show dashboard
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                
                // Initialize dashboard
                initializeDashboard();
                
                // Show toast notification
                showToast(`Welcome, ${user.name}!`, 'success');
            } else {
                showToast('Invalid email or password', 'error');
            }
        });
    }

    // Logout Button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear current user
            currentUser = null;
            
            // Reset form
            loginForm.reset();
            
            // Show login, hide dashboard
            dashboardSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
            
            // Show toast notification
            showToast('Logged out successfully', 'info');
        });
    }

    // Navigation Menu
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.add('hidden'));
            
            // Show selected content section
            const targetSection = this.getAttribute('data-section');
            document.getElementById(`${targetSection}-content`).classList.remove('hidden');
        });
    });

    // Initialize Dashboard
    function initializeDashboard() {
        // Load course data into dropdowns
        loadCourseDropdowns();
        
        // Initialize dashboard stats and charts
        initializeDashboardStats();
        
        // Initialize registered students table
        loadRegisteredStudents();
        
        // Initialize attendance records
        loadAttendanceRecords();
        
        // Set today's date for attendance date inputs
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('attendance-date').value = today;
        document.getElementById('filter-attendance-date').value = today;
        document.getElementById('report-start-date').value = today;
        document.getElementById('report-end-date').value = today;
    }

    // Load course data into all dropdowns
    function loadCourseDropdowns() {
        // Filter courses for current professor
        const professorCourses = mockData.courses.filter(course => course.professor === currentUser.id);
        
        // Get all course dropdowns
        const courseDropdowns = [
            document.getElementById('student-course'),
            document.getElementById('filter-course'),
            document.getElementById('attendance-course'),
            document.getElementById('filter-attendance-course'),
            document.getElementById('report-course')
        ];
        
        // Populate each dropdown
        courseDropdowns.forEach(dropdown => {
            if (dropdown) {
                dropdown.innerHTML = '<option value="">Select Course</option>';
                professorCourses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.id;
                    option.textContent = `${course.id} - ${course.name}`;
                    dropdown.appendChild(option);
                });
            }
        });
    }

    // Initialize Dashboard Stats and Charts
    function initializeDashboardStats() {
        // Set mock data for stats
        document.getElementById('total-students').textContent = mockData.students.length;
        
        // Count today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = mockData.attendance.filter(record => record.date === today);
        document.getElementById('today-attendance').textContent = todayAttendance.length;
        
        // Count active courses
        const activeCourses = mockData.courses.filter(course => course.professor === currentUser.id);
        document.getElementById('active-courses').textContent = activeCourses.length;
        
        // Calculate average attendance percentage
        const presentCount = mockData.attendance.filter(record => record.status === 'present').length;
        const avgAttendance = (presentCount / mockData.attendance.length * 100).toFixed(1);
        document.getElementById('avg-attendance').textContent = `${avgAttendance}%`;
        
        // Load recent activities
        const recentActivityList = document.getElementById('recent-activity');
        if (recentActivityList) {
            recentActivityList.innerHTML = '';
            mockData.activities.slice(0, 5).forEach(activity => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div><strong>${activity.action}</strong> - ${activity.timestamp}</div>
                    <div class="text-muted">${activity.user} ${activity.course ? `(${activity.course})` : ''} ${activity.student ? activity.student : ''}</div>
                `;
                recentActivityList.appendChild(li);
            });
        }
        
        // Initialize attendance chart (using charts library in production)
        const attendanceChart = document.getElementById('attendance-chart');
        if (attendanceChart) {
            attendanceChart.innerHTML = '<div style="height: 200px; background-color: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;">Chart would render here with actual data</div>';
        }
    }

    // Load Registered Students Table
    function loadRegisteredStudents() {
        const registeredStudentsTable = document.getElementById('registered-students-table');
        if (registeredStudentsTable) {
            registeredStudentsTable.innerHTML = '';
            
            mockData.students.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.course}</td>
                    <td>${student.registrationDate}</td>
                    <td class="actions">
                        <button class="edit-student" data-id="${student.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-student" data-id="${student.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                registeredStudentsTable.appendChild(tr);
            });
            
            // Add event listeners for edit and delete buttons
            attachStudentActionListeners();
        }
    }

    // Attach event listeners to student action buttons
    function attachStudentActionListeners() {
        // Edit student buttons
        document.querySelectorAll('.edit-student').forEach(button => {
            button.addEventListener('click', function() {
                const studentId = this.getAttribute('data-id');
                showToast(`Edit student ${studentId} (functionality would be implemented)`, 'info');
            });
        });
        
        // Delete student buttons
        document.querySelectorAll('.delete-student').forEach(button => {
            button.addEventListener('click', function() {
                const studentId = this.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete student ${studentId}?`)) {
                    showToast(`Delete student ${studentId} (functionality would be implemented)`, 'info');
                }
            });
        });
    }

    // Load Attendance Records
    function loadAttendanceRecords() {
        const attendanceRecordsTable = document.getElementById('attendance-records-table');
        if (attendanceRecordsTable) {
            attendanceRecordsTable.innerHTML = '';
            
            mockData.attendance.forEach(record => {
                // Find student information
                const student = mockData.students.find(s => s.id === record.studentId);
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${record.studentId}</td>
                    <td>${student ? student.name : 'Unknown'}</td>
                    <td>${record.course}</td>
                    <td>${record.date}</td>
                    <td>${record.session}</td>
                    <td>${record.timeIn || '-'}</td>
                    <td><span class="status-badge status-${record.status}">${record.status}</span></td>
                    <td class="actions">
                        <button class="edit-attendance" data-id="${record.id}"><i class="fas fa-edit"></i></button>
                    </td>
                `;
                attendanceRecordsTable.appendChild(tr);
            });
            
            // Add event listeners for edit buttons
            document.querySelectorAll('.edit-attendance').forEach(button => {
                button.addEventListener('click', function() {
                    const recordId = this.getAttribute('data-id');
                    openEditAttendanceModal(recordId);
                });
            });
        }
    }

    // Open Edit Attendance Modal
    function openEditAttendanceModal(recordId) {
        const record = mockData.attendance.find(a => a.id == recordId);
        const student = mockData.students.find(s => s.id === record.studentId);
        
        // Set form values
        document.getElementById('edit-student-id').value = record.studentId;
        document.getElementById('edit-student-name').value = student ? student.name : '';
        document.getElementById('edit-attendance-date').value = record.date;
        document.getElementById('edit-attendance-status').value = record.status;
        
        // Show modal
        document.getElementById('edit-attendance-modal').classList.remove('hidden');
        
        // Add event listeners for modal buttons
        document.getElementById('save-attendance-edit').addEventListener('click', function() {
            saveAttendanceEdit(recordId);
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', function() {
                document.getElementById('edit-attendance-modal').classList.add('hidden');
            });
        });
    }

    // Save Attendance Edit
    function saveAttendanceEdit(recordId) {
        const status = document.getElementById('edit-attendance-status').value;
        const date = document.getElementById('edit-attendance-date').value;
        
        // Update record in mock data (would be API call in production)
        const record = mockData.attendance.find(a => a.id == recordId);
        if (record) {
            record.status = status;
            record.date = date;
            
            // Reload attendance records
            loadAttendanceRecords();
            
            // Close modal
            document.getElementById('edit-attendance-modal').classList.add('hidden');
            
            // Show success toast
            showToast('Attendance record updated successfully', 'success');
        }
    }

    // Face Registration Functions
    const startWebcamBtn = document.getElementById('start-webcam');
    const uploadImageBtn = document.getElementById('upload-image');
    const capturePhotoBtn = document.getElementById('capture-photo');
    const retakePhotoBtn = document.getElementById('retake-photo');
    const confirmFaceBtn = document.getElementById('confirm-face');
    const cancelFaceBtn = document.getElementById('cancel-face');
    const studentInfoForm = document.getElementById('student-info-form');
    
    let stream = null;
    
    if (startWebcamBtn) {
        startWebcamBtn.addEventListener('click', function() {
            startWebcam();
        });
    }
    
    if (uploadImageBtn) {
        uploadImageBtn.addEventListener('click', function() {
            document.getElementById('face-image-upload').click();
        });
    }
    
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', function() {
            capturePhoto();
        });
    }
    
    if (retakePhotoBtn) {
        retakePhotoBtn.addEventListener('click', function() {
            document.getElementById('capture-controls').classList.remove('hidden');
            document.getElementById('preview-container').setAttribute('hidden', '');
        });
    }
    
    if (confirmFaceBtn) {
        confirmFaceBtn.addEventListener('click', function() {
            saveFaceData();
        });
    }
    
    if (cancelFaceBtn) {
        cancelFaceBtn.addEventListener('click', function() {
            resetFaceCapture();
        });
    }
    
    if (studentInfoForm) {
        studentInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerStudent();
        });
    }

    // Start Webcam
    function startWebcam() {
        const webcamElement = document.getElementById('webcam');
        const captureControls = document.getElementById('capture-controls');
        
        // Request webcam access
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(s) {
                stream = s;
                webcamElement.srcObject = stream;
                captureControls.classList.remove('hidden');
                showToast('Webcam started', 'info');
            })
            .catch(function(error) {
                console.error('Error accessing webcam:', error);
                showToast('Error accessing webcam. Please check permissions.', 'error');
            });
    }

    // Capture Photo
    function capturePhoto() {
        const webcamElement = document.getElementById('webcam');
        const canvasElement = document.getElementById('canvas');
        const previewElement = document.getElementById('face-preview');
        
        // Set canvas dimensions to match video
        canvasElement.width = webcamElement.videoWidth;
        canvasElement.height = webcamElement.videoHeight;
        
        // Draw video frame to canvas
        const context = canvasElement.getContext('2d');
        context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // Convert canvas to data URL and set as preview image
        const dataUrl = canvasElement.toDataURL('image/png');
        previewElement.src = dataUrl;
        
        // Hide capture controls, show preview
        document.getElementById('capture-controls').classList.add('hidden');
        document.getElementById('preview-container').removeAttribute('hidden');
    }

    // Save Face Data
    function saveFaceData() {
        const studentId = document.getElementById('student-id').value;
        
        if (!studentId) {
            showToast('Please enter student information first', 'warning');
            return;
        }
        
        // In a real application, you would:
        // 1. Extract facial features using a face recognition library
        // 2. Send the data to the server to be stored
        // 3. Associate it with the student record
        
        showToast('Face data saved successfully', 'success');
        resetFaceCapture();
    }

    // Reset Face Capture
    function resetFaceCapture() {
        // Stop webcam stream if active
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        
        // Reset UI elements
        document.getElementById('webcam').srcObject = null;
        document.getElementById('capture-controls').classList.add('hidden');
        document.getElementById('preview-container').setAttribute('hidden', '');
        document.getElementById('face-preview').src = '';
    }

    // Register Student
    function registerStudent() {
        const studentId = document.getElementById('student-id').value;
        const studentName = document.getElementById('student-name').value;
        const studentCourse = document.getElementById('student-course').value;
        
        // In a real application, you would send this data to the server
        // For demo, we'll add to our mock data
        
        // Check if student already exists
        const existingStudent = mockData.students.find(s => s.id === studentId);
        if (existingStudent) {
            showToast('Student ID already exists', 'error');
            return;
        }
        
        // Add new student
        mockData.students.push({
            id: studentId,
            name: studentName,
            course: studentCourse,
            registrationDate: new Date().toISOString().split('T')[0],
            faceData: null // Would contain facial recognition data in a real app
        });
        
        // Reload registered students table
        loadRegisteredStudents();
        
        // Reset form
        studentInfoForm.reset();
        
        // Show success toast
        showToast('Student registered successfully', 'success');
    }

    // Attendance Marking Functions
    const startAttendanceBtn = document.getElementById('start-attendance');
    const endAttendanceBtn = document.getElementById('end-attendance');
    
    if (startAttendanceBtn) {
        startAttendanceBtn.addEventListener('click', function() {
            startAttendanceSession();
        });
    }
    
    if (endAttendanceBtn) {
        endAttendanceBtn.addEventListener('click', function() {
            endAttendanceSession();
        });
    }

    // Start Attendance Session
    function startAttendanceSession() {
        const course = document.getElementById('attendance-course').value;
        const date = document.getElementById('attendance-date').value;
        const session = document.getElementById('attendance-session').value;
        
        if (!course || !date || !session) {
            showToast('Please select course, date, and session', 'warning');
            return;
        }
        
        // Set current session state
        currentSession = {
            active: true,
            course: course,
            date: date,
            session: session
        };
        
        // Update UI
        document.getElementById('recognition-status').textContent = `Attendance session started for ${course} (${session}) on ${date}`;
        startAttendanceBtn.disabled = true;
        endAttendanceBtn.disabled = false;
        
        // Start webcam for face recognition
        startRecognitionWebcam();
        
        // Show success toast
        showToast('Attendance session started', 'success');
    }

    // End Attendance Session
// End Attendance Session
function endAttendanceSession() {
    // Stop webcam
    const recognitionWebcam = document.getElementById('recognition-webcam');
    if (recognitionWebcam.srcObject) {
        const tracks = recognitionWebcam.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        recognitionWebcam.srcObject = null;
    }
    
    // Reset session state
    currentSession = {
        active: false,
        course: null,
        date: null,
        session: null
    };
    
    // Update UI
    document.getElementById('recognition-status').textContent = 'No active attendance session';
    startAttendanceBtn.disabled = false;
    endAttendanceBtn.disabled = true;
    
    // Show success toast
    showToast('Attendance session ended', 'success');
}

// Start Recognition Webcam
function startRecognitionWebcam() {
    const recognitionWebcam = document.getElementById('recognition-webcam');
    
    // Request webcam access
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            recognitionWebcam.srcObject = stream;
            
            // In a real application, you would implement facial recognition here
            // For demo purposes, we'll simulate recognition with a timer
            simulateFaceRecognition();
        })
        .catch(function(error) {
            console.error('Error accessing webcam:', error);
            showToast('Error accessing webcam. Please check permissions.', 'error');
            
            // Reset session on error
            endAttendanceSession();
        });
}

// Simulate Face Recognition
function simulateFaceRecognition() {
    // Only run if session is active
    if (!currentSession.active) return;
    
    // Simulate recognizing students at random intervals
    setTimeout(function() {
        // Find students for current course
        const courseStudents = mockData.students.filter(s => s.course === currentSession.course);
        
        if (courseStudents.length > 0) {
            // Select a random student who hasn't been marked yet
            const alreadyMarked = mockData.attendance.filter(a => 
                a.date === currentSession.date && 
                a.session === currentSession.session && 
                a.course === currentSession.course
            ).map(a => a.studentId);
            
            const unmarkedStudents = courseStudents.filter(s => !alreadyMarked.includes(s.id));
            
            if (unmarkedStudents.length > 0) {
                const randomIndex = Math.floor(Math.random() * unmarkedStudents.length);
                const student = unmarkedStudents[randomIndex];
                
                // Mark attendance
                markAttendance(student);
            }
        }
        
        // Continue simulation if session is still active
        if (currentSession.active) {
            simulateFaceRecognition();
        }
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
}

// Mark Attendance
function markAttendance(student) {
    // Get current time
    const now = new Date();
    const timeIn = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Check if student is on time or late
    const hourMinute = timeIn.split(':').map(Number);
    const isLate = (currentSession.session === 'morning' && (hourMinute[0] > 9 || (hourMinute[0] === 9 && hourMinute[1] > 15))) || 
                   (currentSession.session === 'afternoon' && (hourMinute[0] > 14 || (hourMinute[0] === 14 && hourMinute[1] > 15)));
    
    // Create new attendance record
    const newId = mockData.attendance.length + 1;
    const newRecord = {
        id: newId,
        studentId: student.id,
        course: currentSession.course,
        date: currentSession.date,
        session: currentSession.session,
        timeIn: timeIn,
        status: isLate ? 'late' : 'present'
    };
    
    // Add to mock data
    mockData.attendance.push(newRecord);
    
    // Add activity log
    mockData.activities.push({
        id: mockData.activities.length + 1,
        action: 'Marked attendance',
        user: 'System',
        student: student.name,
        course: currentSession.course,
        timestamp: `${currentSession.date} ${timeIn}`
    });
    
    // Update attendance records
    loadAttendanceRecords();
    
    // Update recognition status
    document.getElementById('recognition-status').textContent = `Recognized ${student.name} (${student.id}) at ${timeIn}`;
    
    // Show toast notification
    showToast(`${student.name} marked ${newRecord.status}`, newRecord.status === 'late' ? 'warning' : 'success');
}

// Generate Reports
const generateReportBtn = document.getElementById('generate-report');
if (generateReportBtn) {
    generateReportBtn.addEventListener('click', function() {
        generateAttendanceReport();
    });
}

// Generate Attendance Report
function generateAttendanceReport() {
    const course = document.getElementById('report-course').value;
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    
    if (!course || !startDate || !endDate) {
        showToast('Please select course, start date, and end date', 'warning');
        return;
    }
    
    // Filter attendance records
    const filteredRecords = mockData.attendance.filter(record => 
        record.course === course && 
        record.date >= startDate && 
        record.date <= endDate
    );
    
    // Get students for this course
    const courseStudents = mockData.students.filter(s => s.course === course);
    
    // Generate report table
    const reportTable = document.getElementById('report-table');
    if (reportTable) {
        reportTable.innerHTML = '';
        
        // Create header row with date columns
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Student ID</th><th>Student Name</th>';
        
        // Get unique dates within range
        const uniqueDates = [...new Set(filteredRecords.map(r => r.date))].sort();
        uniqueDates.forEach(date => {
            headerRow.innerHTML += `<th>${date}</th>`;
        });
        
        headerRow.innerHTML += '<th>Present %</th>';
        reportTable.appendChild(headerRow);
        
        // Create rows for each student
        courseStudents.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${student.id}</td><td>${student.name}</td>`;
            
            let presentCount = 0;
            
            // Add status for each date
            uniqueDates.forEach(date => {
                const record = filteredRecords.find(r => r.studentId === student.id && r.date === date);
                
                if (record) {
                    const statusClass = `status-${record.status}`;
                    row.innerHTML += `<td><span class="status-badge ${statusClass}">${record.status}</span></td>`;
                    
                    if (record.status === 'present') {
                        presentCount++;
                    }
                } else {
                    row.innerHTML += '<td>-</td>';
                }
            });
            
            // Calculate and add present percentage
            const presentPercentage = uniqueDates.length > 0 ? 
                ((presentCount / uniqueDates.length) * 100).toFixed(1) : 
                '0.0';
            
            row.innerHTML += `<td>${presentPercentage}%</td>`;
            reportTable.appendChild(row);
        });
        
        // Show report container
        document.getElementById('report-container').classList.remove('hidden');
        
        // Show success toast
        showToast('Report generated successfully', 'success');
    }
}

// Export Report as CSV
document.getElementById('export-csv').addEventListener('click', function() {
    exportReportAsCSV();
});

// Export Report as PDF
document.getElementById('export-pdf').addEventListener('click', function() {
    exportReportAsPDF();
});

// Export Report as CSV
function exportReportAsCSV() {
    const reportTable = document.getElementById('report-table');
    if (!reportTable) return;
    
    let csv = [];
    const rows = reportTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('th, td').forEach(cell => {
            // Clean up cell data (remove HTML, just get text)
            rowData.push('"' + cell.textContent.replace(/"/g, '""') + '"');
        });
        csv.push(rowData.join(','));
    });
    
    // Create CSV file
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'attendance_report.csv';
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Show toast notification
    showToast('Report exported as CSV', 'success');
}

// Export Report as PDF (mocked)
function exportReportAsPDF() {
    // In a real application, you would use a library like jsPDF
    // For this demo, we'll just show a toast
    showToast('PDF export would be implemented with jsPDF in production', 'info');
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    // Add toast to container
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        // Create container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
        container.appendChild(toast);
    } else {
        toastContainer.appendChild(toast);
    }
    
    // Remove toast after delay
    setTimeout(function() {
        toast.classList.add('fade-out');
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize application if user is already logged in
if (localStorage.getItem('currentUser')) {
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Update UI with user name
            userName.textContent = currentUser.name;
            
            // Hide login, show dashboard
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            
            // Initialize dashboard
            initializeDashboard();
        }
    } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('currentUser');
    }
}

});