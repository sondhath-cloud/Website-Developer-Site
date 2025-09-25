// Stakeholder Impact Identification Tool
class StakeholderTool {
    constructor() {
        this.selectedStakeholders = [];
        this.totalStakeholders = window.CONFIG?.TOTAL_STAKEHOLDERS || 12;
        this.currentStakeholder = null;
        this.supabase = null;
        this.sessionId = this.generateSessionId();
        
        this.initializeSupabase();
        this.initializeEventListeners();
        this.loadExistingData();
        this.updateProgress();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async initializeSupabase() {
        const SUPABASE_URL = window.CONFIG?.SUPABASE_URL || 'YOUR_SUPABASE_URL';
        const SUPABASE_ANON_KEY = window.CONFIG?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
        
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || !SUPABASE_URL) {
            console.warn('Supabase credentials not configured. Data will be stored locally only.');
            return;
        }
        
        try {
            this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase initialized successfully');
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }
    }

    async loadExistingData() {
        if (!this.supabase) {
            // Load from localStorage as fallback
            const savedData = localStorage.getItem('stakeholderData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.selectedStakeholders = data.stakeholders || [];
                this.updateResults();
                this.updateCompletedStakeholders();
                this.updateMainDataTable();
                this.updateRoleFilterOptions();
                
                // Add custom avatars to row
                this.selectedStakeholders.forEach(stakeholder => {
                    if (stakeholder.isCustom) {
                        this.addCustomAvatarToRow(stakeholder);
                    }
                });
            }
            return;
        }

        try {
            const { data, error } = await this.supabase
                .from('stakeholders')
                .select('*')
                .eq('session_id', this.sessionId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            this.selectedStakeholders = data || [];
            this.updateResults();
            this.updateCompletedStakeholders();
            this.updateMainDataTable();
            this.updateRoleFilterOptions();
            
            // Mark avatars as selected and add custom avatars
            this.selectedStakeholders.forEach(stakeholder => {
                if (stakeholder.isCustom) {
                    // Add custom avatar to row if it doesn't exist
                    const existingCustomAvatar = document.querySelector(`[data-role="${stakeholder.role}"][data-custom="true"]`);
                    if (!existingCustomAvatar) {
                        this.addCustomAvatarToRow(stakeholder);
                    }
                }
                
                const avatar = document.querySelector(`[data-role="${stakeholder.role}"]`);
                if (avatar) {
                    avatar.setAttribute('data-selected', 'true');
                    avatar.classList.add('selected');
                }
            });
        } catch (error) {
            console.error('Error loading data from Supabase:', error);
        }
    }

    initializeEventListeners() {
        // Avatar selection
        const avatars = document.querySelectorAll('.img-wrap');
        avatars.forEach(avatar => {
            avatar.addEventListener('click', (e) => this.handleAvatarClick(e));
        });

        // Modal controls
        const cancelBtn = document.getElementById('cancelBtn');
        const modal = document.getElementById('cardModal');
        const form = document.getElementById('stakeholderForm');

        cancelBtn.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Form field change listeners for visual feedback
        const formFields = form.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', () => this.updateFieldVisualFeedback(field));
            field.addEventListener('blur', () => this.updateFieldVisualFeedback(field));
        });

        // Table button event listeners
        const showTableBtn = document.getElementById('showTableBtn');
        const hideTableBtn = document.getElementById('hideTableBtn');
        const exportDataBtn = document.getElementById('exportDataBtn');

        if (showTableBtn) {
            showTableBtn.addEventListener('click', () => this.showMainDataTable());
        }

