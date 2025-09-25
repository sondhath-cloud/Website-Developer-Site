// ResultsMode App Demo - JavaScript
class ResultsModeApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.teamMembers = [];
        this.departments = [];
        this.roles = [];
        this.stakeholders = [];
        this.connections = [];
        this.impacts = [];
        this.plans = [];
        this.ideas = [];
        this.jobAids = [];
        this.training = [];
        this.currentSort = { column: null, direction: 'asc' };
        this.csvUploaded = { departments: true, roles: true }; // Set to true for sample data
        this.deletedMembers = []; // For undo functionality
        this.currentPlanningImpact = null; // Track which impact is being planned
        this.currentActivities = []; // Track activities being planned
        this.currentScheduleView = 'calendar'; // Track current schedule view
        this.currentCalendarDate = new Date(); // Track current calendar month
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        // Use sample data only for now (database loading disabled)
        console.log('Loading sample data...');
        this.loadSampleData();
        
        this.updateDashboard();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.navigateToSection(section);
            });
        });

        // Modal forms
        document.getElementById('departmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDepartment();
        });

        // Remove this - memberForm no longer exists

        document.getElementById('csvForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.importMultipleCSV();
        });

        // Add file selection preview
        document.getElementById('csvFiles').addEventListener('change', (e) => {
            this.previewSelectedFiles(e.target.files);
        });

        document.getElementById('teamMemberForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTeamMemberFromForm();
        });

        document.getElementById('connectionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addConnectionFromForm();
        });

        document.getElementById('impactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addImpactFromForm();
        });

        document.getElementById('planForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPlanFromForm();
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    navigateToSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;
        this.updateSectionData();
    }

    updateSectionData() {
        switch (this.currentSection) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'team-directory':
                this.updateTeamDirectory();
                break;
            case 'stakeholder-analysis':
                this.updateStakeholderAnalysis();
                break;
            case 'connection-opportunities':
                this.updateConnectionOpportunities();
                this.setupSortableHeaders('connections-table');
                break;
            case 'change-impacts':
                this.updateChangeImpacts();
                this.setupSortableHeaders('impacts-table');
                break;
            case 'planning':
                this.updatePlanning();
                this.setupSortableHeaders('plans-table');
                break;
            case 'schedule':
                this.updateSchedule();
                break;
            case 'ideas-board':
                this.updateIdeasBoard();
                break;
            case 'job-aids':
                this.updateJobAids();
                break;
            case 'training':
                this.updateTraining();
                break;
            case 'admin-dashboard':
                this.updateAdminDashboard();
                break;
        }
    }

    // DISABLED: Database loading function (using sample data only for now)
    async loadDataFromDatabase() {
        // Function disabled - using sample data only
        return;
        
        try {
            console.log('Loading data from database...');
            
            // Load departments
            const departmentsResponse = await fetch('./api.php/departments');
            if (!departmentsResponse.ok) throw new Error('Failed to load departments');
            const departmentsData = await departmentsResponse.json();
            this.departments = departmentsData.map(dept => dept.name);

            // Load team members
            const membersResponse = await fetch('./api.php/members');
            if (!membersResponse.ok) throw new Error('Failed to load members');
            const membersData = await membersResponse.json();
            this.teamMembers = membersData;

            // Load stakeholders
            const stakeholdersResponse = await fetch('./api.php/stakeholders');
            if (!stakeholdersResponse.ok) throw new Error('Failed to load stakeholders');
            const stakeholdersData = await stakeholdersResponse.json();
            this.stakeholders = stakeholdersData;

            // Load connections
            const connectionsResponse = await fetch('./api.php/connections');
            if (!connectionsResponse.ok) throw new Error('Failed to load connections');
            const connectionsData = await connectionsResponse.json();
            this.connections = connectionsData;

            // Load impacts
            const impactsResponse = await fetch('./api.php/impacts');
            if (!impactsResponse.ok) throw new Error('Failed to load impacts');
            const impactsData = await impactsResponse.json();
            this.impacts = impactsData;

            // Load plans
            const plansResponse = await fetch('./api.php/plans');
            if (!plansResponse.ok) throw new Error('Failed to load plans');
            const plansData = await plansResponse.json();
            this.plans = plansData;

            // Load ideas
            const ideasResponse = await fetch('./api.php/ideas');
            if (!ideasResponse.ok) throw new Error('Failed to load ideas');
            const ideasData = await ideasResponse.json();
            this.ideas = ideasData;

            // Load job aids
            const jobAidsResponse = await fetch('./api.php/job-aids');
            if (!jobAidsResponse.ok) throw new Error('Failed to load job aids');
            const jobAidsData = await jobAidsResponse.json();
            this.jobAids = jobAidsData;

            // Load training
            const trainingResponse = await fetch('./api.php/training');
            if (!trainingResponse.ok) throw new Error('Failed to load training');
            const trainingData = await trainingResponse.json();
            this.training = trainingData;

            // Set up roles (these are predefined)
            this.roles = [
                'Manager',
                'Team Lead',
                'Specialist',
                'Analyst',
                'Coordinator',
                'Director',
                'Supervisor'
            ];

            console.log('Data loaded successfully from database');
            console.log('Departments:', this.departments);
            console.log('Team Members:', this.teamMembers.length);
            
        } catch (error) {
            console.error('Error loading data from database:', error);
            this.showToast('Error loading data from database. Using sample data.', 'error');
            this.loadSampleData();
        }
    }

    loadSampleData() {
        // Sample departments with common variations for fuzzy matching
        this.departments = [
            'Marketing',
            'Sales', 
            'Engineering',
            'Human Resources',
            'Finance',
            'Operations',
            'Customer Service',
            'Legal',
            'IT Support',
            'Research and Development',
            'Public Works',
            'Information Technology',
            'Administration',
            'Procurement',
            'Accounting',
            'Development',
            'Legal Department',
            'Sales Department'
        ];

        // Sample roles
        this.roles = [
            'Manager',
            'Team Lead',
            'Specialist',
            'Analyst',
            'Coordinator',
            'Director',
            'Supervisor'
        ];

        // Sample team members
        this.teamMembers = [
            { id: 1, name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '(555) 123-4567', department: 'Marketing', role: 'Manager' },
            { id: 2, name: 'Mike Chen', email: 'mike.c@company.com', phone: '(555) 234-5678', department: 'Marketing', role: 'Specialist' },
            { id: 3, name: 'Emily Davis', email: 'emily.d@company.com', phone: '(555) 345-6789', department: 'Marketing', role: 'Analyst' },
            { id: 4, name: 'David Wilson', email: 'david.w@company.com', phone: '(555) 456-7890', department: 'Sales', role: 'Team Lead' },
            { id: 5, name: 'Lisa Brown', email: 'lisa.b@company.com', phone: '(555) 567-8901', department: 'Sales', role: 'Specialist' },
            { id: 6, name: 'Alex Rodriguez', email: 'alex.r@company.com', phone: '(555) 678-9012', department: 'Engineering', role: 'Manager' },
            { id: 7, name: 'Jessica Lee', email: 'jessica.l@company.com', phone: '(555) 789-0123', department: 'Engineering', role: 'Team Lead' },
            { id: 8, name: 'Tom Anderson', email: 'tom.a@company.com', phone: '(555) 890-1234', department: 'Engineering', role: 'Specialist' },
            { id: 9, name: 'Maria Garcia', email: 'maria.g@company.com', phone: '(555) 901-2345', department: 'Human Resources', role: 'Manager' },
            { id: 10, name: 'John Smith', email: 'john.s@company.com', phone: '(555) 012-3456', department: 'Finance', role: 'Manager' },
            { id: 11, name: 'Amy Taylor', email: 'amy.t@company.com', phone: '(555) 123-4567', department: 'Finance', role: 'Analyst' }
        ];

        // Sample stakeholders (cleared for new structure)
        this.stakeholders = [];

        // Sample connections
        this.connections = [
            { id: 1, opportunity: 'Partnership Discussion', audience: 'Marketing', frequency: 'Monthly', nextDate: '2024-02-15', connector: 'Sarah Johnson', emailSent: false },
            { id: 2, opportunity: 'Technology Collaboration', audience: 'Engineering', frequency: 'Quarterly', nextDate: '2024-03-01', connector: 'Alex Rodriguez', emailSent: true },
            { id: 3, opportunity: 'Sales Opportunity', audience: 'Sales', frequency: 'Weekly', nextDate: '2024-01-30', connector: 'David Wilson', emailSent: false }
        ];

        // Sample impacts
        this.impacts = [
            { id: 'CI001', audience: 'Marketing', currentState: 'Manual email campaigns using basic tools', futureState: 'Automated marketing platform with AI-driven personalization', effort: 4, disruption: 3, stage: 'Not Reviewed' },
            { id: 'CI002', audience: 'Sales', currentState: 'Paper-based sales reports and manual tracking', futureState: 'Digital CRM system with real-time analytics', effort: 3, disruption: 2, stage: 'Planning' },
            { id: 'CI003', audience: 'Engineering', currentState: 'Waterfall development process', futureState: 'Agile methodology with continuous integration', effort: 5, disruption: 5, stage: 'Reviewed No Plan' }
        ];

        // Sample plans
        this.plans = [
            { id: 1, ciNumber: 'CI001', activityIdeas: 'Implement automated marketing platform training', effortScore: 3, impactScore: 4, targetDate: '2024-02-15', invitee: 'Sarah Johnson', invitationSent: false, ciId: 'CI001', addedToActionPlan: false },
            { id: 2, ciNumber: 'CI002', activityIdeas: 'CRM system rollout and user adoption', effortScore: 2, impactScore: 3, targetDate: '2024-03-01', invitee: 'David Wilson', invitationSent: true, ciId: 'CI002', addedToActionPlan: true },
            { id: 3, ciNumber: 'CI003', activityIdeas: 'Agile methodology implementation', effortScore: 4, impactScore: 5, targetDate: '2024-03-15', invitee: 'Alex Rodriguez', invitationSent: false, ciId: 'CI003', addedToActionPlan: false }
        ];

        // Sample ideas
        this.ideas = [
            { id: 1, title: 'AI-Powered Analytics Dashboard', category: 'Technology', status: 'Under Review', submittedBy: 'Alex Rodriguez', priority: 'High' },
            { id: 2, title: 'Remote Work Optimization', category: 'Process', status: 'Approved', submittedBy: 'Maria Garcia', priority: 'Medium' },
            { id: 3, title: 'Customer Feedback System', category: 'Product', status: 'Planning', submittedBy: 'Sarah Johnson', priority: 'High' }
        ];

        // Sample job aids
        this.jobAids = [
            { id: 1, title: 'Sales Process Guide', category: 'Sales', type: 'PDF', department: 'Sales', lastUpdated: '2024-01-15' },
            { id: 2, title: 'Marketing Checklist', category: 'Marketing', type: 'Checklist', department: 'Marketing', lastUpdated: '2024-01-10' },
            { id: 3, title: 'HR Onboarding Manual', category: 'HR', type: 'Manual', department: 'Human Resources', lastUpdated: '2024-01-20' }
        ];

        // Sample training
        this.training = [
            { id: 1, name: 'Leadership Development', type: 'Workshop', duration: '2 days', targetAudience: 'Managers', status: 'Active' },
            { id: 2, name: 'Technical Skills Training', type: 'Online', duration: '4 weeks', targetAudience: 'Engineers', status: 'Planning' },
            { id: 3, name: 'Sales Excellence Program', type: 'Certification', duration: '6 months', targetAudience: 'Sales Team', status: 'Active' }
        ];
    }

    updateDashboard() {
        const totalDepartments = this.departments.length;
        const totalMembers = this.teamMembers.length;
        const coverage = Math.round((totalMembers / (totalDepartments * 3)) * 100) || 0; // Assuming 3 members per dept is 100%

        document.getElementById('total-departments').textContent = totalDepartments;
        document.getElementById('total-members').textContent = totalMembers;
        document.getElementById('coverage').textContent = coverage + '%';
    }

    updateTeamDirectory() {
        this.updateCSVStatus();
        this.updateTeamTable();
        this.setupSortableHeaders();
        this.updateDepartmentSelects();
    }

    updateCSVStatus() {
        const csvStatus = document.getElementById('csv-status');
        const teamManagement = document.getElementById('team-management');
        const summaryTiles = document.getElementById('summary-tiles');
        const departmentsStatus = document.getElementById('departments-status');
        const rolesStatus = document.getElementById('roles-status');

        // Update status indicators
        departmentsStatus.className = `status-dot ${this.csvUploaded.departments ? 'green' : 'red'}`;
        rolesStatus.className = `status-dot ${this.csvUploaded.roles ? 'green' : 'red'}`;

        // Show/hide sections based on CSV upload status
        if (this.csvUploaded.departments || this.csvUploaded.roles) {
            csvStatus.style.display = 'block';
        } else {
            csvStatus.style.display = 'none';
        }

        if (this.csvUploaded.departments && this.csvUploaded.roles) {
            teamManagement.style.display = 'block';
            summaryTiles.style.display = 'grid';
            this.updateSummaryTiles();
        } else {
            teamManagement.style.display = 'none';
            summaryTiles.style.display = 'none';
        }
    }

    updateSummaryTiles() {
        console.log('updateSummaryTiles called, teamMembers:', this.teamMembers);
        
        // Calculate total departments (unique department names)
        const uniqueDepartments = [...new Set(this.teamMembers.map(member => member.department))];
        const totalDepartments = uniqueDepartments.length;
        console.log('uniqueDepartments:', uniqueDepartments, 'totalDepartments:', totalDepartments);

        // Calculate total team members (members with names)
        const totalMembers = this.teamMembers.filter(member => member.name && member.name.trim() !== '').length;
        console.log('totalMembers:', totalMembers);

        // Calculate empty departments (departments with no named members)
        const emptyDepartments = uniqueDepartments.filter(dept => 
            !this.teamMembers.some(member => member.department === dept && member.name && member.name.trim() !== '')
        ).length;
        console.log('emptyDepartments:', emptyDepartments);

        // Update tile numbers
        document.getElementById('team-total-departments').textContent = totalDepartments;
        document.getElementById('team-total-members').textContent = totalMembers;
        document.getElementById('team-empty-departments').textContent = emptyDepartments;
        
        console.log('Summary tiles updated:', { totalDepartments, totalMembers, emptyDepartments });
    }

    updateTeamTable() {
        const tbody = document.getElementById('team-tbody');
        tbody.innerHTML = '';

        this.teamMembers.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="editable-cell" data-field="department" data-id="${member.id}">
                    <select class="editable-select" onchange="app.updateCell(${member.id}, 'department', this.value)">
                        ${this.departments.map(dept => 
                            `<option value="${dept}" ${dept === member.department ? 'selected' : ''}>${dept}</option>`
                        ).join('')}
                    </select>
                </td>
                <td class="editable-cell" data-field="name" data-id="${member.id}" onclick="app.editCell(${member.id}, 'name', this)">
                    ${member.name || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="role" data-id="${member.id}">
                    <select class="editable-select" onchange="app.updateCell(${member.id}, 'role', this.value)">
                        ${this.roles.map(role => 
                            `<option value="${role}" ${role === member.role ? 'selected' : ''}>${role}</option>`
                        ).join('')}
                    </select>
                </td>
                <td class="editable-cell" data-field="email" data-id="${member.id}" onclick="app.editCell(${member.id}, 'email', this)">
                    ${member.email || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="phone" data-id="${member.id}" onclick="app.editCell(${member.id}, 'phone', this)">
                    ${member.phone || 'Click to edit'}
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline" onclick="app.deleteTeamMember(${member.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Update summary tiles after table update
        this.updateSummaryTiles();
    }

    setupSortableHeaders(tableId = null) {
        const selector = tableId ? `#${tableId} .sortable` : '.sortable';
        const headers = document.querySelectorAll(selector);
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sortTable(column, tableId);
            });
        });
    }

    sortTable(column, tableId = null) {
        // Update sort direction
        if (this.currentSort.column === column) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.column = column;
            this.currentSort.direction = 'asc';
        }

        // Determine which data array to sort based on table ID
        let dataArray;
        let updateFunction;
        
        if (tableId === 'connections-table') {
            dataArray = this.connections;
            updateFunction = () => this.updateConnectionOpportunities();
        } else if (tableId === 'impacts-table') {
            dataArray = this.impacts;
            updateFunction = () => this.updateChangeImpacts();
        } else if (tableId === 'plans-table') {
            dataArray = this.plans;
            updateFunction = () => this.updatePlanning();
        } else {
            dataArray = this.teamMembers;
            updateFunction = () => this.updateTeamTable();
        }

        // Sort the data
        dataArray.sort((a, b) => {
            let aVal = a[column] || '';
            let bVal = b[column] || '';
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (this.currentSort.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        // Update sort indicators
        const selector = tableId ? `#${tableId} .sortable` : '.sortable';
        document.querySelectorAll(selector).forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
        });
        
        const currentHeader = document.querySelector(`#${tableId || 'team-table'} [data-column="${column}"]`);
        if (currentHeader) {
            currentHeader.classList.add(`sort-${this.currentSort.direction}`);
        }

        // Refresh table
        updateFunction();
    }

    updateStakeholderAnalysis() {
        const tbody = document.getElementById('stakeholders-tbody');
        tbody.innerHTML = '';

        this.stakeholders.forEach(stakeholder => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stakeholder.name}</td>
                <td><span class="status-badge ${stakeholder.influence.toLowerCase()}">${stakeholder.influence}</span></td>
                <td><span class="status-badge ${stakeholder.interest.toLowerCase()}">${stakeholder.interest}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="editStakeholder('${stakeholder.name}')">Edit</button>
                    <button class="btn btn-sm btn-outline" onclick="deleteStakeholder('${stakeholder.name}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateConnectionOpportunities() {
        const tbody = document.getElementById('connections-tbody');
        tbody.innerHTML = '';

        this.connections.forEach(connection => {
            const row = document.createElement('tr');
            const emailSent = connection.emailSent || false;
            const emailButton = emailSent 
                ? '<span class="status-sent">Request sent!</span>' 
                : `<button class="btn btn-sm btn-outline" onclick="app.sendConnectionRequest(${connection.id})">Send request for info</button>`;
            
            row.innerHTML = `
                <td class="editable-cell" data-field="opportunity" data-id="${connection.id}" onclick="app.editCell(${connection.id}, 'opportunity', this)">
                    ${connection.opportunity || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="audience" data-id="${connection.id}" onclick="app.editCell(${connection.id}, 'audience', this)">
                    ${connection.audience || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="frequency" data-id="${connection.id}">
                    <select class="editable-select" onchange="app.updateCell(${connection.id}, 'frequency', this.value)">
                        <option value="Daily" ${connection.frequency === 'Daily' ? 'selected' : ''}>Daily</option>
                        <option value="Weekly" ${connection.frequency === 'Weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="Monthly" ${connection.frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
                        <option value="Quarterly" ${connection.frequency === 'Quarterly' ? 'selected' : ''}>Quarterly</option>
                        <option value="Annually" ${connection.frequency === 'Annually' ? 'selected' : ''}>Annually</option>
                        <option value="Periodic" ${connection.frequency === 'Periodic' ? 'selected' : ''}>Periodic</option>
                    </select>
                </td>
                <td class="editable-cell" data-field="nextDate" data-id="${connection.id}">
                    <input type="date" class="editable-date" value="${connection.nextDate || ''}" onchange="app.updateCell(${connection.id}, 'nextDate', this.value)">
                </td>
                <td class="editable-cell" data-field="connector" data-id="${connection.id}">
                    <select class="editable-select" onchange="app.updateCell(${connection.id}, 'connector', this.value)">
                        ${this.teamMembers.map(member => 
                            `<option value="${member.name}" ${member.name === connection.connector ? 'selected' : ''}>${member.name}</option>`
                        ).join('')}
                    </select>
                </td>
                <td class="email-cell">
                    ${emailButton}
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline" onclick="app.deleteConnection(${connection.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateChangeImpacts() {
        const tbody = document.getElementById('impacts-tbody');
        tbody.innerHTML = '';

        this.impacts.forEach(impact => {
            const scoreClass = this.getScoreClass(impact.effort, impact.disruption);
            const scoreLabel = this.getScoreLabel(impact.effort, impact.disruption);
            
            // Check if this CI has planned activities
            const hasPlannedActivities = this.plans.some(plan => plan.ciId === impact.id);
            const planningIndicator = hasPlannedActivities ? 
                '<span class="planning-indicator" title="Has planned activities">📋</span>' : '';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="editable-cell" data-field="id" data-id="${impact.id}">
                    ${impact.id} ${planningIndicator}
                </td>
                <td class="editable-cell" data-field="audience" data-id="${impact.id}" onclick="app.editCell(${impact.id}, 'audience', this)">
                    ${impact.audience || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="currentState" data-id="${impact.id}" onclick="app.editCell(${impact.id}, 'currentState', this)">
                    ${impact.currentState || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="futureState" data-id="${impact.id}" onclick="app.editCell(${impact.id}, 'futureState', this)">
                    ${impact.futureState || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="score" data-id="${impact.id}">
                    <span class="impact-score ${scoreClass}">${scoreLabel}</span>
                </td>
                <td class="editable-cell" data-field="stage" data-id="${impact.id}">
                    <select class="editable-select" onchange="app.updateCell(${impact.id}, 'stage', this.value)">
                        <option value="Not Reviewed" ${impact.stage === 'Not Reviewed' ? 'selected' : ''}>Not Reviewed</option>
                        <option value="Reviewed No Plan" ${impact.stage === 'Reviewed No Plan' ? 'selected' : ''}>Reviewed No Plan</option>
                        <option value="Planning" ${impact.stage === 'Planning' ? 'selected' : ''}>Planning</option>
                    </select>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline" onclick="app.deleteImpact(${impact.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updatePlanning() {
        const tbody = document.getElementById('plans-tbody');
        tbody.innerHTML = '';

        this.plans.forEach(plan => {
            const invitationSent = plan.invitationSent || false;
            const invitationButton = invitationSent 
                ? '<span class="status-sent">Invitation sent!</span>' 
                : `<button class="btn btn-sm btn-outline" onclick="app.sendPlanningInvitation(${plan.id})">Send invitation</button>`;
            
            // Get impact score from related change impact
            const relatedImpact = this.impacts.find(impact => impact.id === plan.ciId);
            const impactScore = relatedImpact ? 
                `<span class="impact-score ${this.getScoreClass(relatedImpact.effort, relatedImpact.disruption)}">${this.getScoreLabel(relatedImpact.effort, relatedImpact.disruption)}</span>` : 
                'N/A';
            
            // Format activity ideas (without scores since they're in separate columns now)
            const activityIdeasDisplay = plan.activityIdeas || 'No activity ideas';
            
            // Add to Action Plan button
            const actionPlanButton = plan.addedToActionPlan ? 
                '<span class="status-sent">Added to action plan</span>' :
                `<button class="btn btn-sm btn-primary" onclick="app.addToActionPlan(${plan.id})">Add to Action Plan</button>`;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="editable-cell" data-field="ciNumber" data-id="${plan.id}" onclick="app.editCell(${plan.id}, 'ciNumber', this)">
                    ${plan.ciNumber || 'Click to edit'}
                </td>
                <td class="editable-cell" data-field="activityIdeas" data-id="${plan.id}">
                    ${activityIdeasDisplay}
                </td>
                <td class="editable-cell" data-field="targetDate" data-id="${plan.id}">
                    <input type="date" class="editable-date" value="${plan.targetDate || ''}" onchange="app.updateCell(${plan.id}, 'targetDate', this.value)">
                </td>
                <td class="editable-cell" data-field="effortScore" data-id="${plan.id}">
                    <span class="activity-score effort-score">${plan.effortScore || 'N/A'}</span>
                </td>
                <td class="editable-cell" data-field="impactScore" data-id="${plan.id}">
                    <span class="activity-score impact-score">${plan.impactScore || 'N/A'}</span>
                </td>
                <td class="editable-cell" data-field="invitee" data-id="${plan.id}">
                    <select class="editable-select" onchange="app.updateCell(${plan.id}, 'invitee', this.value)">
                        <option value="">Select Team Member</option>
                        ${this.teamMembers.map(member => 
                            `<option value="${member.name}" ${member.name === plan.invitee ? 'selected' : ''}>${member.name}</option>`
                        ).join('')}
                    </select>
                </td>
                <td class="email-cell">
                    ${invitationButton}
                </td>
                <td>
                    <div class="table-actions">
                        ${actionPlanButton}
                        <button class="btn btn-outline" onclick="app.deletePlan(${plan.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateIdeasBoard() {
        const tbody = document.getElementById('ideas-tbody');
        tbody.innerHTML = '';

        this.ideas.forEach(idea => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${idea.title}</td>
                <td>${idea.category}</td>
                <td>${idea.status}</td>
                <td>${idea.submittedBy}</td>
                <td>${idea.priority}</td>
                <td>
                    <button class="btn btn-outline" onclick="app.editIdea(${idea.id})">Edit</button>
                    <button class="btn btn-outline" onclick="app.deleteIdea(${idea.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateJobAids() {
        const tbody = document.getElementById('job-aids-tbody');
        tbody.innerHTML = '';

        this.jobAids.forEach(jobAid => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${jobAid.title}</td>
                <td>${jobAid.category}</td>
                <td>${jobAid.type}</td>
                <td>${jobAid.department}</td>
                <td>${jobAid.lastUpdated}</td>
                <td>
                    <button class="btn btn-outline" onclick="app.editJobAid(${jobAid.id})">Edit</button>
                    <button class="btn btn-outline" onclick="app.deleteJobAid(${jobAid.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateTraining() {
        const tbody = document.getElementById('training-tbody');
        tbody.innerHTML = '';

        this.training.forEach(training => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${training.name}</td>
                <td>${training.type}</td>
                <td>${training.duration}</td>
                <td>${training.targetAudience}</td>
                <td>${training.status}</td>
                <td>
                    <button class="btn btn-outline" onclick="app.editTraining(${training.id})">Edit</button>
                    <button class="btn btn-outline" onclick="app.deleteTraining(${training.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateAdminDashboard() {
        // Admin dashboard is mostly static, but we could add dynamic content here
        console.log('Admin dashboard updated');
    }

    // Modal functions
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Update dropdowns when opening team member modal
        if (modalId === 'teamMemberModal') {
            this.updateDepartmentSelects();
        }
        
        // Update dropdowns when opening connection modal
        if (modalId === 'connectionModal') {
            this.updateConnectionDropdowns();
        }
        
        // Update dropdowns when opening impact modal
        if (modalId === 'impactModal') {
            this.updateImpactDropdowns();
        }
        
        // Update dropdowns when opening plan modal
        if (modalId === 'planModal') {
            this.updatePlanDropdowns();
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.querySelector(`#${modalId} form`);
        if (form) {
            form.reset();
        }
    }

    // Update department selects in modals
    updateDepartmentSelects() {
        const memberDepartmentSelect = document.getElementById('memberDepartment');
        if (memberDepartmentSelect) {
            memberDepartmentSelect.innerHTML = '<option value="">Select Department/Agency</option>';
            this.departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                memberDepartmentSelect.appendChild(option);
            });
            // Add "Add New Department/Agency" option
            const newOption = document.createElement('option');
            newOption.value = 'new';
            newOption.textContent = 'Add New Department/Agency';
            memberDepartmentSelect.appendChild(newOption);
        }

        const memberRoleSelect = document.getElementById('memberRole');
        if (memberRoleSelect) {
            memberRoleSelect.innerHTML = '<option value="">Select Role</option>';
            this.roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                memberRoleSelect.appendChild(option);
            });
        }
    }

    // Update connection modal dropdowns
    updateConnectionDropdowns() {
        // Update audience dropdown with departments and stakeholders
        const audienceSelect = document.getElementById('connectionAudience');
        if (audienceSelect) {
            audienceSelect.innerHTML = '<option value="">Select Audience</option>';
            
            // Add departments
            this.departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                audienceSelect.appendChild(option);
            });
            
            // Add stakeholders
            this.stakeholders.forEach(stakeholder => {
                const option = document.createElement('option');
                option.value = stakeholder.name;
                option.textContent = stakeholder.name;
                audienceSelect.appendChild(option);
            });
        }

        // Update connector dropdown with team members
        const connectorSelect = document.getElementById('connectionConnector');
        if (connectorSelect) {
            connectorSelect.innerHTML = '<option value="">Select Team Member</option>';
            this.teamMembers.forEach(member => {
                const option = document.createElement('option');
                option.value = member.name;
                option.textContent = member.name;
                connectorSelect.appendChild(option);
            });
        }
    }

    // Update impact modal dropdowns
    updateImpactDropdowns() {
        // Update audience dropdown with departments and stakeholders
        const audienceSelect = document.getElementById('impactAudience');
        if (audienceSelect) {
            audienceSelect.innerHTML = '<option value="">Select Audience</option>';
            
            // Add departments
            this.departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                audienceSelect.appendChild(option);
            });
            
            // Add stakeholders
            this.stakeholders.forEach(stakeholder => {
                const option = document.createElement('option');
                option.value = stakeholder.name;
                option.textContent = stakeholder.name;
                audienceSelect.appendChild(option);
            });
        }
    }

    // Add impact assessment from form
    addImpactFromForm() {
        const formData = new FormData(document.getElementById('impactForm'));
        const audience = formData.get('audience');
        const currentState = formData.get('currentState');
        const futureState = formData.get('futureState');
        const effort = parseInt(formData.get('effort'));
        const disruption = parseInt(formData.get('disruption'));

        const newId = this.generateNextCIId();
        const newImpact = {
            id: newId,
            audience: audience,
            currentState: currentState,
            futureState: futureState,
            effort: effort,
            disruption: disruption,
            stage: 'Not Reviewed'
        };

        this.impacts.push(newImpact);
        this.updateChangeImpacts();
        
        // Add to Planning page
        this.addImpactToPlanning(newImpact);
        
        this.closeModal('impactModal');
        this.showToast('Impact assessment added successfully!', 'success');
    }

    // Add impact to Planning page
    addImpactToPlanning(impact) {
        const newPlanId = Math.max(...this.plans.map(p => p.id), 0) + 1;
        const newPlan = {
            id: newPlanId,
            name: `${impact.id}: ${impact.futureState.substring(0, 50)}${impact.futureState.length > 50 ? '...' : ''}`,
            type: 'Change Impact',
            status: 'Planning',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            ciId: impact.id,
            description: impact.futureState
        };
        
        this.plans.push(newPlan);
        // Update planning table if it's currently visible
        if (this.currentSection === 'planning') {
            this.updatePlanning();
        }
    }

    // Update plan modal dropdowns
    updatePlanDropdowns() {
        // Update CI Number dropdown with available change impacts
        const ciSelect = document.getElementById('planCINumber');
        if (ciSelect) {
            ciSelect.innerHTML = '<option value="">Select CI Number</option>';
            
            // Add available change impacts
            this.impacts.forEach(impact => {
                const option = document.createElement('option');
                option.value = impact.id;
                option.textContent = `${impact.id} - ${impact.audience}`;
                ciSelect.appendChild(option);
            });
        }

        // Update invitee dropdown with team members
        const inviteeSelect = document.getElementById('planInvitee');
        if (inviteeSelect) {
            inviteeSelect.innerHTML = '<option value="">Select Team Member</option>';
            this.teamMembers.forEach(member => {
                const option = document.createElement('option');
                option.value = member.name;
                option.textContent = member.name;
                inviteeSelect.appendChild(option);
            });
        }
    }

    // Add plan from form
    addPlanFromForm() {
        const formData = new FormData(document.getElementById('planForm'));
        const ciNumber = formData.get('ciNumber');
        const description = formData.get('description');
        const targetDate = formData.get('targetDate');
        const invitee = formData.get('invitee');

        const newId = Math.max(...this.plans.map(p => p.id), 0) + 1;
        const newPlan = {
            id: newId,
            ciNumber: ciNumber,
            description: description,
            targetDate: targetDate,
            invitee: invitee,
            invitationSent: false,
            ciId: ciNumber
        };

        this.plans.push(newPlan);
        this.updatePlanning();
        this.closeModal('planModal');
        this.showToast('Planned activity added successfully!', 'success');
    }

    // Send planning invitation
    sendPlanningInvitation(id) {
        const plan = this.plans.find(p => p.id === id);
        if (!plan) return;

        const invitee = this.teamMembers.find(m => m.name === plan.invitee);
        if (!invitee) {
            this.showToast('Invitee not found!', 'error');
            return;
        }

        // Simulate sending invitation
        plan.invitationSent = true;
        this.updatePlanning();
        
        // In a real application, this would trigger an actual email
        const emailSubject = `Planning Invitation: ${plan.ciNumber} - ${plan.description}`;
        const emailBody = `Hi ${invitee.name},\n\nYou have been invited to participate in a planned activity:\n\nCI Number: ${plan.ciNumber}\nActivity: ${plan.description}\nTarget Date: ${plan.targetDate}\n\nPlease confirm your availability and participation.\n\nBest regards,\nResultsMode App`;
        
        // Show success message
        this.showToast(`Invitation sent to ${invitee.name} (${invitee.email})`, 'success');
    }

    // Score calculation methods for impact assessments
    getScoreLabel(effort, disruption) {
        if (effort <= 2 && disruption <= 2) {
            return 'Smooth Sailing';
        } else if (effort >= 4 && disruption <= 2) {
            return 'Steep Learning Curve';
        } else if (effort <= 2 && disruption >= 4) {
            return 'Sticker Shock';
        } else if (effort >= 4 && disruption >= 4) {
            return 'Transformational Overhaul';
        } else {
            // Handle middle cases (effort 3 or disruption 3)
            if (effort >= 3 && disruption >= 3) {
                return 'Transformational Overhaul';
            } else if (effort >= 3) {
                return 'Steep Learning Curve';
            } else if (disruption >= 3) {
                return 'Sticker Shock';
            } else {
                return 'Smooth Sailing';
            }
        }
    }

    getScoreClass(effort, disruption) {
        if (effort <= 2 && disruption <= 2) {
            return 'smooth-sailing';
        } else if (effort >= 4 && disruption <= 2) {
            return 'steep-learning';
        } else if (effort <= 2 && disruption >= 4) {
            return 'sticker-shock';
        } else if (effort >= 4 && disruption >= 4) {
            return 'transformational';
        } else {
            // Handle middle cases
            if (effort >= 3 && disruption >= 3) {
                return 'transformational';
            } else if (effort >= 3) {
                return 'steep-learning';
            } else if (disruption >= 3) {
                return 'sticker-shock';
            } else {
                return 'smooth-sailing';
            }
        }
    }

    // Generate next CI ID
    generateNextCIId() {
        const maxId = Math.max(...this.impacts.map(impact => {
            const match = impact.id.match(/CI(\d+)/);
            return match ? parseInt(match[1]) : 0;
        }), 0);
        return `CI${String(maxId + 1).padStart(3, '0')}`;
    }

    // Fuzzy matching function for department/agency names
    fuzzyMatchDepartment(input, threshold = 0.6) {
        const inputLower = input.toLowerCase().trim();
        
        // Direct match first
        for (const dept of this.departments) {
            if (dept.toLowerCase() === inputLower) {
                return { match: dept, confidence: 1.0 };
            }
        }
        
        // Common abbreviations mapping
        const abbreviations = {
            'hr': 'Human Resources',
            'it': 'Information Technology',
            'pw': 'Public Works',
            'p.w.': 'Public Works',
            'p.w': 'Public Works',
            'pw.': 'Public Works',
            'fin': 'Finance',
            'mkt': 'Marketing',
            'mkting': 'Marketing',
            'eng': 'Engineering',
            'engr': 'Engineering',
            'ops': 'Operations',
            'admin': 'Administration',
            'legal': 'Legal Department',
            'proc': 'Procurement',
            'acct': 'Accounting',
            'sales': 'Sales Department',
            'cust': 'Customer Service',
            'cs': 'Customer Service',
            'dev': 'Development',
            'r&d': 'Research and Development',
            'rd': 'Research and Development'
        };
        
        // Check abbreviations
        if (abbreviations[inputLower]) {
            const fullName = abbreviations[inputLower];
            if (this.departments.includes(fullName)) {
                return { match: fullName, confidence: 0.95 };
            }
        }
        
        // Fuzzy string matching using Levenshtein distance
        let bestMatch = null;
        let bestScore = 0;
        
        for (const dept of this.departments) {
            const score = this.calculateSimilarity(inputLower, dept.toLowerCase());
            if (score > bestScore && score >= threshold) {
                bestScore = score;
                bestMatch = dept;
            }
        }
        
        return bestMatch ? { match: bestMatch, confidence: bestScore } : null;
    }
    
    // Calculate similarity between two strings using Levenshtein distance
    calculateSimilarity(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;
        
        // Initialize matrix
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }
        
        // Fill matrix
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,      // deletion
                    matrix[i][j - 1] + 1,      // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }
        
        const maxLen = Math.max(len1, len2);
        return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
    }

    // Add team member from form with smart matching
    addTeamMemberFromForm() {
        const formData = new FormData(document.getElementById('teamMemberForm'));
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        let department = formData.get('department');
        const role = formData.get('role');

        // Handle new department with fuzzy matching
        if (department === 'new') {
            const newDepartment = document.getElementById('newDepartment').value.trim();
            if (!newDepartment) {
                this.showToast('Please enter a new department/agency name', 'error');
                return;
            }
            
            // Try fuzzy matching first
            const fuzzyMatch = this.fuzzyMatchDepartment(newDepartment);
            if (fuzzyMatch && fuzzyMatch.confidence > 0.7) {
                // Ask user to confirm fuzzy match
                const confirmed = confirm(`Did you mean "${fuzzyMatch.match}"? (Confidence: ${Math.round(fuzzyMatch.confidence * 100)}%)`);
                if (confirmed) {
                    department = fuzzyMatch.match;
                } else {
                    // Add as new department
                    if (!this.departments.includes(newDepartment)) {
                        this.departments.push(newDepartment);
                    }
                    department = newDepartment;
                }
            } else {
                // Add as new department
                if (!this.departments.includes(newDepartment)) {
                    this.departments.push(newDepartment);
                }
                department = newDepartment;
            }
        }

        // Smart matching logic - find empty department row first
        const emptyRow = this.teamMembers.find(member => 
            member.department === department && (!member.name || member.name.trim() === '')
        );

        if (emptyRow) {
            // Update existing empty row
            emptyRow.name = name;
            emptyRow.email = email;
            emptyRow.phone = phone;
            emptyRow.role = role;
            this.showToast('Team member added to existing department row!', 'success');
        } else {
            // Add new row (department already has members, so add another row)
            const newId = Math.max(...this.teamMembers.map(m => m.id), 0) + 1;
            const newMember = {
                id: newId,
                name: name,
                email: email,
                phone: phone,
                department: department,
                role: role
            };
            this.teamMembers.push(newMember);
            this.showToast('New team member row added to department!', 'success');
        }

        this.updateTeamTable();
        this.updateDashboard();
        this.closeModal('teamMemberModal');
    }

    // Add connection from form
    addConnectionFromForm() {
        const formData = new FormData(document.getElementById('connectionForm'));
        const opportunity = formData.get('opportunity');
        const audience = formData.get('audience');
        const frequency = formData.get('frequency');
        const nextDate = formData.get('nextDate');
        const connector = formData.get('connector');

        const newId = Math.max(...this.connections.map(c => c.id), 0) + 1;
        const newConnection = {
            id: newId,
            opportunity: opportunity,
            audience: audience,
            frequency: frequency,
            nextDate: nextDate,
            connector: connector,
            emailSent: false
        };

        this.connections.push(newConnection);
        this.updateConnectionOpportunities();
        this.closeModal('connectionModal');
        this.showToast('Connection opportunity added successfully!', 'success');
    }

    // Send connection request email
    sendConnectionRequest(id) {
        const connection = this.connections.find(c => c.id === id);
        if (!connection) return;

        const connector = this.teamMembers.find(m => m.name === connection.connector);
        if (!connector) {
            this.showToast('Connector not found!', 'error');
            return;
        }

        // Simulate sending email
        connection.emailSent = true;
        this.updateConnectionOpportunities();
        
        // In a real application, this would trigger an actual email
        const emailSubject = `Connection Opportunity: ${connection.opportunity}`;
        const emailBody = `Hi ${connector.name},\n\nYou have a connection opportunity with ${connection.audience}:\n\nOpportunity: ${connection.opportunity}\nFrequency: ${connection.frequency}\nNext Date: ${connection.nextDate}\n\nPlease follow up on this opportunity.\n\nBest regards,\nResultsMode App`;
        
        // Create mailto link (in a real app, this would be handled server-side)
        const mailtoLink = `mailto:${connector.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Show success message
        this.showToast(`Email request sent to ${connector.name} (${connector.email})`, 'success');
        
        // In a real application, you might want to open the email client
        // window.open(mailtoLink, '_blank');
    }

    // Delete team member with undo functionality
    deleteTeamMember(id) {
        const member = this.teamMembers.find(m => m.id === id);
        if (!member) return;

        // Store for undo
        this.deletedMembers.push({ ...member, deletedAt: Date.now() });

        // Remove from active list
        this.teamMembers = this.teamMembers.filter(m => m.id !== id);

        // Update the delete button to show undo
        const deleteButton = event.target;
        deleteButton.textContent = 'Undo';
        deleteButton.onclick = () => this.undoDelete(id);
        deleteButton.classList.remove('btn-outline');
        deleteButton.classList.add('btn-secondary');

        this.updateTeamTable();
        this.updateDashboard();
        this.showToast('Team member deleted. Click Undo to restore.', 'warning');
    }

    // Undo delete functionality
    undoDelete(id) {
        const deletedMember = this.deletedMembers.find(m => m.id === id);
        if (deletedMember) {
            // Restore the member
            this.teamMembers.push(deletedMember);
            
            // Remove from deleted list
            this.deletedMembers = this.deletedMembers.filter(m => m.id !== id);
            
            this.updateTeamTable();
            this.updateDashboard();
            this.showToast('Team member restored!', 'success');
        }
    }

    // Inline editing functions
    editCell(id, field, element) {
        console.log('editCell called with:', { id, field, element });
        console.log('Current connections:', this.connections);
        
        // Convert id to number for comparison
        const numericId = parseInt(id);
        console.log('Looking for numeric ID:', numericId);
        
        // Try to find the item in different arrays
        let item = this.teamMembers.find(m => m.id === numericId);
        if (!item) {
            item = this.connections.find(c => c.id === numericId);
            console.log('Found in connections:', item);
        }
        if (!item) {
            item = this.impacts.find(i => i.id === numericId);
        }
        if (!item) {
            item = this.plans.find(p => p.id === numericId);
        }
        
        if (!item) {
            console.log('Item not found for id:', numericId);
            return;
        }

        const currentValue = item[field] || '';
        console.log('Current value for field', field, ':', currentValue);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.className = 'editable-input';
        
        element.innerHTML = '';
        element.appendChild(input);
        element.classList.add('editing');
        
        input.focus();
        input.select();
        
        const saveEdit = () => {
            const newValue = input.value.trim();
            this.updateCell(numericId, field, newValue);
            element.classList.remove('editing');
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }

    updateCell(id, field, value) {
        // Handle team members
        const member = this.teamMembers.find(m => m.id === id);
        if (member) {
            member[field] = value;
            this.updateTeamTable();
            this.updateDashboard();
            return;
        }
        
        // Handle connections
        const connection = this.connections.find(c => c.id === id);
        if (connection) {
            connection[field] = value;
            this.updateConnectionOpportunities();
            return;
        }
        
        // Handle impacts
        const impact = this.impacts.find(i => i.id === id);
        if (impact) {
            impact[field] = value;
            
            // Special handling for stage changes
            if (field === 'stage' && value === 'Planning') {
                this.startPlanningWorkflow(impact);
            }
            
            this.updateChangeImpacts();
            return;
        }
        
        // Handle plans
        const plan = this.plans.find(p => p.id === id);
        if (plan) {
            plan[field] = value;
            this.updatePlanning();
            return;
        }
    }

    addNewRow() {
        const newId = Math.max(...this.teamMembers.map(m => m.id), 0) + 1;
        const newMember = {
            id: newId,
            name: '',
            email: '',
            department: this.departments[0] || '',
            role: this.roles[0] || ''
        };
        
        this.teamMembers.push(newMember);
        this.updateTeamTable();
        this.updateDashboard();
        this.showToast('New team member added!', 'success');
    }

    deleteTeamMember(id) {
        if (confirm('Are you sure you want to delete this team member?')) {
            this.teamMembers = this.teamMembers.filter(m => m.id !== id);
            this.updateTeamTable();
            this.updateDashboard();
            this.showToast('Team member deleted successfully!', 'success');
        }
    }

    // CSV Template Download
    downloadTemplate(type) {
        let csvContent = '';
        let filename = '';
        
        if (type === 'departments') {
            csvContent = 'Department/Agency,Name,Role,Email,Phone\nMarketing,,,,\nSales,,,,\nEngineering,,,,\nHuman Resources,,,,\nFinance,,,';
            filename = 'departments_template.csv';
        } else if (type === 'roles') {
            csvContent = 'Role\nManager\nTeam Lead\nSpecialist\nAnalyst\nCoordinator\nDirector\nSupervisor';
            filename = 'roles_template.csv';
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast(`${type} template downloaded!`, 'success');
    }

    // CSV Import
    importCSV() {
        const csvType = document.getElementById('csvType').value;
        const fileInput = document.getElementById('csvFile');
        const file = fileInput.files[0];
        
        if (!csvType) {
            this.showToast('Please select an import type', 'error');
            return;
        }
        
        if (!file) {
            this.showToast('Please select a CSV file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const lines = csv.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                this.showToast('CSV file must have at least a header and one data row', 'error');
                return;
            }
            
            const headers = lines[0].split(',').map(h => h.trim());
            
            if (csvType === 'departments') {
                this.importDepartments(lines, headers);
            } else if (csvType === 'roles') {
                this.importRoles(lines, headers);
            }
        };
        
        reader.readAsText(file);
    }

    previewSelectedFiles(files) {
        const filePreview = document.getElementById('filePreview');
        const fileList = document.getElementById('fileList');
        
        if (files.length === 0) {
            filePreview.style.display = 'none';
            return;
        }
        
        fileList.innerHTML = '';
        
        Array.from(files).forEach(file => {
            const fileType = this.detectFileType(file.name);
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span class="file-name">${file.name}</span>
                <span class="file-type ${fileType}">${fileType}</span>
            `;
            fileList.appendChild(fileItem);
        });
        
        filePreview.style.display = 'block';
    }

    detectFileType(filename) {
        const name = filename.toLowerCase();
        if (name.includes('department') || name.includes('dept') || name.includes('agency')) {
            return 'departments';
        } else if (name.includes('role')) {
            return 'roles';
        } else {
            return 'unknown';
        }
    }

    importMultipleCSV() {
        const fileInput = document.getElementById('csvFiles');
        const files = fileInput.files;
        
        if (files.length === 0) {
            this.showToast('Please select CSV files', 'error');
            return;
        }
        
        let processedFiles = 0;
        let totalFiles = files.length;
        
        Array.from(files).forEach(file => {
            const fileType = this.detectFileType(file.name);
            
            if (fileType === 'unknown') {
                this.showToast(`Could not determine type for ${file.name}. Please name your files with 'department' or 'role' in the filename.`, 'warning');
                processedFiles++;
                if (processedFiles === totalFiles) {
                    this.checkImportComplete();
                }
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                const lines = csv.split('\n').filter(line => line.trim());
                
                if (lines.length < 2) {
                    this.showToast(`${file.name}: CSV file must have at least a header and one data row`, 'error');
                    processedFiles++;
                    if (processedFiles === totalFiles) {
                        this.checkImportComplete();
                    }
                    return;
                }
                
                const headers = lines[0].split(',').map(h => h.trim());
                
                if (fileType === 'departments') {
                    this.importDepartments(lines, headers, file.name);
                } else if (fileType === 'roles') {
                    this.importRoles(lines, headers, file.name);
                }
                
                processedFiles++;
                if (processedFiles === totalFiles) {
                    this.checkImportComplete();
                }
            };
            
            reader.readAsText(file);
        });
    }

    checkImportComplete() {
        // Close modal and show success message
        this.closeModal('csvModal');
        
        if (this.csvUploaded.departments && this.csvUploaded.roles) {
            this.showToast('All CSV files imported successfully!', 'success');
        } else {
            this.showToast('CSV files processed. Upload both departments and roles files to see the full interface.', 'info');
        }
    }

    importDepartments(lines, headers, filename = '') {
        if (!headers.includes('Department/Agency')) {
            this.showToast('CSV must have "Department/Agency" header', 'error');
            return;
        }
        
        const deptIndex = headers.indexOf('Department/Agency');
        const nameIndex = headers.indexOf('Name');
        const roleIndex = headers.indexOf('Role');
        const emailIndex = headers.indexOf('Email');
        const phoneIndex = headers.indexOf('Phone');
        
        let addedCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const deptName = values[deptIndex];
            
            if (deptName) {
                // Add to departments array if not already there
                if (!this.departments.includes(deptName)) {
                    this.departments.push(deptName);
                }
                
                // Create team member entry (even if name is empty)
                const newId = Math.max(...this.teamMembers.map(m => m.id), 0) + 1;
                const newMember = {
                    id: newId + i,
                    name: nameIndex >= 0 ? values[nameIndex] || '' : '',
                    email: emailIndex >= 0 ? values[emailIndex] || '' : '',
                    phone: phoneIndex >= 0 ? values[phoneIndex] || '' : '',
                    department: deptName,
                    role: roleIndex >= 0 ? values[roleIndex] || '' : ''
                };
                
                this.teamMembers.push(newMember);
                addedCount++;
            }
        }
        
        // Mark departments as uploaded
        this.csvUploaded.departments = true;
        
        this.updateTeamDirectory();
        this.closeModal('csvModal');
        const fileMsg = filename ? ` from ${filename}` : '';
        this.showToast(`${addedCount} departments imported successfully${fileMsg}!`, 'success');
    }

    importRoles(lines, headers, filename = '') {
        if (!headers.includes('Role')) {
            this.showToast('CSV must have "Role" header', 'error');
            return;
        }
        
        const roleIndex = headers.indexOf('Role');
        let addedCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const roleName = values[roleIndex];
            
            if (roleName && !this.roles.includes(roleName)) {
                this.roles.push(roleName);
                addedCount++;
            }
        }
        
        // Mark roles as uploaded
        this.csvUploaded.roles = true;
        
        this.updateTeamDirectory();
        this.closeModal('csvModal');
        const fileMsg = filename ? ` from ${filename}` : '';
        this.showToast(`${addedCount} roles imported successfully${fileMsg}!`, 'success');
    }

    // Data management functions
    addDepartment() {
        const name = document.getElementById('departmentName').value;
        if (!name) return;

        const newDept = {
            id: Date.now(),
            name: name,
            members: 0,
            coverage: 0
        };

        this.departments.push(newDept);
        this.updateTeamDirectory();
        this.updateDashboard();
        this.closeModal('departmentModal');
        this.showToast('Department added successfully!', 'success');
    }

    addMember() {
        const formData = new FormData(document.getElementById('memberForm'));
        const member = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            department: formData.get('department'),
            role: formData.get('role')
        };

        this.members.push(member);
        
        // Update department member count
        const dept = this.departments.find(d => d.name === member.department);
        if (dept) {
            dept.members++;
            dept.coverage = Math.min(100, dept.coverage + 20);
        }

        this.updateTeamDirectory();
        this.updateDashboard();
        this.closeModal('memberModal');
        this.showToast('Team member added successfully!', 'success');
    }


    // Edit functions (placeholder)
    editDepartment(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editMember(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editStakeholder(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editConnection(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editImpact(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editPlan(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editIdea(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editJobAid(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    editTraining(id) {
        this.showToast('Edit functionality coming soon!', 'warning');
    }

    // Delete functions (placeholder)
    deleteDepartment(id) {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departments = this.departments.filter(d => d.id !== id);
            this.updateTeamDirectory();
            this.updateDashboard();
            this.showToast('Department deleted successfully!', 'success');
        }
    }

    deleteMember(id) {
        if (confirm('Are you sure you want to delete this team member?')) {
            const member = this.members.find(m => m.id === id);
            if (member) {
                const dept = this.departments.find(d => d.name === member.department);
                if (dept) {
                    dept.members--;
                    dept.coverage = Math.max(0, dept.coverage - 20);
                }
            }
            
            this.members = this.members.filter(m => m.id !== id);
            this.updateTeamDirectory();
            this.updateDashboard();
            this.showToast('Team member deleted successfully!', 'success');
        }
    }

    deleteStakeholder(id) {
        if (confirm('Are you sure you want to delete this stakeholder?')) {
            this.stakeholders = this.stakeholders.filter(s => s.id !== id);
            this.updateStakeholderAnalysis();
            this.showToast('Stakeholder deleted successfully!', 'success');
        }
    }

    deleteConnection(id) {
        if (confirm('Are you sure you want to delete this connection?')) {
            this.connections = this.connections.filter(c => c.id !== id);
            this.updateConnectionOpportunities();
            this.showToast('Connection deleted successfully!', 'success');
        }
    }

    deleteImpact(id) {
        if (confirm('Are you sure you want to delete this impact assessment?')) {
            this.impacts = this.impacts.filter(i => i.id !== id);
            this.updateChangeImpacts();
            this.showToast('Impact assessment deleted successfully!', 'success');
        }
    }

    deletePlan(id) {
        if (confirm('Are you sure you want to delete this plan?')) {
            this.plans = this.plans.filter(p => p.id !== id);
            this.updatePlanning();
            this.showToast('Plan deleted successfully!', 'success');
        }
    }

    deleteIdea(id) {
        if (confirm('Are you sure you want to delete this idea?')) {
            this.ideas = this.ideas.filter(i => i.id !== id);
            this.updateIdeasBoard();
            this.showToast('Idea deleted successfully!', 'success');
        }
    }

    deleteJobAid(id) {
        if (confirm('Are you sure you want to delete this job aid?')) {
            this.jobAids = this.jobAids.filter(j => j.id !== id);
            this.updateJobAids();
            this.showToast('Job aid deleted successfully!', 'success');
        }
    }

    deleteTraining(id) {
        if (confirm('Are you sure you want to delete this training program?')) {
            this.training = this.training.filter(t => t.id !== id);
            this.updateTraining();
            this.showToast('Training program deleted successfully!', 'success');
        }
    }

    // Toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Theme toggle
    setupThemeToggle() {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.onclick = () => this.toggleTheme();
        document.body.appendChild(themeToggle);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update background gradient based on theme
        const body = document.body;
        if (newTheme === 'dark') {
            body.style.background = 'linear-gradient(135deg, #000000 0%, #111111 100%)';
        } else {
            body.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
        }
        
        const toggle = document.querySelector('.theme-toggle');
        toggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        
        localStorage.setItem('theme', newTheme);
    }

    // Load saved theme
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Set initial background gradient
        const body = document.body;
        if (savedTheme === 'dark') {
            body.style.background = 'linear-gradient(135deg, #000000 0%, #111111 100%)';
        } else {
            body.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
        }
        
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Planning Workflow Methods
    startPlanningWorkflow(impact) {
        this.currentPlanningImpact = impact;
        this.currentActivities = [];
        this.openModal('planningChoiceModal');
    }

    startActivityPlanning() {
        this.closeModal('planningChoiceModal');
        
        // Populate the modal with impact information
        document.getElementById('modalCurrentState').textContent = this.currentPlanningImpact.currentState;
        document.getElementById('modalFutureState').textContent = this.currentPlanningImpact.futureState;
        
        // Clear previous activities
        this.currentActivities = [];
        this.updateActivitiesList();
        
        this.openModal('activityPlanningModal');
    }

    redirectToIdeasBoard() {
        this.closeModal('planningChoiceModal');
        this.navigateToSection('ideas-board');
    }

    addActivity() {
        const activityDescription = document.getElementById('activityDescription').value.trim();
        if (!activityDescription) {
            this.showToast('Please enter an activity description', 'error');
            return;
        }

        const newActivity = {
            id: Date.now(),
            description: activityDescription,
            effort: null,
            impact: null
        };

        this.currentActivities.push(newActivity);
        document.getElementById('activityDescription').value = '';
        this.updateActivitiesList();
        
        // Show "Add Another Activity" button and "Next" button
        const addAnotherBtn = document.createElement('button');
        addAnotherBtn.className = 'btn btn-outline';
        addAnotherBtn.textContent = 'Add Another Activity';
        addAnotherBtn.onclick = () => this.addActivity();
        
        const activityActions = document.querySelector('.activity-actions');
        activityActions.innerHTML = '';
        activityActions.appendChild(addAnotherBtn);
        
        document.getElementById('nextButton').style.display = 'inline-block';
        
        this.showToast('Activity added!', 'success');
    }

    updateActivitiesList() {
        const container = document.getElementById('activitiesContainer');
        container.innerHTML = '';

        this.currentActivities.forEach((activity, index) => {
            const activityPill = document.createElement('div');
            activityPill.className = 'activity-pill';
            activityPill.innerHTML = `
                <span class="activity-number">${index + 1}</span>
                <span class="activity-text">${activity.description}</span>
                <button class="btn btn-sm btn-outline" onclick="app.removeActivity(${activity.id})">Remove</button>
            `;
            container.appendChild(activityPill);
        });
    }

    removeActivity(activityId) {
        this.currentActivities = this.currentActivities.filter(a => a.id !== activityId);
        this.updateActivitiesList();
        
        if (this.currentActivities.length === 0) {
            document.getElementById('nextButton').style.display = 'none';
            const activityActions = document.querySelector('.activity-actions');
            activityActions.innerHTML = '<button class="btn btn-primary" onclick="app.addActivity()">Add Activity</button>';
        }
    }

    proceedToEvaluation() {
        if (this.currentActivities.length === 0) {
            this.showToast('Please add at least one activity before proceeding', 'error');
            return;
        }

        this.closeModal('activityPlanningModal');
        this.openModal('activityEvaluationModal');
        this.populateEvaluationActivities();
    }

    populateEvaluationActivities() {
        const container = document.getElementById('evaluationActivities');
        container.innerHTML = '';

        this.currentActivities.forEach((activity, index) => {
            const activityRow = document.createElement('div');
            activityRow.className = 'evaluation-activity-row';
            activityRow.innerHTML = `
                <div class="activity-info">
                    <span class="activity-number">${index + 1}</span>
                    <span class="activity-description">${activity.description}</span>
                </div>
                <div class="evaluation-scores">
                    <div class="score-group">
                        <label>Effort</label>
                        <div class="radio-group">
                            ${[1,2,3,4,5].map(score => `
                                <label class="radio-option">
                                    <input type="radio" name="effort_${activity.id}" value="${score}" required>
                                    <span class="radio-label">${score}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="score-group">
                        <label>Impact</label>
                        <div class="radio-group">
                            ${[1,2,3,4,5].map(score => `
                                <label class="radio-option">
                                    <input type="radio" name="impact_${activity.id}" value="${score}" required>
                                    <span class="radio-label">${score}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(activityRow);
        });
    }

    submitActivityEvaluation() {
        // Validate all activities have been scored
        const allScored = this.currentActivities.every(activity => {
            const effortChecked = document.querySelector(`input[name="effort_${activity.id}"]:checked`);
            const impactChecked = document.querySelector(`input[name="impact_${activity.id}"]:checked`);
            return effortChecked && impactChecked;
        });

        if (!allScored) {
            this.showToast('Please score all activities before submitting', 'error');
            return;
        }

        // Update activities with scores
        this.currentActivities.forEach(activity => {
            const effortScore = parseInt(document.querySelector(`input[name="effort_${activity.id}"]:checked`).value);
            const impactScore = parseInt(document.querySelector(`input[name="impact_${activity.id}"]:checked`).value);
            
            activity.effort = effortScore;
            activity.impact = impactScore;
        });

        // Create plan entries for each activity
        this.currentActivities.forEach(activity => {
            const newId = Math.max(...this.plans.map(p => p.id), 0) + 1;
            const newPlan = {
                id: newId,
                ciNumber: this.currentPlanningImpact.id,
                activityIdeas: activity.description,
                effortScore: activity.effort,
                impactScore: activity.impact,
                targetDate: '',
                impactScore: this.getScoreLabel(this.currentPlanningImpact.effort, this.currentPlanningImpact.disruption),
                invitee: '',
                invitationSent: false,
                ciId: this.currentPlanningImpact.id,
                addedToActionPlan: false
            };
            
            this.plans.push(newPlan);
        });

        // Update the planning table
        this.updatePlanning();
        
        // Close modal and show success
        this.closeModal('activityEvaluationModal');
        this.showToast('Activities added to planning table!', 'success');
        
        // Reset planning state
        this.currentPlanningImpact = null;
        this.currentActivities = [];
    }

    addToActionPlan(planId) {
        const plan = this.plans.find(p => p.id === planId);
        if (plan) {
            plan.addedToActionPlan = true;
            this.updatePlanning();
            this.showToast('Activity added to action plan!', 'success');
        }
    }

    // Schedule Methods
    updateSchedule() {
        // Populate filter dropdowns
        this.populateScheduleFilters();
        
        if (this.currentScheduleView === 'calendar') {
            this.updateCalendar();
        } else {
            this.updateGanttChart();
        }
    }

    populateScheduleFilters() {
        // Populate team member filters
        this.populateTeamMemberFilters();
        
        // Populate department filters
        this.populateDepartmentFilters();
    }

    populateTeamMemberFilters() {
        const ganttTeamFilter = document.getElementById('teamMemberFilter');
        const calendarTeamFilter = document.getElementById('calendarTeamMemberFilter');
        
        if (ganttTeamFilter) {
            ganttTeamFilter.innerHTML = '<option value="">All Team Members</option>';
            this.teamMembers.forEach(member => {
                const option = document.createElement('option');
                option.value = member.name;
                option.textContent = member.name;
                ganttTeamFilter.appendChild(option);
            });
        }
        
        if (calendarTeamFilter) {
            calendarTeamFilter.innerHTML = '<option value="">All Team Members</option>';
            this.teamMembers.forEach(member => {
                const option = document.createElement('option');
                option.value = member.name;
                option.textContent = member.name;
                calendarTeamFilter.appendChild(option);
            });
        }
    }

    populateDepartmentFilters() {
        const ganttDeptFilter = document.getElementById('departmentFilter');
        const calendarDeptFilter = document.getElementById('calendarDepartmentFilter');
        
        if (ganttDeptFilter) {
            ganttDeptFilter.innerHTML = '<option value="">All Departments/Agencies</option>';
            this.departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                ganttDeptFilter.appendChild(option);
            });
        }
        
        if (calendarDeptFilter) {
            calendarDeptFilter.innerHTML = '<option value="">All Departments/Agencies</option>';
            this.departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                calendarDeptFilter.appendChild(option);
            });
        }
    }

    switchScheduleView(view) {
        this.currentScheduleView = view;
        
        // Update button states
        document.getElementById('calendarViewBtn').className = view === 'calendar' ? 'btn btn-primary' : 'btn btn-outline';
        document.getElementById('ganttViewBtn').className = view === 'gantt' ? 'btn btn-primary' : 'btn btn-outline';
        
        // Show/hide views
        document.getElementById('calendarView').style.display = view === 'calendar' ? 'block' : 'none';
        document.getElementById('ganttView').style.display = view === 'gantt' ? 'block' : 'none';
        
        // Update the appropriate view
        this.updateSchedule();
    }

    updateCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const currentMonth = this.currentCalendarDate.getMonth();
        const currentYear = this.currentCalendarDate.getFullYear();
        
        // Update month/year header
        document.getElementById('currentMonthYear').textContent = 
            `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get activities for this month
        const activitiesThisMonth = this.getActivitiesForMonth(currentMonth, currentYear);
        
        // Generate calendar grid
        this.generateCalendarGrid(currentMonth, currentYear, activitiesThisMonth);
    }

    getActivitiesForMonth(month, year) {
        const monthStr = String(month + 1).padStart(2, '0');
        const yearStr = String(year);
        
        return this.getFilteredPlans().filter(plan => {
            if (!plan.targetDate) return false;
            const [planYear, planMonth] = plan.targetDate.split('-');
            return planYear === yearStr && planMonth === monthStr;
        });
    }

    getFilteredPlans() {
        let filteredPlans = [...this.plans];
        
        // Apply team member filter
        const teamMemberFilter = document.getElementById('teamMemberFilter') || 
                                document.getElementById('calendarTeamMemberFilter');
        if (teamMemberFilter && teamMemberFilter.value) {
            filteredPlans = filteredPlans.filter(plan => plan.invitee === teamMemberFilter.value);
        }
        
        // Apply department filter
        const departmentFilter = document.getElementById('departmentFilter') || 
                                document.getElementById('calendarDepartmentFilter');
        if (departmentFilter && departmentFilter.value) {
            filteredPlans = filteredPlans.filter(plan => {
                // Find the team member and check their department
                const teamMember = this.teamMembers.find(member => member.name === plan.invitee);
                return teamMember && teamMember.department === departmentFilter.value;
            });
        }
        
        return filteredPlans;
    }

    generateCalendarGrid(month, year, activities) {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';
        
        // Create day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            grid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            
            // Add activities for this day
            const dayActivities = activities.filter(activity => {
                const activityDate = new Date(activity.targetDate);
                return activityDate.getDate() === day;
            });
            
            if (dayActivities.length > 0) {
                const activitiesContainer = document.createElement('div');
                activitiesContainer.className = 'day-activities';
                
                dayActivities.forEach(activity => {
                    const activityElement = document.createElement('div');
                    activityElement.className = 'calendar-activity';
                    activityElement.innerHTML = `
                        <span class="activity-name" title="${activity.activityIdeas}">
                            ${this.truncateText(activity.activityIdeas, 20)}
                        </span>
                    `;
                    activityElement.onclick = () => this.navigateToPlanning();
                    activitiesContainer.appendChild(activityElement);
                });
                
                dayElement.appendChild(activitiesContainer);
            }
            
            grid.appendChild(dayElement);
        }
    }

    previousMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
        this.updateCalendar();
    }

    nextMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
        this.updateCalendar();
    }

    navigateToPlanning() {
        this.navigateToSection('planning');
    }

    updateGanttChart() {
        const ganttBody = document.getElementById('ganttBody');
        ganttBody.innerHTML = '';
        
        // Get filtered activities with target dates
        const activitiesWithDates = this.getFilteredPlans().filter(plan => plan.targetDate);
        
        // Apply month filter if selected
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter && monthFilter.value) {
            const filteredByMonth = activitiesWithDates.filter(plan => {
                const [year, month] = plan.targetDate.split('-');
                return `${year}-${month}` === monthFilter.value;
            });
            activitiesWithDates.length = 0;
            activitiesWithDates.push(...filteredByMonth);
        }
        
        activitiesWithDates.forEach(plan => {
            const row = document.createElement('div');
            row.className = 'gantt-row';
            
            const activityName = this.truncateText(plan.activityIdeas || 'No activity', 30);
            const ciNumber = plan.ciNumber || 'N/A';
            const inviteeName = plan.invitee || 'Unassigned';
            
            row.innerHTML = `
                <div class="gantt-activity-name" onclick="app.navigateToPlanning()">
                    <span class="ci-number">${ciNumber}</span>
                    <span class="activity-name">${activityName}</span>
                    <span class="invitee-name">${inviteeName}</span>
                </div>
                <div class="gantt-timeline">
                    ${this.generateGanttTimeline(plan.targetDate)}
                </div>
            `;
            
            ganttBody.appendChild(row);
        });
    }

    generateGanttTimeline(targetDate) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const [year, month] = targetDate.split('-');
        const targetMonth = parseInt(month) - 1;
        const targetYear = parseInt(year);
        const currentDate = new Date();
        const isUpcoming = targetYear > currentDate.getFullYear() || 
                          (targetYear === currentDate.getFullYear() && targetMonth >= currentDate.getMonth());
        
        let timelineHTML = '';
        
        for (let i = 0; i < 12; i++) {
            const monthClass = i === targetMonth ? 'gantt-month target-month' : 'gantt-month';
            const upcomingClass = isUpcoming ? 'upcoming' : '';
            
            timelineHTML += `<div class="${monthClass} ${upcomingClass}"></div>`;
        }
        
        return timelineHTML;
    }

    sortGanttChart() {
        const sortBy = document.getElementById('ganttSort').value;
        const activitiesWithDates = this.getFilteredPlans().filter(plan => plan.targetDate);
        
        activitiesWithDates.sort((a, b) => {
            switch (sortBy) {
                case 'id':
                    return a.ciNumber.localeCompare(b.ciNumber);
                case 'name':
                    return (a.activityIdeas || '').localeCompare(b.activityIdeas || '');
                case 'month':
                    return new Date(a.targetDate) - new Date(b.targetDate);
                default:
                    return 0;
            }
        });
        
        this.updateGanttChart();
    }

    applyGanttFilters() {
        this.updateGanttChart();
    }

    applyCalendarFilters() {
        this.updateCalendar();
    }

    clearGanttFilters() {
        document.getElementById('monthFilter').value = '';
        document.getElementById('teamMemberFilter').value = '';
        document.getElementById('departmentFilter').value = '';
        this.updateGanttChart();
    }

    clearCalendarFilters() {
        document.getElementById('calendarTeamMemberFilter').value = '';
        document.getElementById('calendarDepartmentFilter').value = '';
        this.updateCalendar();
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}

// Global functions for HTML onclick handlers
function openModal(modalId) {
    app.openModal(modalId);
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

function addNewRow() {
    app.addNewRow();
}

function downloadTemplate(type) {
    app.downloadTemplate(type);
}

function updateCsvInstructions() {
    const csvType = document.getElementById('csvType').value;
    const instructions = document.getElementById('csvInstructions');
    
    if (csvType === 'departments') {
        instructions.textContent = 'File should have "Department/Agency" header (with optional Name, Role, Email, Phone columns)';
    } else if (csvType === 'roles') {
        instructions.textContent = 'File should have "Role" header';
    } else {
        instructions.textContent = 'Please select an import type first';
    }
}

function toggleNewDepartment() {
    const departmentSelect = document.getElementById('memberDepartment');
    const newDepartmentGroup = document.getElementById('newDepartmentGroup');
    
    if (departmentSelect.value === 'new') {
        newDepartmentGroup.style.display = 'block';
        document.getElementById('newDepartment').required = true;
    } else {
        newDepartmentGroup.style.display = 'none';
        document.getElementById('newDepartment').required = false;
        hideFuzzySuggestions();
    }
}

function showFuzzySuggestions(input) {
    const suggestionsDiv = document.getElementById('fuzzySuggestions');
    const inputValue = input.trim();
    
    if (inputValue.length < 2) {
        hideFuzzySuggestions();
        return;
    }
    
    // Get fuzzy matches
    const matches = [];
    for (const dept of app.departments) {
        const score = app.calculateSimilarity(inputValue.toLowerCase(), dept.toLowerCase());
        if (score >= 0.3) { // Lower threshold for suggestions
            matches.push({ name: dept, confidence: score });
        }
    }
    
    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);
    
    if (matches.length === 0) {
        hideFuzzySuggestions();
        return;
    }
    
    // Display suggestions
    suggestionsDiv.innerHTML = '';
    matches.slice(0, 5).forEach(match => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'fuzzy-suggestion';
        suggestionDiv.onclick = () => selectFuzzySuggestion(match.name);
        
        const confidenceClass = match.confidence > 0.8 ? 'fuzzy-suggestion-high' : 
                              match.confidence > 0.6 ? 'fuzzy-suggestion-medium' : 
                              'fuzzy-suggestion-low';
        
        suggestionDiv.innerHTML = `
            <span class="fuzzy-suggestion-name">${match.name}</span>
            <span class="fuzzy-suggestion-confidence ${confidenceClass}">${Math.round(match.confidence * 100)}%</span>
        `;
        
        suggestionsDiv.appendChild(suggestionDiv);
    });
    
    suggestionsDiv.style.display = 'block';
}

function selectFuzzySuggestion(departmentName) {
    document.getElementById('newDepartment').value = departmentName;
    hideFuzzySuggestions();
}

function hideFuzzySuggestions() {
    const suggestionsDiv = document.getElementById('fuzzySuggestions');
    suggestionsDiv.style.display = 'none';
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#newDepartmentGroup')) {
        hideFuzzySuggestions();
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ResultsModeApp();
    app.loadTheme();
    
    // Initialize stakeholder carousel after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeStakeholderCarousel();
    }, 100);
});

// Stakeholder Carousel Functionality
const stakeholderGroups = [
    { name: "Executive Leadership", description: "Senior management and decision makers" },
    { name: "Department Heads", description: "Department managers and team leaders" },
    { name: "End Users", description: "Employees who will use the system" },
    { name: "IT Department", description: "Technical support and implementation team" },
    { name: "Finance Team", description: "Budget and financial oversight" },
    { name: "External Partners", description: "Vendors and external stakeholders" }
];

let currentStakeholderIndex = 0;
let isStakeholderAnimating = false;

function initializeStakeholderCarousel() {
    const cards = document.querySelectorAll('.stakeholder-card');
    const dots = document.querySelectorAll('.stakeholder-dots .dot');
    const groupName = document.querySelector('.stakeholder-group-name');
    const groupDescription = document.querySelector('.stakeholder-group-description');

    if (cards.length === 0) return;

    // Set up event listeners for cards
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            selectStakeholderGroup(i);
            // Open the stakeholder modal when a card is clicked
            openModal('stakeholderModal');
            setupStakeholderFormHandler();
            // Auto-populate the stakeholder field with the card's title
            populateStakeholderFromCard(stakeholderGroups[i].name);
        });
    });

    // Set up event listeners for dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            selectStakeholderGroup(i);
        });
    });

    // Set up keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('stakeholder-analysis').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                navigateStakeholderCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                navigateStakeholderCarousel(1);
            }
        }
    });

    // Set up touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        if (document.getElementById('stakeholder-analysis').classList.contains('active')) {
            touchStartX = e.changedTouches[0].screenX;
        }
    });

    document.addEventListener('touchend', (e) => {
        if (document.getElementById('stakeholder-analysis').classList.contains('active')) {
            touchEndX = e.changedTouches[0].screenX;
            handleStakeholderSwipe();
        }
    });

    function handleStakeholderSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigateStakeholderCarousel(1);
            } else {
                navigateStakeholderCarousel(-1);
            }
        }
    }

    // Initialize with first card
    updateStakeholderCarousel(0);
}

