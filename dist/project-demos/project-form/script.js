// Dynamic Form handling for Project Management & Procurement Experience
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('experienceForm');
    
    // Data storage for each experience type
    let projects = [];
    let procurements = [];
    let budgets = [];
    
    // Button references
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addProcurementBtn = document.getElementById('addProcurementBtn');
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    
    // Table references
    const projectsTable = document.getElementById('projectsTable');
    const procurementsTable = document.getElementById('procurementsTable');
    const budgetsTable = document.getElementById('budgetsTable');
    
    // Table body references
    const projectsTableBody = document.getElementById('projectsTableBody');
    const procurementsTableBody = document.getElementById('procurementsTableBody');
    const budgetsTableBody = document.getElementById('budgetsTableBody');
    
    // Event listeners for add buttons
    addProjectBtn.addEventListener('click', () => showProjectModal());
    addProcurementBtn.addEventListener('click', () => showProcurementModal());
    addBudgetBtn.addEventListener('click', () => showBudgetModal());
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (projects.length === 0 && procurements.length === 0 && budgets.length === 0) {
            showErrorMessage('Please add at least one experience entry before submitting.');
            return;
        }
        
        const formData = {
            timestamp: new Date().toISOString(),
            projects: projects,
            procurements: procurements,
            budgets: budgets
        };
        
        submitToServer(formData);
    });
    
    // Show Project Modal
    function showProjectModal() {
        const modal = createModal('Add Project Experience', createProjectForm());
        document.body.appendChild(modal);
    }
    
    // Show Procurement Modal
    function showProcurementModal() {
        const modal = createModal('Add Procurement Experience', createProcurementForm());
        document.body.appendChild(modal);
    }
    
    // Show Budget Modal
    function showBudgetModal() {
        const modal = createModal('Add Budget/Cost Management Experience', createBudgetForm());
        document.body.appendChild(modal);
    }
    
    // Create Modal
    function createModal(title, formContent) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <form class="modal-form">
                    ${formContent}
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn-primary">Add Experience</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add form submission handler
        const form = modal.querySelector('.modal-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(modal, form);
        });
        
        return modal;
    }
    
    // Create Project Form
    function createProjectForm() {
        return `
            <div class="form-group">
                <label for="projectName">Project Name *</label>
                <input type="text" id="projectName" name="projectName" class="glass-input" required>
            </div>
            <div class="form-group">
                <label for="projectDescription">Project Description *</label>
                <textarea id="projectDescription" name="projectDescription" class="glass-textarea" rows="3" required placeholder="Describe the project objectives, scope, and outcomes"></textarea>
            </div>
            <div class="form-group">
                <label for="projectBudget">Project Budget</label>
                <input type="text" id="projectBudget" name="projectBudget" class="glass-input" placeholder="e.g., $500,000">
            </div>
            <div class="form-group">
                <label for="teamSize">Team Size</label>
                <input type="text" id="teamSize" name="teamSize" class="glass-input" placeholder="e.g., 15 team members">
            </div>
            <div class="form-group">
                <label for="duration">Duration</label>
                <input type="text" id="duration" name="duration" class="glass-input" placeholder="e.g., 6 months">
            </div>
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status" class="glass-select">
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div class="form-group">
                <label for="methodologies">Methodologies Used</label>
                <textarea id="methodologies" name="methodologies" class="glass-textarea" rows="2" placeholder="e.g., Agile, Waterfall, Scrum"></textarea>
            </div>
            <div class="form-group">
                <label for="challenges">Key Challenges</label>
                <textarea id="challenges" name="challenges" class="glass-textarea" rows="2" placeholder="Describe major challenges and how you overcame them"></textarea>
            </div>
        `;
    }
    
    // Create Procurement Form
    function createProcurementForm() {
        return `
            <div class="form-group">
                <label for="procurementType">Procurement Type *</label>
                <input type="text" id="procurementType" name="procurementType" class="glass-input" required placeholder="e.g., Software License, Equipment, Services">
            </div>
            <div class="form-group">
                <label for="procurementDescription">Description *</label>
                <textarea id="procurementDescription" name="procurementDescription" class="glass-textarea" rows="3" required placeholder="Describe the procurement process, requirements, and outcomes"></textarea>
            </div>
            <div class="form-group">
                <label for="procurementValue">Value</label>
                <input type="text" id="procurementValue" name="procurementValue" class="glass-input" placeholder="e.g., $1.2M">
            </div>
            <div class="form-group">
                <label for="vendor">Vendor/Supplier</label>
                <input type="text" id="vendor" name="vendor" class="glass-input" placeholder="e.g., Microsoft, IBM">
            </div>
            <div class="form-group">
                <label for="procurementStatus">Status</label>
                <select id="procurementStatus" name="procurementStatus" class="glass-select">
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div class="form-group">
                <label for="procurementDate">Date</label>
                <input type="date" id="procurementDate" name="procurementDate" class="glass-input">
            </div>
            <div class="form-group">
                <label for="complianceNotes">Compliance & Process Notes</label>
                <textarea id="complianceNotes" name="complianceNotes" class="glass-textarea" rows="2" placeholder="Describe compliance approach and process details"></textarea>
            </div>
        `;
    }
    
    // Create Budget Form
    function createBudgetForm() {
        return `
            <div class="form-group">
                <label for="initiativeType">Initiative Type *</label>
                <input type="text" id="initiativeType" name="initiativeType" class="glass-input" required placeholder="e.g., Cost Reduction, Budget Optimization, Vendor Negotiation">
            </div>
            <div class="form-group">
                <label for="initiativeDescription">Description *</label>
                <textarea id="initiativeDescription" name="initiativeDescription" class="glass-textarea" rows="3" required placeholder="Describe the budget/cost management initiative and its impact"></textarea>
            </div>
            <div class="form-group">
                <label for="costSavings">Cost Savings Achieved</label>
                <input type="text" id="costSavings" name="costSavings" class="glass-input" placeholder="e.g., $250,000 saved">
            </div>
            <div class="form-group">
                <label for="budgetManaged">Budget Managed</label>
                <input type="text" id="budgetManaged" name="budgetManaged" class="glass-input" placeholder="e.g., $2M annual budget">
            </div>
            <div class="form-group">
                <label for="budgetDuration">Duration</label>
                <input type="text" id="budgetDuration" name="budgetDuration" class="glass-input" placeholder="e.g., 12 months">
            </div>
            <div class="form-group">
                <label for="budgetStatus">Status</label>
                <select id="budgetStatus" name="budgetStatus" class="glass-select">
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div class="form-group">
                <label for="kpis">Key Performance Indicators</label>
                <textarea id="kpis" name="kpis" class="glass-textarea" rows="2" placeholder="e.g., 15% cost reduction, 20% efficiency improvement"></textarea>
            </div>
        `;
    }
    
    // Handle Form Submission
    function handleFormSubmission(modal, form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Determine which type of experience this is based on the modal title
        const modalTitle = modal.querySelector('.modal-title').textContent;
        
        if (modalTitle.includes('Project')) {
            addProject(data);
        } else if (modalTitle.includes('Procurement')) {
            addProcurement(data);
        } else if (modalTitle.includes('Budget')) {
            addBudget(data);
        }
        
        modal.remove();
    }
    
    // Add Project
    function addProject(data) {
        const project = {
            id: Date.now(),
            name: data.projectName,
            description: data.projectDescription,
            budget: data.projectBudget || 'Not specified',
            teamSize: data.teamSize || 'Not specified',
            duration: data.duration || 'Not specified',
            status: data.status,
            methodologies: data.methodologies || 'Not specified',
            challenges: data.challenges || 'Not specified'
        };
        
        projects.push(project);
        updateProjectsTable();
        showSuccessMessage('Project added successfully!');
    }
    
    // Add Procurement
    function addProcurement(data) {
        const procurement = {
            id: Date.now(),
            type: data.procurementType,
            description: data.procurementDescription,
            value: data.procurementValue || 'Not specified',
            vendor: data.vendor || 'Not specified',
            status: data.procurementStatus,
            date: data.procurementDate || 'Not specified',
            complianceNotes: data.complianceNotes || 'Not specified'
        };
        
        procurements.push(procurement);
        updateProcurementsTable();
        showSuccessMessage('Procurement added successfully!');
    }
    
    // Add Budget
    function addBudget(data) {
        const budget = {
            id: Date.now(),
            type: data.initiativeType,
            description: data.initiativeDescription,
            costSavings: data.costSavings || 'Not specified',
            budgetManaged: data.budgetManaged || 'Not specified',
            duration: data.budgetDuration || 'Not specified',
            status: data.budgetStatus,
            kpis: data.kpis || 'Not specified'
        };
        
        budgets.push(budget);
        updateBudgetsTable();
        showSuccessMessage('Budget/Cost initiative added successfully!');
    }
    
    // Update Projects Table
    function updateProjectsTable() {
        if (projects.length === 0) {
            projectsTable.style.display = 'none';
            return;
        }
        
        projectsTable.style.display = 'block';
        projectsTableBody.innerHTML = projects.map(project => `
            <tr>
                <td>${project.name}</td>
                <td>${project.budget}</td>
                <td>${project.teamSize}</td>
                <td>${project.duration}</td>
                <td>${project.status}</td>
                <td>
                    <button class="table-action-btn" onclick="viewProjectDetails(${project.id})">View</button>
                    <button class="table-action-btn delete" onclick="deleteProject(${project.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Update Procurements Table
    function updateProcurementsTable() {
        if (procurements.length === 0) {
            procurementsTable.style.display = 'none';
            return;
        }
        
        procurementsTable.style.display = 'block';
        procurementsTableBody.innerHTML = procurements.map(procurement => `
            <tr>
                <td>${procurement.type}</td>
                <td>${procurement.value}</td>
                <td>${procurement.vendor}</td>
                <td>${procurement.status}</td>
                <td>${procurement.date}</td>
                <td>
                    <button class="table-action-btn" onclick="viewProcurementDetails(${procurement.id})">View</button>
                    <button class="table-action-btn delete" onclick="deleteProcurement(${procurement.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Update Budgets Table
    function updateBudgetsTable() {
        if (budgets.length === 0) {
            budgetsTable.style.display = 'none';
            return;
        }
        
        budgetsTable.style.display = 'block';
        budgetsTableBody.innerHTML = budgets.map(budget => `
            <tr>
                <td>${budget.type}</td>
                <td>${budget.costSavings}</td>
                <td>${budget.budgetManaged}</td>
                <td>${budget.duration}</td>
                <td>${budget.status}</td>
                <td>
                    <button class="table-action-btn" onclick="viewBudgetDetails(${budget.id})">View</button>
                    <button class="table-action-btn delete" onclick="deleteBudget(${budget.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Global functions for table actions
    window.viewProjectDetails = function(id) {
        const project = projects.find(p => p.id === id);
        if (project) {
            showDetailsModal('Project Details', project);
        }
    };
    
    window.viewProcurementDetails = function(id) {
        const procurement = procurements.find(p => p.id === id);
        if (procurement) {
            showDetailsModal('Procurement Details', procurement);
        }
    };
    
    window.viewBudgetDetails = function(id) {
        const budget = budgets.find(b => b.id === id);
        if (budget) {
            showDetailsModal('Budget/Cost Initiative Details', budget);
        }
    };
    
    window.deleteProject = function(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            projects = projects.filter(p => p.id !== id);
            updateProjectsTable();
        }
    };
    
    window.deleteProcurement = function(id) {
        if (confirm('Are you sure you want to delete this procurement?')) {
            procurements = procurements.filter(p => p.id !== id);
            updateProcurementsTable();
        }
    };
    
    window.deleteBudget = function(id) {
        if (confirm('Are you sure you want to delete this budget initiative?')) {
            budgets = budgets.filter(b => b.id !== id);
            updateBudgetsTable();
        }
    };
    
    // Show Details Modal
    function showDetailsModal(title, data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const details = Object.entries(data)
            .filter(([key]) => key !== 'id')
            .map(([key, value]) => `
                <div class="form-group">
                    <label>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                    <div class="detail-content">${value}</div>
                </div>
            `).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-form">
                    ${details}
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Send form data to server
    async function submitToServer(formData) {
        try {
            const response = await fetch('api/submit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage('Form submitted successfully! All your experience entries have been saved.');
                // Reset all data
                projects = [];
                procurements = [];
                budgets = [];
                updateProjectsTable();
                updateProcurementsTable();
                updateBudgetsTable();
            } else {
                showErrorMessage('Error submitting form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage('Error submitting form. Please check your internet connection and try again.');
        }
    }
    
    // Show success message
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<h3>Success!</h3><p>${message}</p>`;
        
        form.parentNode.insertBefore(successDiv, form);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // Show error message
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<h3>Error</h3><p>${message}</p>`;
        
        form.parentNode.insertBefore(errorDiv, form);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
});