        if (hideTableBtn) {
            hideTableBtn.addEventListener('click', () => this.hideMainDataTable());
        }

        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }

        // Search and filter event listeners
        const searchInput = document.getElementById('stakeholderSearch');
        const clearSearchBtn = document.getElementById('clearSearch');
        const completionFilter = document.getElementById('completionFilter');
        const roleFilter = document.getElementById('roleFilter');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const clearAllFiltersBtn = document.getElementById('clearAllFilters');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => this.clearSearch());
        }

        if (completionFilter) {
            completionFilter.addEventListener('change', () => this.handleFilter());
        }

        if (roleFilter) {
            roleFilter.addEventListener('change', () => this.handleFilter());
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }

        if (clearAllFiltersBtn) {
            clearAllFiltersBtn.addEventListener('click', () => this.resetFilters());
        }

        // Custom group event listeners
        const addCustomGroupBtn = document.getElementById('addCustomGroupBtn');
        const customGroupModal = document.getElementById('customGroupModal');
        const closeCustomGroupModal = document.getElementById('closeCustomGroupModal');
        const cancelCustomGroup = document.getElementById('cancelCustomGroup');
        const createCustomGroup = document.getElementById('createCustomGroup');

        if (addCustomGroupBtn) {
            addCustomGroupBtn.addEventListener('click', () => this.showCustomGroupModal());
        }

        if (closeCustomGroupModal) {
            closeCustomGroupModal.addEventListener('click', () => this.closeCustomGroupModal());
        }

        if (cancelCustomGroup) {
            cancelCustomGroup.addEventListener('click', () => this.closeCustomGroupModal());
        }

        if (createCustomGroup) {
            createCustomGroup.addEventListener('click', () => this.createCustomGroup());
        }

        if (customGroupModal) {
            customGroupModal.addEventListener('click', (e) => {
                if (e.target === customGroupModal) this.closeCustomGroupModal();
            });
        }

        // Avatar style selection
        const avatarOptions = document.querySelectorAll('.avatar-option');
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => this.selectAvatarStyle(option));
        });

        // Card flip interaction - click anywhere on card to flip
        const card = document.getElementById('stakeholderCard');
        card.addEventListener('click', (e) => {
            // Don't flip if clicking on form elements or flip buttons
            if (e.target.closest('form') || e.target.closest('.flip-button')) {
                return;
            }
            this.flipCard();
        });

        // Impact level change (if element exists)
        const impactSelect = document.getElementById('impactLevelSelect');
        if (impactSelect) {
            impactSelect.addEventListener('change', (e) => this.updateImpactLevel(e.target.value));
        }
    }

    handleAvatarClick(e) {
        const avatar = e.currentTarget;
        const role = avatar.getAttribute('data-role');
        const isSelected = avatar.getAttribute('data-selected') === 'true';

        if (isSelected) {
            // Already selected, show existing stakeholder
            const existingStakeholder = this.selectedStakeholders.find(s => s.role === role);
            if (existingStakeholder) {
                this.showStakeholderCard(existingStakeholder);
            }
        } else {
            // New selection, create new stakeholder
            this.currentStakeholder = {
                role: role,
                avatar: avatar.querySelector('img').src,
                groupName: role,
                fearsConcerns: 'TBD',
                controlAutonomy: 'TBD',
                competingPriorities: 'TBD',
                communicationMethod: 'TBD',
                risksMissedOpportunities: 'TBD',
                workingWellToday: 'TBD',
                metricsExpectations: 'TBD',
                identityStatusBelonging: 'TBD',
                trainingToolsCoaching: 'TBD',
                recognitionIncentives: 'TBD',
                personalProfessionalImpact: 'TBD',
                newSkillsBehaviors: 'TBD',
                trustInLeadership: 'TBD',
                whatTheyLose: 'TBD',
                currentVsFuture: 'TBD',
                transitionObstacles: 'TBD'
            };
            this.showStakeholderCard(this.currentStakeholder);
        }
    }

    showStakeholderCard(stakeholder) {
        const modal = document.getElementById('cardModal');
        const selectedAvatar = document.getElementById('selectedAvatar');
        const stakeholderRole = document.getElementById('stakeholderRole');
        const form = document.getElementById('stakeholderForm');

        // Update avatar
        selectedAvatar.innerHTML = `<img src="${stakeholder.avatar}" alt="${stakeholder.role}">`;
        
        
        // Update avatar display on card front (avatar only, no group name)
        const stakeholderAvatarDisplay = document.getElementById('stakeholderAvatarDisplay');
        stakeholderAvatarDisplay.innerHTML = `
            <img src="${stakeholder.avatar}" alt="${stakeholder.role}" class="avatar">
        `;
        
        // Update the stakeholder name in the card header (back only)
        const stakeholderName = document.querySelector('.card-front .stakeholder-name');
        if (stakeholderName) {
            stakeholderName.textContent = 'Stakeholder Details';
        }
        
        // Update the stakeholder name in the card back (avatar side)
        const cardBackStakeholderName = document.querySelector('.card-back .stakeholder-name');
        if (cardBackStakeholderName) {
            cardBackStakeholderName.textContent = stakeholder.groupName || stakeholder.role;
        }
        
        // Update the card bottom text to show "Impact Analysis" (static)
        const cardBottomTextBlack = document.getElementById('cardBottomTextBlack');
        const cardBottomTextYellow = document.getElementById('cardBottomTextYellow');
        if (cardBottomTextBlack) cardBottomTextBlack.textContent = 'Impact Analysis';
        if (cardBottomTextYellow) cardBottomTextYellow.textContent = 'Impact Analysis';
        
        // Populate form if stakeholder has data
        if (stakeholder.groupName) {
            document.getElementById('groupName').value = stakeholder.groupName;
            document.getElementById('fearsConcerns').value = stakeholder.fearsConcerns || 'TBD';
            document.getElementById('controlAutonomy').value = stakeholder.controlAutonomy || 'TBD';
            document.getElementById('competingPriorities').value = stakeholder.competingPriorities || 'TBD';
            document.getElementById('communicationMethod').value = stakeholder.communicationMethod || 'TBD';
            document.getElementById('risksMissedOpportunities').value = stakeholder.risksMissedOpportunities || 'TBD';
            document.getElementById('workingWellToday').value = stakeholder.workingWellToday || 'TBD';
            document.getElementById('metricsExpectations').value = stakeholder.metricsExpectations || 'TBD';
            document.getElementById('identityStatusBelonging').value = stakeholder.identityStatusBelonging || 'TBD';
            document.getElementById('trainingToolsCoaching').value = stakeholder.trainingToolsCoaching || 'TBD';
            document.getElementById('recognitionIncentives').value = stakeholder.recognitionIncentives || 'TBD';
            document.getElementById('personalProfessionalImpact').value = stakeholder.personalProfessionalImpact || 'TBD';
            document.getElementById('newSkillsBehaviors').value = stakeholder.newSkillsBehaviors || 'TBD';
            document.getElementById('trustInLeadership').value = stakeholder.trustInLeadership || 'TBD';
            document.getElementById('whatTheyLose').value = stakeholder.whatTheyLose || 'TBD';
            document.getElementById('currentVsFuture').value = stakeholder.currentVsFuture || 'TBD';
            document.getElementById('transitionObstacles').value = stakeholder.transitionObstacles || 'TBD';
        } else {
            // Reset form for new stakeholder but auto-populate group name
            form.reset();
            document.getElementById('groupName').value = stakeholder.role;
        }

        // Show modal
        modal.classList.add('active');
        
        // Reset card to front (form) side
        const card = document.getElementById('stakeholderCard');
        card.classList.remove('flipped');
        
        // Initialize visual feedback for all fields
        setTimeout(() => {
            const formFields = form.querySelectorAll('input, textarea');
            formFields.forEach(field => {
                this.updateFieldVisualFeedback(field);
            });
        }, 100);
    }

    flipCard() {
        const card = document.getElementById('stakeholderCard');
        card.classList.toggle('flipped');
    }

    updateFieldVisualFeedback(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        const isCompleted = value && value !== 'TBD' && value.length > 0;
        
        // Remove existing classes
        field.classList.remove('completed', 'incomplete');
        formGroup.classList.remove('completed', 'incomplete');
        
        // Add appropriate class
        if (isCompleted) {
            field.classList.add('completed');
            formGroup.classList.add('completed');
        } else if (value.length > 0) {
            field.classList.add('incomplete');
            formGroup.classList.add('incomplete');
        }
        
        // Update form progress
        this.updateFormProgress();
    }

    updateFormProgress() {
        const form = document.getElementById('stakeholderForm');
        const formProgress = document.getElementById('formProgress');
        const formProgressFill = document.getElementById('formProgressFill');
        const formProgressText = document.getElementById('formProgressText');
        
        if (!form || !formProgress || !formProgressFill || !formProgressText) return;
        
        const fields = form.querySelectorAll('input, textarea');
        const totalFields = fields.length;
        let completedFields = 0;
        
        fields.forEach(field => {
            const value = field.value.trim();
            if (value && value !== 'TBD' && value.length > 0) {
                completedFields++;
            }
        });
        
        const percentage = Math.round((completedFields / totalFields) * 100);
        
        formProgressFill.style.width = `${percentage}%`;
        formProgressText.textContent = `${percentage}% Complete (${completedFields}/${totalFields} fields)`;
        
        // Show progress bar if any fields have been filled
        if (completedFields > 0) {
            formProgress.style.display = 'block';
        } else {
            formProgress.style.display = 'none';
        }
    }


    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const stakeholderData = {
            role: this.currentStakeholder.role,
            avatar: this.currentStakeholder.avatar,
            groupName: formData.get('groupName'),
            fearsConcerns: formData.get('fearsConcerns'),
            controlAutonomy: formData.get('controlAutonomy'),
            competingPriorities: formData.get('competingPriorities'),
            communicationMethod: formData.get('communicationMethod'),
            risksMissedOpportunities: formData.get('risksMissedOpportunities'),
            workingWellToday: formData.get('workingWellToday'),
            metricsExpectations: formData.get('metricsExpectations'),
            identityStatusBelonging: formData.get('identityStatusBelonging'),
            trainingToolsCoaching: formData.get('trainingToolsCoaching'),
            recognitionIncentives: formData.get('recognitionIncentives'),
            personalProfessionalImpact: formData.get('personalProfessionalImpact'),
            newSkillsBehaviors: formData.get('newSkillsBehaviors'),
            trustInLeadership: formData.get('trustInLeadership'),
            whatTheyLose: formData.get('whatTheyLose'),
            currentVsFuture: formData.get('currentVsFuture'),
            transitionObstacles: formData.get('transitionObstacles'),
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
        };

        // Check if this stakeholder already exists
        const existingIndex = this.selectedStakeholders.findIndex(s => s.role === stakeholderData.role);
        
        try {
            if (this.supabase) {
                // Save to Supabase
                if (existingIndex >= 0) {
                    // Update existing stakeholder
                    const { error } = await this.supabase
                        .from('stakeholders')
                        .update(stakeholderData)
                        .eq('role', stakeholderData.role)
                        .eq('session_id', this.sessionId);
                    
                    if (error) throw error;
                    this.selectedStakeholders[existingIndex] = stakeholderData;
                } else {
                    // Insert new stakeholder
                    const { error } = await this.supabase
                        .from('stakeholders')
                        .insert([stakeholderData]);
                    
                    if (error) throw error;
                    this.selectedStakeholders.push(stakeholderData);
                    
                    // Mark avatar as selected
                    const avatar = document.querySelector(`[data-role="${stakeholderData.role}"]`);
                    if (avatar) {
                        avatar.setAttribute('data-selected', 'true');
                        avatar.classList.add('selected');
                    }
                }
            } else {
                // Fallback to localStorage
                if (existingIndex >= 0) {
                    this.selectedStakeholders[existingIndex] = stakeholderData;
                } else {
                    this.selectedStakeholders.push(stakeholderData);
                    
                    // Mark avatar as selected
                    const avatar = document.querySelector(`[data-role="${stakeholderData.role}"]`);
                    if (avatar) {
                        avatar.setAttribute('data-selected', 'true');
                        avatar.classList.add('selected');
                    }
                }
                
                // Save to localStorage
                localStorage.setItem('stakeholderData', JSON.stringify({
                    sessionId: this.sessionId,
                    stakeholders: this.selectedStakeholders
                }));
            }

            // Update progress
            this.updateProgress();
            
            // Update results section
            this.updateResults();
            
            // Update completed stakeholders grid
            this.updateCompletedStakeholders();
            
            // Update main data table
            this.updateMainDataTable();
            
            // Close modal
            this.closeModal();
            
            // Show success message
            this.showSuccessMessage(stakeholderData.role);
            
        } catch (error) {
            console.error('Error saving stakeholder data:', error);
            alert('Error saving data. Please try again.');
        }
    }

    closeModal() {
        const modal = document.getElementById('cardModal');
        modal.classList.remove('active');
        
        // Reset card to back side
        const card = document.getElementById('stakeholderCard');
        card.classList.remove('flipped');
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const completed = this.selectedStakeholders.length;
        const percentage = (completed / this.totalStakeholders) * 100;
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${completed} of ${this.totalStakeholders} stakeholders identified`;
        
        // Show completion celebration if all stakeholders are identified
        if (completed === this.totalStakeholders) {
            this.showCompletionCelebration();
        }
    }

    updateResults() {
        // Results section was removed, so we'll skip this method
        // The completed stakeholders grid will handle displaying the data
        return;
    }

    updateCompletedStakeholders() {
        const completedGrid = document.getElementById('completedGrid');
        
        if (this.selectedStakeholders.length === 0) {
            completedGrid.innerHTML = '<div class="no-stakeholders">No stakeholders completed yet</div>';
            return;
        }

        // Apply current filters
        this.applyFilters();
    }

    updateMainDataTable() {
        const tableBody = document.getElementById('stakeholderTableBody');
        const showTableBtn = document.getElementById('showTableBtn');
        
        if (!tableBody || !showTableBtn) {
            console.log('Table elements not found');
            return;
        }
        
        if (this.selectedStakeholders.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="1" class="text-center">No stakeholders completed yet</td></tr>';
            showTableBtn.style.display = 'none';
            return;
        }

        showTableBtn.style.display = 'inline-block';
        
        // Update table header with stakeholder roles
        const tableHead = document.getElementById('stakeholderTableHead');
        const headerRow = tableHead.querySelector('tr');
        headerRow.innerHTML = `
            <th>Questions</th>
            ${this.selectedStakeholders.map(stakeholder => `
                <th class="role-header">${stakeholder.role}</th>
            `).join('')}
        `;
        
        // Create transposed table - questions as rows, stakeholders as columns
        const questions = [
            { key: 'groupName', question: 'Group Name' },
            { key: 'fearsConcerns', question: 'Fears/Concerns' },
            { key: 'controlAutonomy', question: 'Control/Autonomy' },
            { key: 'competingPriorities', question: 'Competing Priorities' },
            { key: 'communicationMethod', question: 'Communication Method' },
            { key: 'risksMissedOpportunities', question: 'Risks/Missed Opportunities' },
            { key: 'workingWellToday', question: 'Working Well Today' },
            { key: 'metricsExpectations', question: 'Metrics/Expectations' },
            { key: 'identityStatusBelonging', question: 'Identity/Status' },
            { key: 'trainingToolsCoaching', question: 'Training/Coaching' },
            { key: 'recognitionIncentives', question: 'Recognition/Incentives' },
            { key: 'personalProfessionalImpact', question: 'Personal/Professional Impact' },
            { key: 'newSkillsBehaviors', question: 'New Skills/Behaviors' },
            { key: 'trustInLeadership', question: 'Trust in Leadership' },
            { key: 'whatTheyLose', question: 'What They Lose' },
            { key: 'currentVsFuture', question: 'Current vs Future' },
            { key: 'transitionObstacles', question: 'Transition Obstacles' }
        ];

        tableBody.innerHTML = questions.map(question => `
            <tr>
                <td class="question-cell">${question.question}</td>
                ${this.selectedStakeholders.map(stakeholder => `
                    <td class="data-cell">${stakeholder[question.key] || 'TBD'}</td>
                `).join('')}
            </tr>
        `).join('');

        // Add a row for actions
        tableBody.innerHTML += `
            <tr>
                <td class="question-cell">Actions</td>
                ${this.selectedStakeholders.map(stakeholder => `
                    <td>
                        <button class="edit-btn" data-role="${stakeholder.role}">Edit</button>
                    </td>
                `).join('')}
            </tr>
        `;

        // Add click handlers to edit buttons in table
        const tableEditButtons = document.querySelectorAll('#stakeholderTableBody .edit-btn');
        tableEditButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const role = button.getAttribute('data-role');
                const stakeholder = this.selectedStakeholders.find(s => s.role === role);
                if (stakeholder) {
                    this.showStakeholderCard(stakeholder);
                }
            });
        });
    }

    showMainDataTable() {
        const dataTableSection = document.getElementById('dataTableSection');
        const showTableBtn = document.getElementById('showTableBtn');
        
        dataTableSection.style.display = 'block';
        showTableBtn.style.display = 'none';
        
        // Scroll to table
        dataTableSection.scrollIntoView({ behavior: 'smooth' });
    }

    hideMainDataTable() {
        const dataTableSection = document.getElementById('dataTableSection');
        const showTableBtn = document.getElementById('showTableBtn');
        
        dataTableSection.style.display = 'none';
        showTableBtn.style.display = 'inline-block';
    }

    exportData() {
        if (this.selectedStakeholders.length === 0) {
            alert('No data to export');
            return;
        }

        // Create CSV content
        const headers = [
            'Role', 'Group Name', 'Fears/Concerns', 'Control/Autonomy', 'Competing Priorities',
            'Communication Method', 'Risks/Missed Opportunities', 'Working Well Today',
            'Metrics/Expectations', 'Identity/Status', 'Training/Coaching', 'Recognition/Incentives',
            'Personal/Professional Impact', 'New Skills/Behaviors', 'Trust in Leadership',
            'What They Lose', 'Current vs Future', 'Transition Obstacles'
        ];

        const csvContent = [
            headers.join(','),
            ...this.selectedStakeholders.map(stakeholder => [
                stakeholder.role,
                stakeholder.groupName || 'TBD',
                `"${(stakeholder.fearsConcerns || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.controlAutonomy || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.competingPriorities || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.communicationMethod || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.risksMissedOpportunities || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.workingWellToday || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.metricsExpectations || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.identityStatusBelonging || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.trainingToolsCoaching || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.recognitionIncentives || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.personalProfessionalImpact || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.newSkillsBehaviors || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.trustInLeadership || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.whatTheyLose || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.currentVsFuture || 'TBD').replace(/"/g, '""')}"`,
                `"${(stakeholder.transitionObstacles || 'TBD').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stakeholder-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    showSuccessMessage(role) {
        // Create temporary success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #8BC34A);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = `✓ ${role} stakeholder added successfully!`;
        
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }

    showCompletionCelebration() {
        const celebration = document.getElementById('completionCelebration');
        celebration.style.display = 'block';
        
        // Add confetti effect (simple version)
        this.createConfetti();
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    createConfetti() {
        const colors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#2196F3', '#9C27B0'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    z-index: 1002;
                    animation: confettiFall 3s linear forwards;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
    }

    exportResults() {
        const data = {
            timestamp: new Date().toISOString(),
            totalStakeholders: this.selectedStakeholders.length,
            stakeholders: this.selectedStakeholders
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stakeholder-analysis-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Search and Filter Methods
    handleSearch() {
        this.applyFilters();
    }

    clearSearch() {
        const searchInput = document.getElementById('stakeholderSearch');
        if (searchInput) {
            searchInput.value = '';
            this.applyFilters();
        }
    }

    handleFilter() {
        this.applyFilters();
    }

    resetFilters() {
        const searchInput = document.getElementById('stakeholderSearch');
        const completionFilter = document.getElementById('completionFilter');
        const roleFilter = document.getElementById('roleFilter');
        
        if (searchInput) searchInput.value = '';
        if (completionFilter) completionFilter.value = 'all';
        if (roleFilter) roleFilter.value = 'all';
        
        this.applyFilters();
    }

    applyFilters() {
        const searchInput = document.getElementById('stakeholderSearch');
        const completionFilter = document.getElementById('completionFilter');
        const roleFilter = document.getElementById('roleFilter');
        const completedGrid = document.getElementById('completedGrid');
        const noResults = document.getElementById('noResults');
        const clearSearchBtn = document.getElementById('clearSearch');
        
        if (!searchInput || !completionFilter || !roleFilter || !completedGrid) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        const completionValue = completionFilter.value;
        const roleValue = roleFilter.value;
        
        // Show/hide clear search button
        if (clearSearchBtn) {
            clearSearchBtn.classList.toggle('visible', searchTerm.length > 0);
        }
        
        // Filter stakeholders
        const filteredStakeholders = this.selectedStakeholders.filter(stakeholder => {
            // Search filter
            const matchesSearch = !searchTerm || 
                stakeholder.role.toLowerCase().includes(searchTerm) ||
                (stakeholder.groupName && stakeholder.groupName.toLowerCase().includes(searchTerm));
            
            // Role filter
            const matchesRole = roleValue === 'all' || stakeholder.role === roleValue;
            
            // Completion filter
            let matchesCompletion = true;
            if (completionValue !== 'all') {
                const questions = [
                    'groupName', 'fearsConcerns', 'controlAutonomy', 'competingPriorities',
                    'communicationMethod', 'risksMissedOpportunities', 'workingWellToday',
                    'metricsExpectations', 'identityStatusBelonging', 'trainingToolsCoaching',
                    'recognitionIncentives', 'personalProfessionalImpact', 'newSkillsBehaviors',
                    'trustInLeadership', 'whatTheyLose', 'currentVsFuture', 'transitionObstacles'
                ];
                
                const completedFields = questions.filter(q => 
                    stakeholder[q] && stakeholder[q] !== 'TBD' && stakeholder[q].trim().length > 0
                ).length;
                
                const totalFields = questions.length;
                const completionPercentage = (completedFields / totalFields) * 100;
                
                switch (completionValue) {
                    case 'completed':
                        matchesCompletion = completionPercentage === 100;
                        break;
                    case 'partial':
                        matchesCompletion = completionPercentage > 0 && completionPercentage < 100;
                        break;
                    case 'incomplete':
                        matchesCompletion = completionPercentage === 0;
                        break;
                }
            }
            
            return matchesSearch && matchesRole && matchesCompletion;
        });
        
        // Update display
        if (filteredStakeholders.length === 0) {
            completedGrid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
        } else {
            completedGrid.style.display = 'flex';
            if (noResults) noResults.style.display = 'none';
            this.renderFilteredStakeholders(filteredStakeholders);
        }
    }

    renderFilteredStakeholders(stakeholders) {
        const completedGrid = document.getElementById('completedGrid');
        
        completedGrid.innerHTML = stakeholders.map(stakeholder => {
            const questions = [
                { key: 'groupName', question: 'Group Name' },
                { key: 'fearsConcerns', question: 'What fears, concerns, or uncertainties might they have?' },
                { key: 'controlAutonomy', question: 'What degree of control or autonomy will they lose or gain?' },
                { key: 'competingPriorities', question: 'What competing priorities might limit their capacity for change?' },
                { key: 'communicationMethod', question: 'What\'s the best way to communicate with them about progress and decisions?' },
                { key: 'risksMissedOpportunities', question: 'If nothing changes, what risks or missed opportunities will they face?' },
                { key: 'workingWellToday', question: 'What\'s working well today that they wouldn\'t want disrupted?' },
                { key: 'metricsExpectations', question: 'What metrics or performance expectations will change?' },
                { key: 'identityStatusBelonging', question: 'How might the change affect their sense of identity, status, or belonging?' },
                { key: 'trainingToolsCoaching', question: 'What training, tools, or coaching would help them adapt more smoothly?' },
                { key: 'recognitionIncentives', question: 'What recognition or incentives will matter most to them during the transition?' },
                { key: 'personalProfessionalImpact', question: 'How will success or failure reflect on them personally and professionally?' },
                { key: 'newSkillsBehaviors', question: 'Will new skills, behaviors, or mindsets be required?' },
                { key: 'trustInLeadership', question: 'How much trust do they place in leadership to guide the change?' },
                { key: 'whatTheyLose', question: 'What does this group stand to lose during this transition?' },
                { key: 'currentVsFuture', question: 'How does this group operate today that will be expected to change tomorrow?' },
                { key: 'transitionObstacles', question: 'What obstacles stand in the way of a smooth transition?' }
            ];

            const completedFields = questions.filter(q => stakeholder[q.key] && stakeholder[q.key] !== 'TBD');
            const completionPercentage = Math.round((completedFields.length / questions.length) * 100);
            
            return `
                <div class="completed-stakeholder-card" data-role="${stakeholder.role}">
                    <div class="stakeholder-header">
                        <img src="${stakeholder.avatar}" alt="${stakeholder.role}" class="avatar">
                        <div class="stakeholder-info">
                            <div class="role">${stakeholder.role}</div>
                            <div class="group-name">${stakeholder.groupName || 'TBD'}</div>
                            <div class="completion-badge ${completionPercentage === 100 ? 'completed' : completionPercentage > 0 ? 'partial' : 'incomplete'}">
                                ${completionPercentage}% Complete
                            </div>
                        </div>
                    </div>
                    
                    ${completedFields.length > 0 ? `
                        <div class="stakeholder-details">
                            <h4>Stakeholder Analysis</h4>
                            <div class="questions-table">
                                ${completedFields.map(field => `
                                    <div class="question-row">
                                        <div class="question">${field.question}</div>
                                        <div class="answer">${stakeholder[field.key]}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="no-data">No completed responses yet</div>
                    `}
                    
                    <div class="card-actions">
                        <button class="edit-btn" data-role="${stakeholder.role}">Edit</button>
                        <button class="expand-toggle">${completedFields.length > 0 ? 'Show Details' : 'No Details'}</button>
                    </div>
                </div>
            `;
        }).join('');

        // Re-add event listeners for the filtered results
        this.addStakeholderCardEventListeners();
    }

    addStakeholderCardEventListeners() {
        // Add click handlers to edit buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const role = button.getAttribute('data-role');
                const stakeholder = this.selectedStakeholders.find(s => s.role === role);
                if (stakeholder) {
                    this.showStakeholderCard(stakeholder);
                }
            });
        });

        // Add click handlers to expand buttons
        const expandButtons = document.querySelectorAll('.expand-toggle');
        expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.completed-stakeholder-card');
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    card.classList.remove('expanded');
                    button.textContent = 'Show Details';
                } else {
                    card.classList.add('expanded');
                    button.textContent = 'Hide Details';
                }
            });
        });

        // Add click handlers to cards for editing (show form)
        const cards = document.querySelectorAll('.completed-stakeholder-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-actions')) {
                    const role = card.getAttribute('data-role');
                    const stakeholder = this.selectedStakeholders.find(s => s.role === role);
                    if (stakeholder) {
                        this.showStakeholderCard(stakeholder);
                    }
                }
            });
        });
    }

    // Custom Group Methods
    showCustomGroupModal() {
        const modal = document.getElementById('customGroupModal');
        if (modal) {
            modal.classList.add('active');
            // Reset form
            this.resetCustomGroupForm();
        }
    }

    closeCustomGroupModal() {
        const modal = document.getElementById('customGroupModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    resetCustomGroupForm() {
        const groupName = document.getElementById('customGroupName');
        
        if (groupName) groupName.value = '';
        
        // Reset avatar style selection
        const avatarOptions = document.querySelectorAll('.avatar-option');
        avatarOptions.forEach(option => option.classList.remove('selected'));
        
        // Select professional as default
        const professionalOption = document.querySelector('.avatar-option[data-style="professional"]');
        if (professionalOption) {
            professionalOption.classList.add('selected');
        }
    }

    selectAvatarStyle(option) {
        // Remove selected class from all options
        const allOptions = document.querySelectorAll('.avatar-option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        option.classList.add('selected');
    }

    generateCustomAvatar(style, role) {
        // Generate avatar URL based on style and role
        const baseUrl = 'https://avataaars.io/?avatarStyle=Transparent';
        
        const avatarConfigs = {
            professional: {
                topType: 'ShortHairShortFlat',
                accessoriesType: 'Blank',
                hairColor: 'BrownDark',
                facialHairType: 'Blank',
                clotheType: 'BlazerShirt',
                clotheColor: 'Black',
                eyeType: 'Default',
                eyebrowType: 'Default',
                mouthType: 'Default',
                skinColor: 'Light'
            },
            casual: {
                topType: 'LongHairNotTooLong',
                accessoriesType: 'Blank',
                hairColor: 'Brown',
                facialHairType: 'Blank',
                clotheType: 'Hoodie',
                clotheColor: 'Gray02',
                eyeType: 'Default',
                eyebrowType: 'Default',
                mouthType: 'Smile',
                skinColor: 'Light'
            },
            technical: {
                topType: 'ShortHairShortFlat',
                accessoriesType: 'Prescription02',
                hairColor: 'Black',
                facialHairType: 'BeardLight',
                clotheType: 'ShirtCrewNeck',
                clotheColor: 'Gray02',
                eyeType: 'Default',
                eyebrowType: 'Default',
                mouthType: 'Serious',
                skinColor: 'Light'
            },
            executive: {
                topType: 'ShortHairShortFlat',
                accessoriesType: 'Blank',
                hairColor: 'BrownDark',
                facialHairType: 'BeardMedium',
                clotheType: 'BlazerSweater',
                clotheColor: 'Black',
                eyeType: 'Default',
                eyebrowType: 'Default',
                mouthType: 'Serious',
                skinColor: 'Light'
            }
        };

        const config = avatarConfigs[style] || avatarConfigs.professional;
        
        // Add some randomness for variety
        const skinColors = ['Pale', 'Light', 'Brown', 'DarkBrown', 'Black'];
        const hairColors = ['Black', 'Brown', 'BrownDark', 'Blonde', 'BlondeGolden', 'Auburn'];
        
        config.skinColor = skinColors[Math.floor(Math.random() * skinColors.length)];
        config.hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
        
        // Build URL
        const params = Object.entries(config)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
            
        return `${baseUrl}&${params}`;
    }

    async createCustomGroup() {
        const groupName = document.getElementById('customGroupName');
        const selectedAvatarOption = document.querySelector('.avatar-option.selected');
        
        if (!groupName || !selectedAvatarOption) return;
        
        const name = groupName.value.trim();
        const avatarStyle = selectedAvatarOption.getAttribute('data-style');
        
        // Validation
        if (!name) {
            alert('Please enter a group name.');
            return;
        }
        
        // Generate a role from the group name (use the name as role)
        const role = name;
        
        // Check if role already exists
        const existingStakeholder = this.selectedStakeholders.find(s => s.role === role);
        if (existingStakeholder) {
            alert('A stakeholder group with this name already exists. Please choose a different name.');
            return;
        }
        
        // Generate avatar
        const avatarUrl = this.generateCustomAvatar(avatarStyle, role);
        
        // Create custom stakeholder
        const customStakeholder = {
            role: role,
            groupName: name,
            avatar: avatarUrl,
            isCustom: true,
            fearsConcerns: 'TBD',
            controlAutonomy: 'TBD',
            competingPriorities: 'TBD',
            communicationMethod: 'TBD',
            risksMissedOpportunities: 'TBD',
            workingWellToday: 'TBD',
            metricsExpectations: 'TBD',
            identityStatusBelonging: 'TBD',
            trainingToolsCoaching: 'TBD',
            recognitionIncentives: 'TBD',
            personalProfessionalImpact: 'TBD',
            newSkillsBehaviors: 'TBD',
            trustInLeadership: 'TBD',
            whatTheyLose: 'TBD',
            currentVsFuture: 'TBD',
            transitionObstacles: 'TBD',
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
        };
        
        try {
            if (this.supabase) {
                // Save to Supabase
                const { error } = await this.supabase
                    .from('stakeholders')
                    .insert([customStakeholder]);
                
                if (error) throw error;
            } else {
                // Save to localStorage
                localStorage.setItem('stakeholderData', JSON.stringify({
                    sessionId: this.sessionId,
                    stakeholders: [...this.selectedStakeholders, customStakeholder]
                }));
            }
            
            // Add to selected stakeholders
            this.selectedStakeholders.push(customStakeholder);
            
            // Add custom avatar to the main avatar row
            this.addCustomAvatarToRow(customStakeholder);
            
            // Update progress
            this.updateProgress();
            
            // Update completed stakeholders grid
            this.updateCompletedStakeholders();
            
            // Update main data table
            this.updateMainDataTable();
            
            // Update role filter options
            this.updateRoleFilterOptions();
            
            // Close modal
            this.closeCustomGroupModal();
            
            // Show success message
            this.showSuccessMessage(role);
            
        } catch (error) {
            console.error('Error creating custom group:', error);
            alert('Error creating custom group. Please try again.');
        }
    }

    addCustomAvatarToRow(stakeholder) {
        const personasContainer = document.getElementById('personasContainer');
        if (!personasContainer) return;
        
        // Create custom avatar element
        const customAvatar = document.createElement('div');
        customAvatar.className = 'img-wrap';
        customAvatar.setAttribute('data-role', stakeholder.role);
        customAvatar.setAttribute('data-selected', 'false');
        customAvatar.setAttribute('data-custom', 'true');
        
        // Create img element
        const img = document.createElement('img');
        img.src = stakeholder.avatar;
        img.alt = stakeholder.role;
        customAvatar.appendChild(img);
        
        // Add click event listener
        customAvatar.addEventListener('click', (e) => this.handleAvatarClick(e));
        
        // Add to the container
        personasContainer.appendChild(customAvatar);
        
        // Add custom avatar styling
        this.addCustomAvatarStyling();
    }

    addCustomAvatarStyling() {
        // Add CSS for custom avatars if not already added
        if (document.getElementById('custom-avatar-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'custom-avatar-styles';
        style.textContent = `
            .img-wrap[data-custom="true"] {
                border: 2px solid #667eea;
                box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
            }
            
            .img-wrap[data-custom="true"]::after {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                color: white !important;
                font-weight: bold;
            }
            
            .img-wrap[data-custom="true"]:hover {
                transform: scale(1.15);
                box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
            }
        `;
        document.head.appendChild(style);
    }

    updateRoleFilterOptions() {
        const roleFilter = document.getElementById('roleFilter');
        if (!roleFilter) return;
        
        // Get current selected value
        const currentValue = roleFilter.value;
        
        // Clear existing options except "All Roles"
        roleFilter.innerHTML = '<option value="all">All Roles</option>';
        
        // Add predefined roles
        const predefinedRoles = ['CISO', 'Engineer', 'Hunter', 'Investigator', 'Manager', 'Analyst', 'Developer', 'Admin', 'Architect', 'Forensics', 'IR', 'Support'];
        predefinedRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            roleFilter.appendChild(option);
        });
        
        // Add custom roles
        const customRoles = this.selectedStakeholders
            .filter(s => s.isCustom)
            .map(s => s.role)
            .filter((role, index, self) => self.indexOf(role) === index); // Remove duplicates
        
        customRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = `${role} (Custom)`;
            option.style.fontStyle = 'italic';
            roleFilter.appendChild(option);
        });
        
        // Restore selected value if it still exists
        if (currentValue && roleFilter.querySelector(`option[value="${currentValue}"]`)) {
            roleFilter.value = currentValue;
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tool = new StakeholderTool();
    
    // Add export button functionality
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => tool.exportResults());
    }
});