function navigateStakeholderCarousel(direction) {
    if (isStakeholderAnimating) return;
    
    const newIndex = (currentStakeholderIndex + direction + stakeholderGroups.length) % stakeholderGroups.length;
    updateStakeholderCarousel(newIndex);
}

function selectStakeholderGroup(index) {
    if (isStakeholderAnimating) return;
    updateStakeholderCarousel(index);
}

function updateStakeholderCarousel(newIndex) {
    if (isStakeholderAnimating) return;
    isStakeholderAnimating = true;

    currentStakeholderIndex = newIndex;
    const cards = document.querySelectorAll('.stakeholder-card');
    const dots = document.querySelectorAll('.stakeholder-dots .dot');
    const groupName = document.querySelector('.stakeholder-group-name');
    const groupDescription = document.querySelector('.stakeholder-group-description');

    // Update card positions
    cards.forEach((card, i) => {
        const offset = (i - currentStakeholderIndex + cards.length) % cards.length;

        card.classList.remove(
            'center',
            'left-1',
            'left-2',
            'right-1',
            'right-2',
            'hidden'
        );

        if (offset === 0) {
            card.classList.add('center');
        } else if (offset === 1) {
            card.classList.add('right-1');
        } else if (offset === 2) {
            card.classList.add('right-2');
        } else if (offset === cards.length - 1) {
            card.classList.add('left-1');
        } else if (offset === cards.length - 2) {
            card.classList.add('left-2');
        } else {
            card.classList.add('hidden');
        }
    });

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentStakeholderIndex);
    });

    // Update info text with fade effect
    if (groupName && groupDescription) {
        groupName.style.opacity = '0';
        groupDescription.style.opacity = '0';

        setTimeout(() => {
            groupName.textContent = stakeholderGroups[currentStakeholderIndex].name;
            groupDescription.textContent = stakeholderGroups[currentStakeholderIndex].description;
            groupName.style.opacity = '1';
            groupDescription.style.opacity = '1';
        }, 300);
    }

    // Update stakeholder group in modal form if it exists (now handled by department dropdown)
    // The department dropdown will be populated when modal opens

    // Filter stakeholders table by selected group
    filterStakeholdersByGroup(stakeholderGroups[currentStakeholderIndex].name);

    setTimeout(() => {
        isStakeholderAnimating = false;
    }, 800);
}

