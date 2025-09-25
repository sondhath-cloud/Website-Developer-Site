// View responses page functionality
document.addEventListener('DOMContentLoaded', function() {
    const responsesList = document.getElementById('responsesList');
    const noResponses = document.getElementById('noResponses');
    const toggleViewBtn = document.getElementById('toggleView');
    const exportBtn = document.getElementById('exportData');
    const clearBtn = document.getElementById('clearData');
    
    let isTableView = false;
    let submissions = [];
    
    // Load submissions from server
    async function loadSubmissions() {
        try {
            const response = await fetch('https://sondrahathaway.com/experienceform/api/submissions.php');
            const data = await response.json();
            submissions = data;
            displaySubmissions();
        } catch (error) {
            console.error('Error loading submissions:', error);
            submissions = [];
            displaySubmissions();
        }
    }
    
    // Display submissions
    function displaySubmissions() {
        if (submissions.length === 0) {
            responsesList.style.display = 'none';
            noResponses.style.display = 'block';
            return;
        }
        
        responsesList.style.display = 'block';
        noResponses.style.display = 'none';
        
        if (isTableView) {
            displayTableView();
        } else {
            displayCardView();
        }
    }
    
    // Display card view
    function displayCardView() {
        responsesList.innerHTML = submissions.map((submission, index) => {
            const date = new Date(submission.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const projects = submission.projects || [];
            const procurements = submission.procurements || [];
            const budgets = submission.budgets || [];
            
            return `
                <div class="response-item">
                    <div class="response-header">
                        <h3 class="response-name">Submission #${index + 1}</h3>
                        <span class="response-date">${date}</span>
                    </div>
                    
                    <div class="response-summary">
                        <div class="summary-item">
                            <div class="summary-label">Projects</div>
                            <div class="summary-value">${projects.length} entries</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Procurements</div>
                            <div class="summary-value">${procurements.length} entries</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Budget Initiatives</div>
                            <div class="summary-value">${budgets.length} entries</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Experience</div>
                            <div class="summary-value">${projects.length + procurements.length + budgets.length} entries</div>
                        </div>
                    </div>
                    
                    <button class="toggle-details-btn" onclick="toggleDetails(${index})">
                        View Full Details
                    </button>
                    
                    <div class="response-details" id="details-${index}">
                        ${projects.length > 0 ? `
                        <div class="detail-section">
                            <h4>Project Management Experience (${projects.length} projects)</h4>
                            <div class="detail-content">
                                ${projects.map(project => `
                                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                        <h5 style="color: white; margin-bottom: 10px;">${project.name}</h5>
                                        <p><strong>Description:</strong> ${project.description}</p>
                                        <p><strong>Budget:</strong> ${project.budget}</p>
                                        <p><strong>Team Size:</strong> ${project.teamSize}</p>
                                        <p><strong>Duration:</strong> ${project.duration}</p>
                                        <p><strong>Status:</strong> ${project.status}</p>
                                        <p><strong>Methodologies:</strong> ${project.methodologies}</p>
                                        <p><strong>Challenges:</strong> ${project.challenges}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        ${procurements.length > 0 ? `
                        <div class="detail-section">
                            <h4>Procurement Experience (${procurements.length} procurements)</h4>
                            <div class="detail-content">
                                ${procurements.map(procurement => `
                                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                        <h5 style="color: white; margin-bottom: 10px;">${procurement.type}</h5>
                                        <p><strong>Description:</strong> ${procurement.description}</p>
                                        <p><strong>Value:</strong> ${procurement.value}</p>
                                        <p><strong>Vendor:</strong> ${procurement.vendor}</p>
                                        <p><strong>Status:</strong> ${procurement.status}</p>
                                        <p><strong>Date:</strong> ${procurement.date}</p>
                                        <p><strong>Compliance Notes:</strong> ${procurement.complianceNotes}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        ${budgets.length > 0 ? `
                        <div class="detail-section">
                            <h4>Budget & Cost Management Experience (${budgets.length} initiatives)</h4>
                            <div class="detail-content">
                                ${budgets.map(budget => `
                                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                        <h5 style="color: white; margin-bottom: 10px;">${budget.type}</h5>
                                        <p><strong>Description:</strong> ${budget.description}</p>
                                        <p><strong>Cost Savings:</strong> ${budget.costSavings}</p>
                                        <p><strong>Budget Managed:</strong> ${budget.budgetManaged}</p>
                                        <p><strong>Duration:</strong> ${budget.duration}</p>
                                        <p><strong>Status:</strong> ${budget.status}</p>
                                        <p><strong>KPIs:</strong> ${budget.kpis}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Display table view
    function displayTableView() {
        responsesList.innerHTML = `
            <div class="table-view">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>Submission ID</th>
                            <th>Projects</th>
                            <th>Procurements</th>
                            <th>Budget Initiatives</th>
                            <th>Total Entries</th>
                            <th>Submitted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${submissions.map((submission, index) => {
                            const date = new Date(submission.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });
                            
                            const projects = submission.projects || [];
                            const procurements = submission.procurements || [];
                            const budgets = submission.budgets || [];
                            
                            return `
                                <tr>
                                    <td>#${index + 1}</td>
                                    <td>${projects.length}</td>
                                    <td>${procurements.length}</td>
                                    <td>${budgets.length}</td>
                                    <td>${projects.length + procurements.length + budgets.length}</td>
                                    <td>${date}</td>
                                    <td>
                                        <div class="table-actions">
                                            <button class="table-action-btn" onclick="viewFullDetails(${index})">View</button>
                                            <button class="table-action-btn" onclick="deleteSubmission(${index})">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Format experience level
    function formatExperience(experience) {
        const experienceMap = {
            'less-than-1': 'Less than 1 year',
            '1-3': '1-3 years',
            '3-5': '3-5 years',
            '5-10': '5-10 years',
            '10-plus': 'More than 10 years'
        };
        return experienceMap[experience] || 'Not specified';
    }
    
    // Toggle details visibility
    window.toggleDetails = function(index) {
        const details = document.getElementById(`details-${index}`);
        const button = event.target;
        
        if (details.classList.contains('show')) {
            details.classList.remove('show');
            button.textContent = 'View Full Details';
        } else {
            details.classList.add('show');
            button.textContent = 'Hide Details';
        }
    };
    
    // View full details in modal (for table view)
    window.viewFullDetails = function(index) {
        const submission = submissions[index];
        const projects = submission.projects || [];
        const procurements = submission.procurements || [];
        const budgets = submission.budgets || [];
        
        const details = `
            <div class="response-item">
                <div class="response-header">
                    <h3 class="response-name">Submission #${index + 1}</h3>
                    <span class="response-date">${new Date(submission.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="response-details show">
                    ${projects.length > 0 ? `
                    <div class="detail-section">
                        <h4>Project Management Experience (${projects.length} projects)</h4>
                        <div class="detail-content">
                            ${projects.map(project => `
                                <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                    <h5 style="color: white; margin-bottom: 10px;">${project.name}</h5>
                                    <p><strong>Description:</strong> ${project.description}</p>
                                    <p><strong>Budget:</strong> ${project.budget}</p>
                                    <p><strong>Team Size:</strong> ${project.teamSize}</p>
                                    <p><strong>Duration:</strong> ${project.duration}</p>
                                    <p><strong>Status:</strong> ${project.status}</p>
                                    <p><strong>Methodologies:</strong> ${project.methodologies}</p>
                                    <p><strong>Challenges:</strong> ${project.challenges}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${procurements.length > 0 ? `
                    <div class="detail-section">
                        <h4>Procurement Experience (${procurements.length} procurements)</h4>
                        <div class="detail-content">
                            ${procurements.map(procurement => `
                                <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                    <h5 style="color: white; margin-bottom: 10px;">${procurement.type}</h5>
                                    <p><strong>Description:</strong> ${procurement.description}</p>
                                    <p><strong>Value:</strong> ${procurement.value}</p>
                                    <p><strong>Vendor:</strong> ${procurement.vendor}</p>
                                    <p><strong>Status:</strong> ${procurement.status}</p>
                                    <p><strong>Date:</strong> ${procurement.date}</p>
                                    <p><strong>Compliance Notes:</strong> ${procurement.complianceNotes}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${budgets.length > 0 ? `
                    <div class="detail-section">
                        <h4>Budget & Cost Management Experience (${budgets.length} initiatives)</h4>
                        <div class="detail-content">
                            ${budgets.map(budget => `
                                <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                    <h5 style="color: white; margin-bottom: 10px;">${budget.type}</h5>
                                    <p><strong>Description:</strong> ${budget.description}</p>
                                    <p><strong>Cost Savings:</strong> ${budget.costSavings}</p>
                                    <p><strong>Budget Managed:</strong> ${budget.budgetManaged}</p>
                                    <p><strong>Duration:</strong> ${budget.duration}</p>
                                    <p><strong>Status:</strong> ${budget.status}</p>
                                    <p><strong>KPIs:</strong> ${budget.kpis}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 20px; max-width: 800px; max-height: 80vh; overflow-y: auto; padding: 30px; position: relative;">
                <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: rgba(255, 255, 255, 0.2); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">×</button>
                ${details}
            </div>
        `;
        
        document.body.appendChild(modal);
    };
    
    // Delete submission
    window.deleteSubmission = async function(index) {
        if (confirm('Are you sure you want to delete this submission?')) {
            try {
                const response = await fetch(`https://sondrahathaway.com/experienceform/api/submissions.php/${index}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    submissions.splice(index, 1);
                    displaySubmissions();
                } else {
                    alert('Error deleting submission: ' + result.message);
                }
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Error deleting submission. Please try again.');
            }
        }
    };
    
    // Toggle view between table and card
    toggleViewBtn.addEventListener('click', function() {
        isTableView = !isTableView;
        toggleViewBtn.textContent = isTableView ? 'Switch to Card View' : 'Switch to Table View';
        displaySubmissions();
    });
    
    // Export data to CSV
    exportBtn.addEventListener('click', function() {
        if (submissions.length === 0) {
            alert('No data to export');
            return;
        }
        
        // Redirect to server endpoint for CSV download
        window.open('https://sondrahathaway.com/experienceform/api/export.php', '_blank');
    });
    
    // Generate CSV content
    function generateCSV() {
        const headers = [
            'Name', 'Email', 'Phone', 'Company', 'PM Experience', 'Procurement Experience',
            'Certifications', 'Project Description', 'Project Budget', 'Team Size',
            'Methodologies', 'Project Challenges', 'Success Metrics', 'Procurement Process',
            'Procurement Value', 'Software', 'Other Software', 'Compliance Approach',
            'Supplier Selection', 'Negotiation Experience', 'Supplier Conflict',
            'Cost Saving Initiative', 'Budget Control', 'Procurement KPIs',
            'Risk Mitigation', 'Risk Example', 'Stakeholder Communication',
            'Stakeholder Expectations', 'Continuous Learning', 'Recent Development',
            'Additional Info', 'References', 'Submitted Date'
        ];
        
        const rows = submissions.map(submission => [
            submission.personalInfo.fullName,
            submission.personalInfo.email,
            submission.personalInfo.phone || '',
            submission.personalInfo.company || '',
            formatExperience(submission.experience.pmExperience),
            formatExperience(submission.experience.procurementExperience),
            submission.experience.certifications || '',
            submission.projectManagement.significantProject,
            submission.projectManagement.projectBudget || '',
            submission.projectManagement.projectTeamSize || '',
            submission.projectManagement.methodologies,
            submission.projectManagement.projectChallenges,
            submission.projectManagement.projectSuccess || '',
            submission.procurement.procurementProcess,
            submission.procurement.procurementValue || '',
            submission.procurement.procurementSoftware.join('; '),
            submission.procurement.otherSoftware || '',
            submission.procurement.complianceApproach,
            submission.procurement.supplierSelection,
            submission.procurement.negotiationExperience || '',
            submission.procurement.supplierConflict || '',
            submission.budgetManagement.costSavingInitiative,
            submission.budgetManagement.budgetControl || '',
            submission.budgetManagement.procurementKPIs || '',
            submission.riskManagement.riskMitigation,
            submission.riskManagement.riskExample || '',
            submission.stakeholderManagement.stakeholderCommunication,
            submission.stakeholderManagement.stakeholderExpectations || '',
            submission.professionalDevelopment.continuousLearning || '',
            submission.professionalDevelopment.recentDevelopment || '',
            submission.additionalInfo.additionalInfo || '',
            submission.additionalInfo.references || '',
            new Date(submission.timestamp).toLocaleString()
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
            .join('\n');
        
        return csvContent;
    }
    
    // Clear all data
    clearBtn.addEventListener('click', async function() {
        if (confirm('Are you sure you want to clear all form submissions? This action cannot be undone.')) {
            try {
                const response = await fetch('https://sondrahathaway.com/experienceform/api/submissions.php', {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    submissions = [];
                    displaySubmissions();
                } else {
                    alert('Error clearing submissions: ' + result.message);
                }
            } catch (error) {
                console.error('Error clearing submissions:', error);
                alert('Error clearing submissions. Please try again.');
            }
        }
    });
    
    // Load submissions on page load
    loadSubmissions();
});