function filterStakeholdersByGroup(groupName) {
    const tbody = document.getElementById('stakeholders-tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        // For now, show all rows since we don't have group column in the table yet
        // This can be enhanced later when we add the group column
        row.style.display = '';
    });
}

// Add stakeholder form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const stakeholderForm = document.getElementById('stakeholderForm');
    if (stakeholderForm) {
        stakeholderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addStakeholder();
        });
    }
});

// Also set up the form handler when the modal opens
function setupStakeholderFormHandler() {
    const stakeholderForm = document.getElementById('stakeholderForm');
    if (stakeholderForm && !stakeholderForm.hasAttribute('data-handler-set')) {
        stakeholderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addStakeholder();
        });
        stakeholderForm.setAttribute('data-handler-set', 'true');
    }
    
    // Populate department dropdown
    populateStakeholderDepartmentDropdown();
}

function populateStakeholderFromCard(cardTitle) {
    // Set the dropdown to "Other" and populate the text field
    const departmentSelect = document.getElementById('stakeholderDepartment');
    const otherInput = document.getElementById('otherDepartment');
    
    if (departmentSelect && otherInput) {
        departmentSelect.value = 'Other';
        otherInput.value = cardTitle;
        // Show the other input field
        const otherGroup = document.getElementById('otherDepartmentGroup');
        if (otherGroup) {
            otherGroup.style.display = 'block';
            otherInput.required = true;
        }
    }
}

function populateStakeholderDepartmentDropdown() {
    const departmentSelect = document.getElementById('stakeholderDepartment');
    if (!departmentSelect) return;
    
    // Clear existing options except the first one and Other
    departmentSelect.innerHTML = '<option value="">Select Stakeholder</option>';
    
    // Add departments from sample data
    if (window.app && window.app.departments && window.app.departments.length > 0) {
        window.app.departments.forEach(department => {
            const option = document.createElement('option');
            // Handle both string departments and object departments
            const departmentName = typeof department === 'string' ? department : department.name;
            option.value = departmentName;
            option.textContent = departmentName;
            departmentSelect.appendChild(option);
        });
    }
    
    // Add "Other" option at the end
    const otherOption = document.createElement('option');
    otherOption.value = 'Other';
    otherOption.textContent = 'Other';
    departmentSelect.appendChild(otherOption);
}

function toggleOtherDepartmentField() {
    const departmentSelect = document.getElementById('stakeholderDepartment');
    const otherGroup = document.getElementById('otherDepartmentGroup');
    const otherInput = document.getElementById('otherDepartment');
    
    if (!departmentSelect || !otherGroup) return;
    
    if (departmentSelect.value === 'Other') {
        otherGroup.style.display = 'block';
        otherInput.required = true;
    } else {
        otherGroup.style.display = 'none';
        otherInput.required = false;
        otherInput.value = ''; // Clear the input when hiding
    }
}

function addStakeholder() {
    const form = document.getElementById('stakeholderForm');
    const formData = new FormData(form);
    
    // Determine the stakeholder name - use "Other" input if "Other" is selected, otherwise use dropdown selection
    const departmentValue = formData.get('department');
    const otherDepartmentValue = formData.get('otherDepartment');
    const stakeholderName = departmentValue === 'Other' && otherDepartmentValue && otherDepartmentValue.trim() !== '' 
        ? otherDepartmentValue.trim() 
        : departmentValue;
    
    const stakeholder = {
        name: stakeholderName,
        department: stakeholderName,
        group: stakeholderName,
        influence: formData.get('influence'),
        interest: formData.get('interest')
    };

    // Add to stakeholders array
    if (window.app && window.app.stakeholders) {
        window.app.stakeholders.push(stakeholder);
    }

    // Add to table
    addStakeholderToTable(stakeholder);

    // Close modal
    closeModal('stakeholderModal');

    // Reset form
    form.reset();
    
    // Hide the other department input
    const otherGroup = document.getElementById('otherDepartmentGroup');
    if (otherGroup) {
        otherGroup.style.display = 'none';
    }

    // Show success message
    showToast('Stakeholder added successfully!', 'success');

    // Save to database
    if (window.app && window.app.saveStakeholder) {
        window.app.saveStakeholder(stakeholder);
    }
}

function addStakeholderToTable(stakeholder) {
    const tbody = document.getElementById('stakeholders-tbody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${stakeholder.name}</td>
        <td><span class="status-badge ${stakeholder.influence.toLowerCase()}">${stakeholder.influence}</span></td>
        <td><span class="status-badge ${stakeholder.interest.toLowerCase()}">${stakeholder.interest}</span></td>
        <td>
            <button class="btn btn-sm btn-outline" onclick="editStakeholder('${stakeholder.name}')">Edit</button>
            <button class="btn btn-sm btn-outline" onclick="deleteStakeholder('${stakeholder.name}')">Delete</button>
        </td>
    `;

    tbody.appendChild(row);
}

// Ideas Board Functionality
let ideasData = {
    communicate: [
        "Create a weekly newsletter to keep everyone informed about project updates and changes.",
        "Set up a dedicated Slack channel for quick updates and informal communication.",
        "Implement a monthly all-hands meeting to share progress and gather feedback.",
        "Create visual dashboards to communicate project status at a glance.",
        "Establish regular one-on-one check-ins between managers and team members."
    ],
    inspire: [
        "Host monthly 'Innovation Showcase' sessions where teams present their creative solutions.",
        "Create a 'Wall of Fame' to celebrate team achievements and milestones.",
        "Organize team building activities that align with company values and goals.",
        "Share success stories and case studies to motivate continued excellence.",
        "Invite guest speakers to share insights and inspire new thinking."
    ],
    teach: [
        "Create peer-to-peer learning sessions where team members teach each other new skills.",
        "Develop a knowledge base with best practices and lessons learned.",
        "Organize lunch-and-learn sessions on various topics of interest.",
        "Implement a mentorship program pairing experienced and new team members.",
        "Create video tutorials for common processes and procedures."
    ],
    lead: [
        "Establish mentorship programs pairing experienced leaders with emerging talent.",
        "Create leadership development workshops focused on key competencies.",
        "Implement a 360-degree feedback system for continuous improvement.",
        "Organize leadership retreats to build relationships and strategic thinking.",
        "Develop a leadership pipeline with clear progression paths."
    ],
    brainstorm: [
        "Use design thinking workshops to tackle complex problems with fresh perspectives.",
        "Implement regular brainstorming sessions with diverse cross-functional teams.",
        "Create an idea submission system where anyone can contribute suggestions.",
        "Use mind mapping techniques to explore new possibilities and connections.",
        "Organize hackathons to encourage rapid prototyping and innovation."
    ],
    meet: [
        "Organize cross-departmental coffee chats to build relationships and share insights.",
        "Create standing meetings with clear agendas and time limits for efficiency.",
        "Implement virtual collaboration tools for remote team members.",
        "Establish regular retrospectives to continuously improve meeting effectiveness.",
        "Create informal networking events to strengthen team connections."
    ]
};

let userXP = 0;
let userIdeas = {};

// Initialize ideas board
function initIdeasBoard() {
    // Load saved XP and ideas from localStorage
    const savedXP = localStorage.getItem('userXP');
    if (savedXP) {
        userXP = parseInt(savedXP);
        updateXPDisplay();
    }
    
    const savedIdeas = localStorage.getItem('userIdeas');
    if (savedIdeas) {
        userIdeas = JSON.parse(savedIdeas);
    }
}

// Flip card functionality
function flipCard(cardElement) {
    const category = cardElement.getAttribute('data-category');
    const ideaTextElement = cardElement.querySelector('.idea-text');
    const currentIndex = parseInt(ideaTextElement.getAttribute('data-idea-index'));
    
    // Toggle flip state
    cardElement.classList.toggle('flipped');
    
    // If flipping to back, cycle through ideas
    if (cardElement.classList.contains('flipped')) {
        const ideas = ideasData[category] || [];
        const nextIndex = (currentIndex + 1) % ideas.length;
        
        ideaTextElement.setAttribute('data-idea-index', nextIndex);
        ideaTextElement.querySelector('p').textContent = ideas[nextIndex];
        
        // Add user ideas if they exist for this category
        if (userIdeas[category] && userIdeas[category].length > 0) {
            const allIdeas = [...ideas, ...userIdeas[category]];
            const userNextIndex = (currentIndex + 1) % allIdeas.length;
            ideaTextElement.querySelector('p').textContent = allIdeas[userNextIndex];
        }
    }
}

// Toggle new category input
function toggleNewCategory() {
    const categorySelect = document.getElementById('ideaCategory');
    const newCategoryGroup = document.getElementById('newCategoryGroup');
    
    if (categorySelect.value === 'new') {
        newCategoryGroup.style.display = 'block';
        document.getElementById('newCategoryName').required = true;
    } else {
        newCategoryGroup.style.display = 'none';
        document.getElementById('newCategoryName').required = false;
        document.getElementById('newCategoryName').value = '';
    }
}

// Add new idea
function addIdea() {
    const ideaText = document.getElementById('ideaText').value.trim();
    const category = document.getElementById('ideaCategory').value;
    const newCategoryName = document.getElementById('newCategoryName').value.trim();
    
    if (!ideaText) {
        showToast('Please enter an idea!', 'error');
        return;
    }
    
    if (!category) {
        showToast('Please select a category!', 'error');
        return;
    }
    
    let targetCategory = category;
    
    // Handle new category creation
    if (category === 'new') {
        if (!newCategoryName) {
            showToast('Please enter a category name!', 'error');
            return;
        }
        targetCategory = newCategoryName.toLowerCase().replace(/\s+/g, '-');
        
        // Add to ideas data if it's a new category
        if (!ideasData[targetCategory]) {
            ideasData[targetCategory] = [];
        }
        
        // Add to dropdown options
        const categorySelect = document.getElementById('ideaCategory');
        const newOption = document.createElement('option');
        newOption.value = targetCategory;
        newOption.textContent = newCategoryName;
        categorySelect.insertBefore(newOption, categorySelect.lastElementChild);
    }
    
    // Add idea to user ideas
    if (!userIdeas[targetCategory]) {
        userIdeas[targetCategory] = [];
    }
    userIdeas[targetCategory].push(ideaText);
    
    // Award XP
    userXP += 10;
    updateXPDisplay();
    
    // Save to localStorage
    localStorage.setItem('userXP', userXP.toString());
    localStorage.setItem('userIdeas', JSON.stringify(userIdeas));
    
    // Clear form
    document.getElementById('ideaText').value = '';
    document.getElementById('ideaCategory').value = '';
    document.getElementById('newCategoryName').value = '';
    document.getElementById('newCategoryGroup').style.display = 'none';
    document.getElementById('newCategoryName').required = false;
    
    showToast('Idea added successfully! +10 XP', 'success');
    
    // If it's a new category, create a new card
    if (category === 'new') {
        createNewCard(targetCategory, newCategoryName);
    }
}

// Create new card for new category
function createNewCard(category, displayName) {
    const cardsContainer = document.querySelector('.ideas-cards-container');
    
    const newCard = document.createElement('div');
    newCard.className = 'idea-card';
    newCard.setAttribute('data-category', category);
    newCard.onclick = () => flipCard(newCard);
    
    newCard.innerHTML = `
        <div class="card-front">
            <div class="card-image ${category}-bg"></div>
            <div class="card-content">
                <h3>${displayName}</h3>
                <p>Your custom category</p>
            </div>
        </div>
        <div class="card-back">
            <div class="idea-content">
                <h4>${displayName} Ideas</h4>
                <div class="idea-text" data-idea-index="0">
                    <p>${userIdeas[category][userIdeas[category].length - 1]}</p>
                </div>
            </div>
        </div>
    `;
    
    cardsContainer.appendChild(newCard);
}

// Update XP display
function updateXPDisplay() {
    const xpValue = document.getElementById('xpValue');
    const xpFill = document.getElementById('xpFill');
    const xpMilestone = document.getElementById('xpMilestone');
    
    if (xpValue) xpValue.textContent = userXP;
    
    const nextMilestone = Math.ceil(userXP / 100) * 100;
    const progress = (userXP % 100) / 100 * 100;
    
    if (xpFill) xpFill.style.width = `${progress}%`;
    if (xpMilestone) xpMilestone.textContent = `Next milestone: ${nextMilestone} XP`;
}

// Initialize ideas board when page loads
document.addEventListener('DOMContentLoaded', function() {
    initIdeasBoard();
});
