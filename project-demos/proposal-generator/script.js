// NBD Tracker Application JavaScript
class NBDTracker {
    constructor() {
        this.opportunities = [];
        this.currentStep = 1;
        this.currentView = 'dashboard';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.searchTimeout = null;
        this.updateTimeout = null;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.apiBaseUrl = 'https://api.democorp.com/business/api'; // Backend API URL
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.updateDashboard();
        this.updateCalendar();
        this.updateTable();
        this.setupEventListeners();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.updateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.updateCalendar();
        });

        // Wizard navigation
        document.getElementById('nextStep').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('prevStep').addEventListener('click', () => {
            this.prevStep();
        });

        document.getElementById('cancelForm').addEventListener('click', () => {
            this.cancelForm();
        });

        // Form submission
        document.getElementById('opportunityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveOpportunityWithFiles();
        });

        // Real-time validation
        this.setupRealTimeValidation();

        // Handle PM "Other" option
        document.getElementById('pm').addEventListener('change', (e) => {
            const pmOtherInput = document.getElementById('pmOther');
            if (e.target.value === 'Other') {
                pmOtherInput.style.display = 'block';
                pmOtherInput.required = true;
            } else {
                pmOtherInput.style.display = 'none';
                pmOtherInput.required = false;
                pmOtherInput.value = '';
            }
        });

        // Table filters with debounced search
        document.getElementById('searchInput').addEventListener('input', () => {
            this.debouncedSearch();
        });

        document.getElementById('clearSearch').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            this.updateTable();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.updateTable();
        });

        document.getElementById('pmFilter').addEventListener('change', () => {
            this.updateTable();
        });

        document.getElementById('tierFilter').addEventListener('change', () => {
            this.updateTable();
        });

        document.getElementById('industryFilter').addEventListener('change', () => {
            this.updateTable();
        });

        // Bulk actions
        document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        document.getElementById('selectAllBtn').addEventListener('click', () => {
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            selectAllCheckbox.checked = !selectAllCheckbox.checked;
            this.toggleSelectAll(selectAllCheckbox.checked);
        });

        document.getElementById('bulkDeleteBtn').addEventListener('click', () => {
            this.bulkDelete();
        });

        document.getElementById('bulkStatusBtn').addEventListener('click', () => {
            this.bulkUpdateStatus();
        });

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.sort;
                this.sortTable(column);
            });
        });

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });

        // RFP Modal
        document.getElementById('closeRFPModal').addEventListener('click', () => {
            this.closeRFPModal();
        });

        // SharePoint reminder modal event listeners
        document.getElementById('closeSharePointReminderModal').addEventListener('click', () => {
            this.closeSharePointReminderModal();
        });
        document.getElementById('closeSharePointReminderModalBtn').addEventListener('click', () => {
            this.closeSharePointReminderModal();
        });

        document.getElementById('rfpModal').addEventListener('click', (e) => {
            if (e.target.id === 'rfpModal') {
                this.closeRFPModal();
            }
        });

        // SharePoint reminder modal click outside to close
        document.getElementById('sharepointReminderModal').addEventListener('click', (e) => {
            if (e.target.id === 'sharepointReminderModal') {
                this.closeSharePointReminderModal();
            }
        });

        // Export/Import functionality
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('downloadTemplateBtn').addEventListener('click', () => {
            this.downloadTemplate();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Authentication removed - login/register forms no longer needed
    }

    switchView(view) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update active view
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });
        document.getElementById(view).classList.add('active');

        this.currentView = view;

        // Update view-specific content
        switch (view) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'calendar':
                this.updateCalendar();
                break;
            case 'table':
                this.updateTable();
                break;
            case 'add':
                this.resetWizard();
                break;
        }
    }

    async loadData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/opportunities`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.opportunities = data.opportunities || [];
            } else {
                console.error('Failed to load opportunities:', response.statusText);
                // Load sample data for demo purposes
                this.opportunities = this.getSampleData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // Load sample data for demo purposes
            this.opportunities = this.getSampleData();
        }
    }

    getSampleData() {
        return [
            {
                id: 1,
                name: "Digital Transformation Initiative for TechCorp",
                type: "Strategic Planning",
                industry: "Technology",
                organization: "TechCorp Solutions",
                state: "CA",
                dueDate: "2025-01-15",
                link: "https://example.com/rfp-techcorp-digital-transformation",
                tier: "Tier 1: Go",
                additionalLinks: "Technical requirements document",
                submittalType: "Portal",
                notes: "High priority client, excellent relationship",
                pm: "Sarah Johnson",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Healthcare System Modernization",
                type: "ERP Implementation",
                industry: "Healthcare",
                organization: "Metro Health Systems",
                state: "NY",
                dueDate: "2025-01-20",
                link: "https://example.com/rfp-metro-health-erp",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Compliance requirements checklist",
                submittalType: "Email",
                notes: "Requires additional security certifications",
                pm: "Michael Chen",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Financial Services Process Optimization",
                type: "Org Assessment",
                industry: "Financial Services",
                organization: "First National Bank",
                state: "TX",
                dueDate: "2025-01-25",
                link: "https://example.com/rfp-fnb-process-optimization",
                tier: "Tier 3: Needs additional deliberation",
                additionalLinks: "Regulatory compliance framework",
                submittalType: "Portal",
                notes: "Complex regulatory environment, need legal review",
                pm: "Emily Rodriguez",
                status: "Not Started",
                proposalStatus: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: "Manufacturing Quality Management System",
                type: "CRM Implementation",
                industry: "Manufacturing",
                organization: "Precision Manufacturing Co.",
                state: "OH",
                dueDate: "2025-02-01",
                link: "https://example.com/rfp-precision-quality-system",
                tier: "Tier 1: Go",
                additionalLinks: "Quality standards documentation",
                submittalType: "Mail",
                notes: "Strong technical fit, competitive pricing",
                pm: "David Kim",
                status: "Complete",
                proposalStatus: "Won",
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                name: "Retail Chain Analytics Platform",
                type: "ERP System Selection",
                industry: "Retail",
                organization: "MegaMart Retail",
                state: "FL",
                dueDate: "2025-02-05",
                link: "https://example.com/rfp-megamart-analytics",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Data privacy requirements",
                submittalType: "Portal",
                notes: "Need to address data privacy concerns",
                pm: "Lisa Thompson",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                name: "Educational Institution Student Management",
                type: "Change Management",
                industry: "Education",
                organization: "State University System",
                state: "WA",
                dueDate: "2025-02-10",
                link: "https://example.com/rfp-university-student-management",
                tier: "Tier 3: Needs additional deliberation",
                additionalLinks: "Student privacy regulations",
                submittalType: "Email",
                notes: "Complex stakeholder requirements",
                pm: "Robert Wilson",
                status: "Not Started",
                proposalStatus: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                name: "Energy Sector Compliance System",
                type: "Org Development",
                industry: "Energy",
                organization: "Green Energy Corp",
                state: "CO",
                dueDate: "2025-02-15",
                link: "https://example.com/rfp-green-energy-compliance",
                tier: "Tier 1: Go",
                additionalLinks: "Environmental regulations guide",
                submittalType: "Portal",
                notes: "Excellent technical match",
                pm: "Jennifer Martinez",
                status: "Complete",
                proposalStatus: "Won",
                createdAt: new Date().toISOString()
            },
            {
                id: 8,
                name: "Transportation Logistics Optimization",
                type: "EAM Implementation",
                industry: "Transportation",
                organization: "Fleet Logistics Inc",
                state: "GA",
                dueDate: "2025-02-20",
                link: "https://example.com/rfp-fleet-logistics-optimization",
                tier: "Tier 5: No-Go",
                additionalLinks: "Cost analysis report",
                submittalType: "Email",
                notes: "Budget constraints, not viable",
                pm: "Alex Turner",
                status: "Complete",
                proposalStatus: "Lost",
                createdAt: new Date().toISOString()
            },
            {
                id: 9,
                name: "Real Estate Property Management System",
                type: "UBICS System Selection",
                industry: "Real Estate",
                organization: "Metro Properties Group",
                state: "NV",
                dueDate: "2025-02-25",
                link: "https://example.com/rfp-metro-properties-management",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Property valuation standards",
                submittalType: "Portal",
                notes: "Need to address scalability requirements",
                pm: "Maria Garcia",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            },
            {
                id: 10,
                name: "Non-Profit Donor Management Platform",
                type: "Grant Management or Writing",
                industry: "NonProfit",
                organization: "Community Foundation",
                state: "OR",
                dueDate: "2025-03-01",
                link: "https://example.com/rfp-community-foundation-donor",
                tier: "Tier 1: Go",
                additionalLinks: "Donor privacy guidelines",
                submittalType: "Email",
                notes: "Mission alignment, good fit",
                pm: "James Anderson",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 11,
                name: "E-commerce Platform Migration",
                type: "ERP Implementation",
                industry: "Retail",
                organization: "Online Retail Solutions",
                state: "CA",
                dueDate: "2025-03-15",
                link: "https://example.com/rfp-ecommerce-migration",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Migration timeline requirements",
                submittalType: "Portal",
                notes: "Need to address downtime concerns",
                pm: "Sarah Johnson",
                status: "Not Started",
                proposalStatus: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 12,
                name: "Banking Security Enhancement",
                type: "Org Development",
                industry: "Financial Services",
                organization: "Regional Bank Corp",
                state: "TX",
                dueDate: "2025-03-20",
                link: "https://example.com/rfp-banking-security",
                tier: "Tier 1: Go",
                additionalLinks: "Security compliance checklist",
                submittalType: "Email",
                notes: "High priority security project",
                pm: "Michael Chen",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            },
            {
                id: 13,
                name: "Hospital Management System",
                type: "CRM Implementation",
                industry: "Healthcare",
                organization: "Metro Medical Center",
                state: "NY",
                dueDate: "2025-04-05",
                link: "https://example.com/rfp-hospital-management",
                tier: "Tier 3: Needs additional deliberation",
                additionalLinks: "HIPAA compliance requirements",
                submittalType: "Portal",
                notes: "Complex regulatory requirements",
                pm: "Emily Rodriguez",
                status: "Not Started",
                proposalStatus: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 14,
                name: "Automotive Supply Chain Optimization",
                type: "EAM Implementation",
                industry: "Manufacturing",
                organization: "AutoParts Manufacturing",
                state: "MI",
                dueDate: "2025-04-10",
                link: "https://example.com/rfp-automotive-supply-chain",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Supply chain analytics requirements",
                submittalType: "Email",
                notes: "Need to address integration complexity",
                pm: "David Kim",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 15,
                name: "University Learning Management System",
                type: "Change Management",
                industry: "Education",
                organization: "Tech University",
                state: "WA",
                dueDate: "2025-04-15",
                link: "https://example.com/rfp-university-lms",
                tier: "Tier 1: Go",
                additionalLinks: "Student engagement metrics",
                submittalType: "Portal",
                notes: "Strong technical fit",
                pm: "Lisa Thompson",
                status: "Complete",
                proposalStatus: "Won",
                createdAt: new Date().toISOString()
            },
            {
                id: 16,
                name: "Renewable Energy Monitoring Platform",
                type: "UBICS System Selection",
                industry: "Energy",
                organization: "Solar Power Solutions",
                state: "AZ",
                dueDate: "2025-04-20",
                link: "https://example.com/rfp-solar-monitoring",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Environmental impact metrics",
                submittalType: "Email",
                notes: "Need to address scalability",
                pm: "Robert Wilson",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            },
            {
                id: 17,
                name: "Logistics Fleet Management",
                type: "Org Assessment",
                industry: "Transportation",
                organization: "Global Logistics Inc",
                state: "GA",
                dueDate: "2025-05-01",
                link: "https://example.com/rfp-logistics-fleet",
                tier: "Tier 3: Needs additional deliberation",
                additionalLinks: "Fleet optimization requirements",
                submittalType: "Portal",
                notes: "Complex stakeholder requirements",
                pm: "Jennifer Martinez",
                status: "Not Started",
                proposalStatus: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 18,
                name: "Property Investment Analytics",
                type: "Strategic Planning",
                industry: "Real Estate",
                organization: "Investment Properties Group",
                state: "FL",
                dueDate: "2025-05-05",
                link: "https://example.com/rfp-property-analytics",
                tier: "Tier 1: Go",
                additionalLinks: "Market analysis requirements",
                submittalType: "Email",
                notes: "Excellent market opportunity",
                pm: "Alex Turner",
                status: "Complete",
                proposalStatus: "Won",
                createdAt: new Date().toISOString()
            },
            {
                id: 19,
                name: "Charity Event Management System",
                type: "Grant Management or Writing",
                industry: "NonProfit",
                organization: "Hope Foundation",
                state: "IL",
                dueDate: "2025-05-10",
                link: "https://example.com/rfp-charity-events",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Volunteer coordination requirements",
                submittalType: "Portal",
                notes: "Need to address volunteer management",
                pm: "Maria Garcia",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 20,
                name: "AI-Powered Customer Service Platform",
                type: "ERP System Selection",
                industry: "Technology",
                organization: "Innovation Tech Corp",
                state: "CA",
                dueDate: "2025-05-15",
                link: "https://example.com/rfp-ai-customer-service",
                tier: "Tier 1: Go",
                additionalLinks: "AI integration requirements",
                submittalType: "Email",
                notes: "Cutting-edge technology opportunity",
                pm: "James Anderson",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            },
            // Current month opportunities (December 2024)
            {
                id: 21,
                name: "Year-End Financial Reporting System",
                type: "ERP Implementation",
                industry: "Financial Services",
                organization: "Accounting Solutions Inc",
                state: "NY",
                dueDate: "2024-12-20",
                link: "https://example.com/rfp-year-end-reporting",
                tier: "Tier 1: Go",
                additionalLinks: "Year-end compliance requirements",
                submittalType: "Email",
                notes: "Urgent year-end deadline",
                pm: "Sarah Johnson",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 22,
                name: "Holiday E-commerce Platform Upgrade",
                type: "CRM Implementation",
                industry: "Retail",
                organization: "Holiday Retail Corp",
                state: "CA",
                dueDate: "2024-12-25",
                link: "https://example.com/rfp-holiday-ecommerce",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Holiday traffic handling requirements",
                submittalType: "Portal",
                notes: "Need to handle holiday traffic spikes",
                pm: "Michael Chen",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            },
            {
                id: 23,
                name: "Healthcare Data Migration Project",
                type: "Org Development",
                industry: "Healthcare",
                organization: "Regional Medical Group",
                state: "TX",
                dueDate: "2024-12-30",
                link: "https://example.com/rfp-healthcare-migration",
                tier: "Tier 3: Needs additional deliberation",
                additionalLinks: "HIPAA compliance documentation",
                submittalType: "Email",
                notes: "Complex data migration requirements",
                pm: "Emily Rodriguez",
                status: "Not Started",
                proposalStatus: "",
                createdAt: new Date().toISOString()
            },
            // Next month opportunities (January 2025)
            {
                id: 24,
                name: "New Year Manufacturing Optimization",
                type: "EAM Implementation",
                industry: "Manufacturing",
                organization: "Precision Manufacturing Ltd",
                state: "OH",
                dueDate: "2025-01-05",
                link: "https://example.com/rfp-manufacturing-optimization",
                tier: "Tier 1: Go",
                additionalLinks: "Production efficiency metrics",
                submittalType: "Portal",
                notes: "Strong ROI potential",
                pm: "David Kim",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 25,
                name: "Educational Technology Platform",
                type: "Change Management",
                industry: "Education",
                organization: "Digital Learning Academy",
                state: "WA",
                dueDate: "2025-01-10",
                link: "https://example.com/rfp-edtech-platform",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Student engagement analytics",
                submittalType: "Email",
                notes: "Need to address accessibility requirements",
                pm: "Lisa Thompson",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            },
            {
                id: 26,
                name: "Energy Grid Modernization",
                type: "UBICS System Selection",
                industry: "Energy",
                organization: "Smart Grid Solutions",
                state: "CO",
                dueDate: "2025-01-15",
                link: "https://example.com/rfp-energy-grid",
                tier: "Tier 1: Go",
                additionalLinks: "Grid stability requirements",
                submittalType: "Portal",
                notes: "Critical infrastructure project",
                pm: "Robert Wilson",
                status: "Complete",
                proposalStatus: "Won",
                createdAt: new Date().toISOString()
            },
            {
                id: 27,
                name: "Transportation Route Optimization",
                type: "Org Assessment",
                industry: "Transportation",
                organization: "Metro Transit Authority",
                state: "GA",
                dueDate: "2025-01-20",
                link: "https://example.com/rfp-transit-optimization",
                tier: "Tier 3: Needs additional deliberation",
                additionalLinks: "Route efficiency analysis",
                submittalType: "Email",
                notes: "Complex stakeholder requirements",
                pm: "Jennifer Martinez",
                status: "Not Started",
                proposalStatus: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 28,
                name: "Real Estate Market Analysis Platform",
                type: "Strategic Planning",
                industry: "Real Estate",
                organization: "Market Intelligence Corp",
                state: "FL",
                dueDate: "2025-01-25",
                link: "https://example.com/rfp-real-estate-analysis",
                tier: "Tier 2: Go (with some conditions)",
                additionalLinks: "Market trend analysis requirements",
                submittalType: "Portal",
                notes: "Need to address data accuracy",
                pm: "Alex Turner",
                status: "In Progress",
                proposalStatus: "Submitted",
                createdAt: new Date().toISOString()
            },
            {
                id: 29,
                name: "Non-Profit Volunteer Management",
                type: "Grant Management or Writing",
                industry: "NonProfit",
                organization: "Community Service Network",
                state: "IL",
                dueDate: "2025-01-30",
                link: "https://example.com/rfp-volunteer-management",
                tier: "Tier 1: Go",
                additionalLinks: "Volunteer coordination guidelines",
                submittalType: "Email",
                notes: "Mission-critical system",
                pm: "Maria Garcia",
                status: "Complete",
                proposalStatus: "Won",
                createdAt: new Date().toISOString()
            },
            {
                id: 30,
                name: "Cloud Infrastructure Migration",
                type: "ERP System Selection",
                industry: "Technology",
                organization: "Cloud Solutions Inc",
                state: "CA",
                dueDate: "2025-02-01",
                link: "https://example.com/rfp-cloud-migration",
                tier: "Tier 1: Go",
                additionalLinks: "Cloud security requirements",
                submittalType: "Portal",
                notes: "High-value technology project",
                pm: "James Anderson",
                status: "In Progress",
                proposalStatus: "Interview",
                createdAt: new Date().toISOString()
            }
        ];
    }

    async saveData() {
        // Note: Individual opportunity saves are handled by API calls
        // This method is kept for compatibility but data is now stored on server
        console.log('Data is now stored on server via API calls');
    }

    updateDashboard() {
        const futureOpportunities = this.getFutureOpportunities();
        const totalOpportunities = futureOpportunities.length;
        const dueThisWeek = this.getOpportunitiesDueThisWeek().length;
        const completedCount = futureOpportunities.filter(opp => opp.status === 'Complete').length;

        document.getElementById('totalOpportunities').textContent = totalOpportunities;
        document.getElementById('dueThisWeek').textContent = dueThisWeek;
        document.getElementById('completedCount').textContent = completedCount;

        this.updateRecentOpportunities();
        this.updateTeamWorkload();
    }

    getOpportunitiesDueThisWeek() {
        const now = new Date();
        // Set to start of today
        now.setHours(0, 0, 0, 0);
        
        // Calculate 7 calendar days from today
        const weekFromNow = new Date(now);
        weekFromNow.setDate(now.getDate() + 7);
        
        return this.opportunities.filter(opp => {
            if (!opp.dueDate) return false;
            
            const dueDate = new Date(opp.dueDate);
            // Set to start of due date for accurate comparison
            dueDate.setHours(0, 0, 0, 0);
            
            // Include opportunities due today through 7 days from today
            return dueDate >= now && dueDate <= weekFromNow;
        });
    }

    getFutureOpportunities() {
        const now = new Date();
        // Set to start of today
        now.setHours(0, 0, 0, 0);
        
        return this.opportunities.filter(opp => {
            if (!opp.dueDate) return false;
            
            const dueDate = new Date(opp.dueDate);
            // Set to start of due date for accurate comparison
            dueDate.setHours(0, 0, 0, 0);
            
            // Only include opportunities due today or in the future
            return dueDate >= now;
        });
    }

    updateRecentOpportunities() {
        const container = document.getElementById('recentOpportunities');
        const upcoming = this.getFutureOpportunities()
            .filter(opp => opp.status !== 'Complete')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5);

        container.innerHTML = upcoming.map(opp => `
            <div class="opportunity-card">
                <div class="opportunity-header">
                    <h4 class="opportunity-name-clickable" onclick="nbdTracker.showRFPPopup(${opp.id})">${opp.name}</h4>
                       <span class="tier-badge ${this.getTierClass(opp.tier)}">${this.getTierDisplayLabel(opp.tier)}</span>
                </div>
                <div class="opportunity-details">
                    <p><strong>Organization:</strong> ${opp.organization}</p>
                    <p><strong>Due Date:</strong> ${this.formatDate(opp.dueDate)}</p>
                    <p><strong>PM:</strong> ${opp.pm}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${this.getStatusClass(opp.status)}">${opp.status}</span></p>
                </div>
            </div>
        `).join('');
    }

    updateTeamWorkload() {
        const container = document.getElementById('teamWorkload');
        const teamMembers = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Thompson', 'Robert Wilson', 'Jennifer Martinez', 'Alex Turner', 'Maria Garcia', 'James Anderson'];
        
        // Filter opportunities: future dates OR non-blank status
        const relevantOpportunities = this.opportunities.filter(opp => {
            if (!opp.dueDate) return false;
            
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const dueDate = new Date(opp.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            // Include if future date OR if status is not blank/empty
            return dueDate >= now || (opp.status && opp.status.trim() !== '');
        });
        
        // Calculate the maximum workload across all team members to normalize the progress bars
        const maxWorkload = Math.max(...teamMembers.map(pm => {
            const workload = relevantOpportunities.filter(opp => opp.pm.includes(pm));
            return workload.length;
        }));
        
        container.innerHTML = teamMembers.map(pm => {
            const workload = relevantOpportunities.filter(opp => opp.pm.includes(pm));
            const notStarted = workload.filter(opp => opp.status === 'Not Started');
            const inProgress = workload.filter(opp => opp.status === 'In Progress');
            const completed = workload.filter(opp => opp.status === 'Complete');
            
            // Calculate progress bar widths based on total workload relative to max workload
            const totalWorkload = workload.length;
            const progressWidth = maxWorkload > 0 ? (totalWorkload / maxWorkload) * 100 : 0;
            
            // Calculate individual segment widths
            const notStartedWidth = totalWorkload > 0 ? (notStarted.length / totalWorkload) * progressWidth : 0;
            const inProgressWidth = totalWorkload > 0 ? (inProgress.length / totalWorkload) * progressWidth : 0;
            const completedWidth = totalWorkload > 0 ? (completed.length / totalWorkload) * progressWidth : 0;
            
            return `
                <div class="team-member-card">
                    <div class="member-header">
                        <h4>${pm}</h4>
                        <span class="workload-count">${totalWorkload} total</span>
                    </div>
                    <div class="workload-details">
                        <div class="workload-bar">
                            <div class="workload-segment not-started" style="width: ${notStartedWidth}%"></div>
                            <div class="workload-segment in-progress" style="width: ${inProgressWidth}%"></div>
                            <div class="workload-segment completed" style="width: ${completedWidth}%"></div>
                        </div>
                        <div class="workload-legend">
                            <span class="legend-item">
                                <span class="legend-color not-started"></span>
                                ${notStarted.length} Not Started
                            </span>
                            <span class="legend-item">
                                <span class="legend-color in-progress"></span>
                                ${inProgress.length} In Progress
                            </span>
                            <span class="legend-item">
                                <span class="legend-color completed"></span>
                                ${completed.length} Completed
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCalendar() {
        const container = document.getElementById('calendarGrid');
        const title = document.getElementById('calendarTitle');
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        title.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const today = new Date();
        const isCurrentMonth = today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;
        
        let html = '';
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const isCurrentMonthDay = currentDate.getMonth() === this.currentMonth;
            const isToday = isCurrentMonthDay && isCurrentMonth && currentDate.getDate() === today.getDate();
            
            const dayOpportunities = this.getOpportunitiesForDate(currentDate);
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''}" 
                     onmouseenter="nbdTracker.showCalendarTooltip(event, ${JSON.stringify(dayOpportunities).replace(/"/g, '&quot;')})"
                     onmouseleave="nbdTracker.hideCalendarTooltip(event)">
                    <div class="calendar-day-header">${currentDate.getDate()}</div>
                    ${dayOpportunities.map(opp => `
                        <div class="calendar-event ${this.getTierClass(opp.tier)}" 
                             onclick="nbdTracker.editOpportunity(${opp.id})">
                            ${opp.name.substring(0, 20)}${opp.name.length > 20 ? '...' : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    getOpportunitiesForDate(date) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        return this.opportunities.filter(opp => {
            if (!opp.dueDate) return false;
            
            const dueDate = new Date(opp.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            // Only show opportunities that are due today or in the future
            return dueDate >= now && dueDate.toDateString() === date.toDateString();
        });
    }

    showCalendarTooltip(event, opportunities) {
        if (!opportunities || opportunities.length === 0) return;
        
        // Remove any existing tooltip
        this.hideCalendarTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'calendar-tooltip';
        tooltip.id = 'calendar-tooltip';
        
        // Create tooltip content
        let tooltipContent = '';
        
        if (opportunities.length === 1) {
            const opp = opportunities[0];
            tooltipContent = `
                <div class="calendar-tooltip-header">${this.escapeHtml(opp.name)}</div>
                <div class="calendar-tooltip-content">
                    <div class="calendar-tooltip-item">
                        <strong>Organization:</strong>
                        <span>${this.escapeHtml(opp.organization)}</span>
                    </div>
                    <div class="calendar-tooltip-item">
                        <strong>Due Date:</strong>
                        <span>${this.formatDate(opp.dueDate)}</span>
                    </div>
                    <div class="calendar-tooltip-item">
                        <strong>PM:</strong>
                        <span>${this.escapeHtml(opp.pm)}</span>
                    </div>
                    <div class="calendar-tooltip-item">
                        <strong>Type:</strong>
                        <span>${this.escapeHtml(opp.type)}</span>
                    </div>
                    <div class="calendar-tooltip-badges">
                        <span class="tier-badge ${this.getTierClass(opp.tier)}">${this.getTierDisplayLabel(opp.tier)}</span>
                        <span class="status-badge ${this.getStatusClass(opp.status)}">${this.escapeHtml(opp.status)}</span>
                    </div>
                </div>
            `;
        } else {
            tooltipContent = `
                <div class="calendar-tooltip-header">${opportunities.length} Opportunities Due</div>
                <div class="calendar-tooltip-content">
                    ${opportunities.map(opp => `
                        <div class="calendar-tooltip-item" style="margin-bottom: 0.5rem; padding: 0.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 0.25rem;">
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">${this.escapeHtml(opp.name)}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">
                                ${this.escapeHtml(opp.organization)} • ${this.escapeHtml(opp.pm)}
                            </div>
                            <div style="margin-top: 0.25rem;">
                                <span class="tier-badge ${this.getTierClass(opp.tier)}" style="font-size: 0.6rem; padding: 0.15rem 0.3rem;">${this.getTierDisplayLabel(opp.tier)}</span>
                                <span class="status-badge ${this.getStatusClass(opp.status)}" style="font-size: 0.6rem; padding: 0.15rem 0.3rem;">${this.escapeHtml(opp.status)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        tooltip.innerHTML = tooltipContent;
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        
        // Show tooltip with animation
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
    }

    hideCalendarTooltip() {
        const tooltip = document.getElementById('calendar-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }
    }

    updateTable() {
        const tbody = document.getElementById('tableBody');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const pmFilter = document.getElementById('pmFilter').value;
        const tierFilter = document.getElementById('tierFilter').value;
        const industryFilter = document.getElementById('industryFilter').value;
        
        // Start with future opportunities only, then apply additional filters
        let filteredOpportunities = this.getFutureOpportunities().filter(opp => {
            // Early return for search term
            if (searchTerm) {
                const searchableText = `${opp.name} ${opp.organization} ${opp.pm} ${opp.type}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
            }
            
            // Early returns for filters
            if (statusFilter && opp.status !== statusFilter) return false;
            if (pmFilter && !opp.pm.includes(pmFilter)) return false;
            if (tierFilter && opp.tier !== tierFilter) return false;
            if (industryFilter && opp.industry !== industryFilter) return false;
            
            return true;
        });

        // Apply sorting
        if (this.sortColumn) {
            filteredOpportunities.sort((a, b) => {
                let aVal = a[this.sortColumn];
                let bVal = b[this.sortColumn];

                // Handle special cases
                if (this.sortColumn === 'dueDate') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                } else if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        filteredOpportunities.forEach(opp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${opp.id}" onchange="nbdTracker.updateBulkActions()">
                </td>
                <td>
                    <div class="opportunity-name">
                        <strong>${this.escapeHtml(opp.name)}</strong>
                        <small>${this.escapeHtml(opp.organization)}, ${this.escapeHtml(opp.state)}</small>
                    </div>
                </td>
                <td class="editable" data-field="organization" data-id="${opp.id}">${this.escapeHtml(opp.organization)}</td>
                <td class="editable" data-field="type" data-id="${opp.id}">${this.escapeHtml(opp.type)}</td>
                <td class="editable" data-field="dueDate" data-id="${opp.id}" data-type="date">${this.formatDate(opp.dueDate)}</td>
                <td class="editable" data-field="tier" data-id="${opp.id}" data-type="select" data-options="Tier 1: Go,Tier 2: Go (with some conditions),Tier 3: Needs additional deliberation,Tier 5: No-Go">
                    <span class="tier-badge ${this.getTierClass(opp.tier)}">${this.getTierDisplayLabel(opp.tier)}</span>
                </td>
                <td class="editable" data-field="pm" data-id="${opp.id}" data-type="select" data-options="Fred,Sondra,Sachin,Mike,Hibah">${this.escapeHtml(opp.pm)}</td>
                <td class="editable" data-field="status" data-id="${opp.id}" data-type="select" data-options="Not Started,In Progress,Complete">
                    <span class="status-badge ${this.getStatusClass(opp.status)}">${this.escapeHtml(opp.status)}</span>
                </td>
                <td class="editable" data-field="proposalStatus" data-id="${opp.id}" data-type="select" data-options="Submitted,Interview,Won,Lost">
                    ${opp.proposalStatus ? `<span class="proposal-status-badge ${this.getProposalStatusClass(opp.proposalStatus)}">${this.escapeHtml(opp.proposalStatus)}</span>` : '<span class="proposal-status-badge no-status">Not Set</span>'}
                </td>
                <td>
                    <button class="btn btn-secondary" onclick="nbdTracker.editOpportunity(${opp.id})" aria-label="Edit opportunity">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-danger" onclick="nbdTracker.deleteOpportunity(${opp.id})" aria-label="Delete opportunity">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                    </button>
                </td>
            `;
            fragment.appendChild(row);
        });
        
        // Clear and append in one operation
        tbody.innerHTML = '';
        tbody.appendChild(fragment);

        // Update bulk action buttons
        this.updateBulkActions();

        // Setup inline editing
        this.setupInlineEditing();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.updateWizardStep();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateWizardStep();
        }
    }

    updateWizardStep() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update step content
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitForm');

        prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === 4) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    resetWizard() {
        this.currentStep = 1;
        document.getElementById('opportunityForm').reset();
        this.updateWizardStep();
    }

    cancelForm() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            this.resetWizard();
            this.switchView('dashboard');
        }
    }

    async saveOpportunity() {
        // Validate form before saving
        if (!this.validateForm()) {
            return;
        }

        const opportunity = {
            name: document.getElementById('opportunityName').value.trim(),
            type: document.getElementById('opportunityType').value,
            industry: document.getElementById('industry').value,
            organization: document.getElementById('organizationName').value.trim(),
            state: document.getElementById('state').value,
            dueDate: document.getElementById('dueDate').value,
            link: document.getElementById('link').value.trim(),
            tier: document.querySelector('input[name="tier"]:checked')?.value,
            additionalLinks: document.getElementById('additionalLinks').value.trim(),
            submittalType: document.getElementById('submittalType').value,
            notes: document.getElementById('notes').value.trim(),
            pm: document.getElementById('pm').value,
            status: document.getElementById('status').value,
            sharepointSite: document.getElementById('sharepointSite').value.trim(),
            uploadedFiles: this.getUploadedFiles()
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/opportunities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(opportunity)
            });

            if (response.ok) {
                const data = await response.json();
                this.opportunities.push(data.opportunity);
                this.showNotification('Opportunity saved successfully!', 'success');
                this.resetWizard();
                this.switchView('dashboard');
                this.updateDashboard();
            } else {
                const errorData = await response.json();
                this.showNotification('Error saving opportunity: ' + errorData.message, 'danger');
            }
        } catch (error) {
            console.error('Error saving opportunity:', error);
            this.showNotification('Network error. Please try again.', 'danger');
        }
    }

    validateForm() {
        const requiredFields = [
            { id: 'opportunityName', name: 'Opportunity Name' },
            { id: 'organizationName', name: 'Organization Name' },
            { id: 'state', name: 'State' },
            { id: 'industry', name: 'Industry' },
            { id: 'opportunityType', name: 'Type of Opportunity' },
            { id: 'dueDate', name: 'Due Date' },
            { id: 'pm', name: 'Project Manager' },
            { id: 'status', name: 'Status' }
        ];

        const errors = [];
        let isValid = true;

        // Check required fields
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            const value = element.value.trim();
            
            if (!value) {
                this.showFieldError(element, `${field.name} is required`);
                errors.push(`${field.name} is required`);
                isValid = false;
            } else {
                this.clearFieldError(element);
            }
        });

        // Check tier selection
        const tierSelected = document.querySelector('input[name="tier"]:checked');
        if (!tierSelected) {
            this.showNotification('Please select a Go/No-Go tier', 'warning');
            errors.push('Go/No-Go tier is required');
            isValid = false;
        }

        // Validate due date
        const dueDate = document.getElementById('dueDate').value;
        if (dueDate) {
            const dueDateObj = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (dueDateObj < today) {
                const element = document.getElementById('dueDate');
                this.showFieldError(element, 'Due date cannot be in the past');
                errors.push('Due date cannot be in the past');
                isValid = false;
            }
        }

        // Validate URL if provided
        const link = document.getElementById('link').value.trim();
        if (link && !this.isValidUrl(link)) {
            const element = document.getElementById('link');
            this.showFieldError(element, 'Please enter a valid URL');
            errors.push('Please enter a valid URL');
            isValid = false;
        }

        if (!isValid) {
            this.showNotification('Please fix the errors before saving', 'danger');
        }

        return isValid;
    }

    showFieldError(element, message) {
        element.classList.add('error');
        element.setAttribute('aria-invalid', 'true');
        
        // Remove existing error message
        const existingError = element.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
        element.parentNode.appendChild(errorDiv);
    }

    clearFieldError(element) {
        element.classList.remove('error');
        element.removeAttribute('aria-invalid');
        
        const existingError = element.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    setupRealTimeValidation() {
        const requiredFields = [
            'opportunityName', 'organizationName', 'state', 'industry', 
            'opportunityType', 'dueDate', 'pm', 'status'
        ];

        requiredFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('blur', () => {
                    this.validateField(element);
                });
                element.addEventListener('input', () => {
                    if (element.classList.contains('error')) {
                        this.validateField(element);
                    }
                });
            }
        });

        // Special validation for URL field
        const linkField = document.getElementById('link');
        if (linkField) {
            linkField.addEventListener('blur', () => {
                const value = linkField.value.trim();
                if (value && !this.isValidUrl(value)) {
                    this.showFieldError(linkField, 'Please enter a valid URL');
                } else {
                    this.clearFieldError(linkField);
                }
            });
        }

        // Special validation for due date
        const dueDateField = document.getElementById('dueDate');
        if (dueDateField) {
            dueDateField.addEventListener('change', () => {
                this.validateDueDate(dueDateField);
            });
        }
    }

    validateField(element) {
        const value = element.value.trim();
        const fieldName = element.previousElementSibling?.textContent?.replace('*', '').trim() || 'This field';
        
        if (!value) {
            this.showFieldError(element, `${fieldName} is required`);
            return false;
        } else {
            this.clearFieldError(element);
            return true;
        }
    }

    validateDueDate(element) {
        const value = element.value;
        if (value) {
            const dueDateObj = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (dueDateObj < today) {
                this.showFieldError(element, 'Due date cannot be in the past');
                return false;
            } else {
                this.clearFieldError(element);
                return true;
            }
        }
        return true;
    }

    debouncedSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.updateTable();
        }, 300);
    }

    debouncedUpdate() {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updateDashboard();
            this.updateCalendar();
        }, 100);
    }

    editOpportunity(id) {
        const opportunity = this.opportunities.find(opp => opp.id === id);
        if (!opportunity) return;

        // Populate modal with opportunity data
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <form id="editForm">
                <div class="form-group">
                    <label for="editName">Opportunity Name</label>
                    <input type="text" id="editName" class="glass-input" value="${opportunity.name}">
                </div>
                <div class="form-group">
                    <label for="editOrganization">Organization</label>
                    <input type="text" id="editOrganization" class="glass-input" value="${opportunity.organization}">
                </div>
                <div class="form-group">
                    <label for="editStatus">Status</label>
                    <select id="editStatus" class="glass-select">
                        <option value="Not Started" ${opportunity.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="In Progress" ${opportunity.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Complete" ${opportunity.status === 'Complete' ? 'selected' : ''}>Complete</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editPM">Project Manager</label>
                    <select id="editPM" class="glass-select">
                        <option value="Fred" ${opportunity.pm === 'Fred' ? 'selected' : ''}>Fred</option>
                        <option value="Sondra" ${opportunity.pm === 'Sondra' ? 'selected' : ''}>Sondra</option>
                        <option value="Sachin" ${opportunity.pm === 'Sachin' ? 'selected' : ''}>Sachin</option>
                        <option value="Mike" ${opportunity.pm === 'Mike' ? 'selected' : ''}>Mike</option>
                        <option value="Hibah" ${opportunity.pm === 'Hibah' ? 'selected' : ''}>Hibah</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editNotes">Notes</label>
                    <textarea id="editNotes" class="glass-input" rows="3">${opportunity.notes}</textarea>
                </div>
                <div class="wizard-actions">
                    <button type="button" class="btn btn-secondary" onclick="nbdTracker.closeModal()">Cancel</button>
                    <button type="button" class="btn btn-success" onclick="nbdTracker.updateOpportunity(${id})">Save Changes</button>
                </div>
            </form>
        `;

        document.getElementById('editModal').classList.add('active');
    }

    updateOpportunity(id) {
        const opportunity = this.opportunities.find(opp => opp.id === id);
        if (!opportunity) return;

        opportunity.name = document.getElementById('editName').value;
        opportunity.organization = document.getElementById('editOrganization').value;
        opportunity.status = document.getElementById('editStatus').value;
        opportunity.pm = document.getElementById('editPM').value;
        opportunity.notes = document.getElementById('editNotes').value;

        this.saveData();
        this.closeModal();
        this.updateTable();
        this.debouncedUpdate();
        
        this.showNotification('Opportunity updated successfully!', 'success');
    }

    async deleteOpportunity(id) {
        if (confirm('Are you sure you want to delete this opportunity?')) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/opportunities/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    this.opportunities = this.opportunities.filter(opp => opp.id !== id);
                    this.updateTable();
                    this.updateDashboard();
                    this.updateCalendar();
                    this.showNotification('Opportunity deleted successfully!', 'success');
                } else {
                    const errorData = await response.json();
                    this.showNotification('Error deleting opportunity: ' + errorData.message, 'danger');
                }
            } catch (error) {
                console.error('Error deleting opportunity:', error);
                this.showNotification('Network error. Please try again.', 'danger');
            }
        }
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('active');
    }

    showRFPPopup(id) {
        const opportunity = this.opportunities.find(opp => opp.id === id);
        if (!opportunity) return;

        const modalBody = document.getElementById('rfpModalBody');
        modalBody.innerHTML = `
            <div class="rfp-details">
                <div class="rfp-header">
                    <h4>${this.escapeHtml(opportunity.name)}</h4>
                    <div class="rfp-badges">
                        <span class="tier-badge ${this.getTierClass(opportunity.tier)}">${this.getTierDisplayLabel(opportunity.tier)}</span>
                        <span class="status-badge ${this.getStatusClass(opportunity.status)}">${this.escapeHtml(opportunity.status)}</span>
                    </div>
                </div>
                
                <div class="rfp-info-grid">
                    <div class="rfp-info-item">
                        <strong>Organization:</strong>
                        <span>${this.escapeHtml(opportunity.organization)}</span>
                    </div>
                    <div class="rfp-info-item">
                        <strong>Type:</strong>
                        <span>${this.escapeHtml(opportunity.type)}</span>
                    </div>
                    <div class="rfp-info-item">
                        <strong>Industry:</strong>
                        <span>${this.escapeHtml(opportunity.industry)}</span>
                    </div>
                    <div class="rfp-info-item">
                        <strong>State:</strong>
                        <span>${this.escapeHtml(opportunity.state)}</span>
                    </div>
                    <div class="rfp-info-item">
                        <strong>Due Date:</strong>
                        <span>${this.formatDate(opportunity.dueDate)}</span>
                    </div>
                    <div class="rfp-info-item">
                        <strong>Project Manager:</strong>
                        <span>${this.escapeHtml(opportunity.pm)}</span>
                    </div>
                    <div class="rfp-info-item">
                        <strong>Submittal Type:</strong>
                        <span>${this.escapeHtml(opportunity.submittalType)}</span>
                    </div>
                </div>

                ${opportunity.link ? `
                    <div class="rfp-link-section">
                        <strong>RFP Link:</strong>
                        <a href="${opportunity.link}" target="_blank" class="rfp-link">
                            <i class="fas fa-external-link-alt"></i>
                            ${this.escapeHtml(opportunity.link)}
                        </a>
                    </div>
                ` : ''}

                ${opportunity.additionalLinks ? `
                    <div class="rfp-additional-section">
                        <strong>Additional Links/Information:</strong>
                        <p>${this.escapeHtml(opportunity.additionalLinks)}</p>
                    </div>
                ` : ''}

                ${opportunity.notes ? `
                    <div class="rfp-notes-section">
                        <strong>Notes:</strong>
                        <p>${this.escapeHtml(opportunity.notes)}</p>
                    </div>
                ` : ''}

                <div class="rfp-actions">
                    <button class="btn btn-primary" onclick="nbdTracker.editOpportunity(${id})">
                        <i class="fas fa-edit"></i>
                        Edit Opportunity
                    </button>
                    <button class="btn btn-secondary" onclick="nbdTracker.closeRFPModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.getElementById('rfpModal').classList.add('active');
    }

    closeRFPModal() {
        document.getElementById('rfpModal').classList.remove('active');
    }

    showSharePointReminderModal(opportunityName, organizationName) {
        console.log('showSharePointReminderModal called with:', opportunityName, organizationName);
        
        // Generate suggested filename
        const clientName = organizationName.replace(/[^a-zA-Z0-9]/g, '_');
        const today = new Date().toISOString().split('T')[0];
        const suggestedFilename = `${clientName}_RFP_${today}.pdf`;
        
        console.log('Generated filename:', suggestedFilename);
        
        // Update the suggested filename in the modal
        const filenameElement = document.getElementById('suggestedFilename');
        if (filenameElement) {
            filenameElement.textContent = suggestedFilename;
            console.log('Updated filename element');
        } else {
            console.error('suggestedFilename element not found');
        }
        
        // Show the modal
        const modal = document.getElementById('sharepointReminderModal');
        if (modal) {
            modal.classList.add('active');
            console.log('Modal shown');
        } else {
            console.error('sharepointReminderModal element not found');
        }
    }

    closeSharePointReminderModal() {
        document.getElementById('sharepointReminderModal').classList.remove('active');
    }

    copyFilename() {
        const filenameElement = document.getElementById('suggestedFilename');
        const filename = filenameElement.textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(filename).then(() => {
            this.showNotification('Filename copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = filename;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Filename copied to clipboard!', 'success');
        });
    }

    getTierClass(tier) {
        if (tier.includes('Tier 1')) return 'tier-1';
        if (tier.includes('Tier 2')) return 'tier-2';
        if (tier.includes('Tier 3')) return 'tier-3';
        if (tier.includes('Tier 5')) return 'tier-5';
        return '';
    }

    getTierShortLabel(tier) {
        if (tier.includes('Tier 1')) return 'Tier 1';
        if (tier.includes('Tier 2')) return 'Tier 2';
        if (tier.includes('Tier 3')) return 'Tier 3';
        if (tier.includes('Tier 5')) return 'Tier 5';
        return tier;
    }

    getTierDisplayLabel(tier) {
        // Extract just the tier number for display
        const tierMatch = tier.match(/Tier (\d+)/);
        if (tierMatch) {
            return `Tier ${tierMatch[1]}`;
        }
        return tier;
    }

    getStatusClass(status) {
        return status.toLowerCase().replace(' ', '-');
    }

    getProposalStatusClass(proposalStatus) {
        if (!proposalStatus) return 'no-status';
        return proposalStatus.toLowerCase().replace(' ', '-');
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 0.5rem;
            padding: 1rem 1.5rem;
            box-shadow: 0 8px 32px var(--glass-shadow);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        let currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    exportData() {
        try {
            // Create CSV content
            const headers = [
                'Name of Opportunity',
                'Type of Opportunity', 
                'Industry',
                'Organization Name',
                'State',
                'Due Date',
                'Link',
                'Go/No Go Tier',
                'Additional Links/Information',
                'Submittal Type',
                'Notes',
                'PM',
                'Proposal Status',
                'Stage',
                'Created At'
            ];

            const csvContent = [
                headers.join(','),
                ...this.opportunities.map(opp => [
                    `"${opp.name || ''}"`,
                    `"${opp.type || ''}"`,
                    `"${opp.industry || ''}"`,
                    `"${opp.organization || ''}"`,
                    `"${opp.state || ''}"`,
                    `"${opp.dueDate || ''}"`,
                    `"${opp.link || ''}"`,
                    `"${opp.tier || ''}"`,
                    `"${opp.additionalLinks || ''}"`,
                    `"${opp.submittalType || ''}"`,
                    `"${opp.notes || ''}"`,
                    `"${opp.pm || ''}"`,
                    `"${opp.status || ''}"`,
                    `"${opp.proposalStatus || ''}"`,
                    `"${opp.createdAt || ''}"`
                ].join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `nbd-opportunities-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            this.showNotification('Error exporting data: ' + error.message, 'danger');
        }
    }

    downloadTemplate() {
        try {
            // Create template CSV content v4
            const headers = [
                'Name of Opportunity',
                'Type of Opportunity', 
                'Industry',
                'Organization Name',
                'State',
                'Due Date',
                'Link',
                'Go/No Go (Tier 1 (Go) - Tier 5 (No-Go))',
                'Additional Links/Information',
                'Submittal Type',
                'Notes',
                'PM',
                'Proposal Status',
                'Stage'
            ];

            const templateData = [
                [
                    '"Customer Service Training to City of Champaign Staff"',
                    '"Org Development"',
                    '"General Government (Local)"',
                    '"City of Champaign"',
                    '"IL"',
                    '"2025-09-25"',
                    '"https://example.com/rfp1"',
                    '"Tier 2: Go (with some conditions)"',
                    '"Additional information here"',
                    '"Email"',
                    '"Notes about this opportunity"',
                    '"Fred"',
                    '"Not Started"',
                    '"Submitted"'
                ],
                [
                    '"Metropolitan St. Louis Sewer District CIS"',
                    '"UBICS System Selection"',
                    '"IT"',
                    '"Metropolitan St. Louis Sewer District"',
                    '"MO"',
                    '"2025-09-29"',
                    '"https://example.com/rfp2"',
                    '"Tier 1: Go"',
                    '""',
                    '"Portal"',
                    '""',
                    '"Sondra/Sachin"',
                    '"In Progress"',
                    '"Interview"'
                ],
                [
                    '"New Castle County Parks Consultant"',
                    '"Org Assessment"',
                    '"General Government (Local)"',
                    '"New Castle County"',
                    '"DE"',
                    '"2025-09-30"',
                    '"https://example.com/rfp3"',
                    '"Tier 3: Needs additional deliberation"',
                    '""',
                    '"Mail"',
                    '""',
                    '"Sondra/Hibah"',
                    '"Not Started"',
                    '""'
                ]
            ];

            const csvContent = [
                headers.join(','),
                ...templateData.map(row => row.join(','))
            ].join('\n');

            this.downloadCSV(csvContent, 'NBD_Opportunities_Template_v4.csv');
            this.showNotification('Template downloaded successfully!', 'success');
        } catch (error) {
            this.showNotification('Error downloading template: ' + error.message, 'danger');
        }
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
                
                const importedOpportunities = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = this.parseCSVLine(lines[i]);
                        if (values.length >= headers.length) {
                            const opportunity = {
                                id: Date.now() + i,
                                name: values[0] || '',
                                type: values[1] || '',
                                industry: values[2] || '',
                                organization: values[3] || '',
                                state: values[4] || '',
                                dueDate: values[5] || '',
                                link: values[6] || '',
                                tier: values[7] || '',
                                additionalLinks: values[8] || '',
                                submittalType: values[9] || '',
                                notes: values[10] || '',
                                pm: values[11] || '',
                                status: values[12] || 'Not Started',
                                createdAt: values[13] || new Date().toISOString()
                            };
                            importedOpportunities.push(opportunity);
                        }
                    }
                }

                if (importedOpportunities.length > 0) {
                    // Check for duplicates and only add new opportunities
                    const existingOpportunities = this.opportunities;
                    const newOpportunities = [];
                    const duplicates = [];
                    
                    importedOpportunities.forEach(importedOpp => {
                        // Check if opportunity already exists based on name, organization, and due date
                        const isDuplicate = existingOpportunities.some(existingOpp => 
                            existingOpp.name === importedOpp.name &&
                            existingOpp.organization === importedOpp.organization &&
                            existingOpp.dueDate === importedOpp.dueDate
                        );
                        
                        if (isDuplicate) {
                            duplicates.push(importedOpp);
                        } else {
                            newOpportunities.push(importedOpp);
                        }
                    });
                    
                    // Add only new opportunities
                    if (newOpportunities.length > 0) {
                        this.opportunities = [...this.opportunities, ...newOpportunities];
                        this.saveData();
                        this.updateDashboard();
                        this.updateTable();
                        this.debouncedUpdate();
                    }
                    
                    // Show appropriate feedback
                    if (newOpportunities.length > 0 && duplicates.length > 0) {
                        this.showNotification(`Successfully imported ${newOpportunities.length} new opportunities. ${duplicates.length} duplicates were skipped.`, 'success');
                    } else if (newOpportunities.length > 0) {
                        this.showNotification(`Successfully imported ${newOpportunities.length} opportunities!`, 'success');
                    } else if (duplicates.length > 0) {
                        this.showNotification(`All ${duplicates.length} opportunities were duplicates and were skipped.`, 'warning');
                    }
                } else {
                    this.showNotification('No valid opportunities found in the file.', 'warning');
                }
            } catch (error) {
                this.showNotification('Error importing data: ' + error.message, 'danger');
            }
        };
        
        reader.readAsText(file);
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        this.updateBulkActions();
    }

    updateBulkActions() {
        const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        const bulkStatusBtn = document.getElementById('bulkStatusBtn');
        
        const hasSelection = selectedCheckboxes.length > 0;
        bulkDeleteBtn.disabled = !hasSelection;
        bulkStatusBtn.disabled = !hasSelection;

        // Update select all checkbox state
        const allCheckboxes = document.querySelectorAll('.row-checkbox');
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        
        if (allCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCheckboxes.length === allCheckboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCheckboxes.length > 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
    }

    bulkDelete() {
        const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        if (selectedCheckboxes.length === 0) return;

        const count = selectedCheckboxes.length;
        if (confirm(`Are you sure you want to delete ${count} ${count > 1 ? 'opportunities' : 'opportunity'}?`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
            this.opportunities = this.opportunities.filter(opp => !selectedIds.includes(opp.id));
            this.saveData();
            this.updateTable();
            this.updateDashboard();
            this.updateCalendar();
            this.showNotification(`${count} ${count > 1 ? 'opportunities' : 'opportunity'} deleted successfully!`, 'success');
        }
    }

    bulkUpdateStatus() {
        const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        if (selectedCheckboxes.length === 0) return;

        const newStatus = prompt('Enter new status (Not Started, In Progress, Complete):');
        if (!newStatus || !['Not Started', 'In Progress', 'Complete'].includes(newStatus)) {
            this.showNotification('Invalid status. Please enter: Not Started, In Progress, or Complete', 'warning');
            return;
        }

        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        let updatedCount = 0;

        this.opportunities.forEach(opp => {
            if (selectedIds.includes(opp.id)) {
                opp.status = newStatus;
                updatedCount++;
            }
        });

        this.saveData();
        this.updateTable();
        this.debouncedUpdate();
        this.showNotification(`${updatedCount} ${updatedCount > 1 ? 'opportunities' : 'opportunity'} updated successfully!`, 'success');
    }

    sortTable(column) {
        // Toggle sort direction if clicking the same column
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Update sort indicators
        document.querySelectorAll('.sortable i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });

        const currentHeader = document.querySelector(`[data-sort="${column}"] i`);
        if (currentHeader) {
            currentHeader.className = this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }

        // Update table
        this.updateTable();
    }

    setupInlineEditing() {
        document.querySelectorAll('.editable').forEach(cell => {
            cell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startInlineEdit(cell);
            });
        });
    }

    startInlineEdit(cell) {
        const field = cell.dataset.field;
        const id = parseInt(cell.dataset.id);
        const type = cell.dataset.type || 'text';
        const options = cell.dataset.options;

        const opportunity = this.opportunities.find(opp => opp.id === id);
        if (!opportunity) return;

        let currentValue = opportunity[field];
        if (field === 'dueDate' && currentValue) {
            currentValue = currentValue.split('T')[0]; // Format for date input
        }

        let input;
        if (type === 'select' && options) {
            input = document.createElement('select');
            const optionList = options.split(',');
            optionList.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                if (option === currentValue) {
                    optionElement.selected = true;
                }
                input.appendChild(optionElement);
            });
        } else if (type === 'date') {
            input = document.createElement('input');
            input.type = 'date';
            input.value = currentValue || '';
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue || '';
        }

        input.className = 'inline-edit-input';
        input.style.cssText = `
            width: 100%;
            padding: 0.5rem;
            border: 2px solid var(--primary);
            border-radius: 0.25rem;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 0.9rem;
        `;

        const originalContent = cell.innerHTML;
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();
        input.select();

        const saveEdit = () => {
            const newValue = input.value.trim();
            if (newValue !== currentValue) {
                opportunity[field] = newValue;
                this.saveData();
                this.debouncedUpdate();
                this.showNotification(`${field} updated successfully!`, 'success');
            }
            this.endInlineEdit(cell, field, opportunity);
        };

        const cancelEdit = () => {
            this.endInlineEdit(cell, field, opportunity, originalContent);
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        });
    }

    endInlineEdit(cell, field, opportunity, originalContent = null) {
        if (originalContent) {
            cell.innerHTML = originalContent;
        } else {
            // Update the cell content with new value
            const value = opportunity[field];
            if (field === 'tier') {
                cell.innerHTML = `<span class="tier-badge ${this.getTierClass(value)}">${this.escapeHtml(value)}</span>`;
            } else if (field === 'status') {
                cell.innerHTML = `<span class="status-badge ${this.getStatusClass(value)}">${this.escapeHtml(value)}</span>`;
            } else if (field === 'dueDate') {
                cell.innerHTML = this.formatDate(value);
            } else {
                cell.innerHTML = this.escapeHtml(value);
            }
        }
        
        // Re-setup inline editing for this cell
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            this.startInlineEdit(cell);
        });
    }

    getUploadedFiles() {
        const fileInput = document.getElementById('fileUpload');
        const files = Array.from(fileInput.files);
        return files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        }));
    }

    async uploadToSharePoint(files, sharepointSite, opportunityName) {
        if (!sharepointSite) {
            this.showNotification('SharePoint site URL is required for file upload', 'warning');
            return null;
        }

        try {
            this.showNotification('Uploading files to SharePoint...', 'info');
            
            // Extract site path from SharePoint URL
            const sitePath = this.extractSitePath(sharepointSite);
            const folderName = opportunityName.replace(/[^a-zA-Z0-9]/g, '_');
            
            const uploadedFiles = [];
            
            for (const file of files) {
                // Upload each file to SharePoint
                const fileUrl = await this.uploadFileToSharePoint(file, sitePath, folderName);
                if (fileUrl) {
                    uploadedFiles.push({
                        name: file.name,
                        url: fileUrl,
                        size: file.size,
                        uploadedAt: new Date().toISOString()
                    });
                }
            }

            this.showNotification(`Successfully uploaded ${uploadedFiles.length} file(s) to SharePoint`, 'success');
            return uploadedFiles;
        } catch (error) {
            this.showNotification('Error uploading to SharePoint: ' + error.message, 'danger');
            return null;
        }
    }

    extractSitePath(sharepointUrl) {
        // Extract site path from URL like: https://netorg633557.sharepoint.com/sites/landpeopleplace.com
        const match = sharepointUrl.match(/https:\/\/([^\/]+)\/sites\/([^\/]+)/);
        if (match) {
            return `${match[1]},${match[2]}`;
        }
        throw new Error('Invalid SharePoint URL format');
    }

    async uploadFileToSharePoint(file, sitePath, folderName) {
        try {
            // Get access token (you'll need to implement OAuth flow)
            const accessToken = await this.getAccessToken();
            
            // Create folder if it doesn't exist
            await this.createFolderIfNotExists(sitePath, folderName, accessToken);
            
            // Upload file
            const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${sitePath}/drive/root:/Shared Documents/${folderName}/${file.name}:/content`;
            
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': file.type
                },
                body: file
            });

            if (response.ok) {
                const result = await response.json();
                return result.webUrl;
            } else {
                throw new Error(`Upload failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    }

    async getAccessToken() {
        // This is where you'd implement OAuth 2.0 flow
        // For now, return a placeholder
        throw new Error('OAuth implementation needed. Please implement Microsoft Graph authentication.');
    }

    async createFolderIfNotExists(sitePath, folderName, accessToken) {
        try {
            const folderUrl = `https://graph.microsoft.com/v1.0/sites/${sitePath}/drive/root:/Shared Documents/${folderName}`;
            
            const response = await fetch(folderUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                // Folder doesn't exist, create it
                const createUrl = `https://graph.microsoft.com/v1.0/sites/${sitePath}/drive/root:/Shared Documents:/children`;
                
                await fetch(createUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: folderName,
                        folder: {},
                        '@microsoft.graph.conflictBehavior': 'rename'
                    })
                });
            }
        } catch (error) {
            console.error('Folder creation error:', error);
            throw error;
        }
    }

    async saveOpportunityWithFiles() {
        // Validate form before saving
        if (!this.validateForm()) {
            return;
        }

        // Handle PM "Other" option
        let pmValue = document.getElementById('pm').value;
        if (pmValue === 'Other') {
            pmValue = document.getElementById('pmOther').value.trim();
        }

        const opportunity = {
            id: Date.now(),
            name: document.getElementById('opportunityName').value.trim(),
            type: document.getElementById('opportunityType').value,
            industry: document.getElementById('industry').value,
            organization: document.getElementById('organizationName').value.trim(),
            state: document.getElementById('state').value,
            dueDate: document.getElementById('dueDate').value,
            link: document.getElementById('link').value.trim(),
            tier: document.querySelector('input[name="tier"]:checked')?.value,
            additionalLinks: document.getElementById('additionalLinks').value.trim(),
            submittalType: document.getElementById('submittalType').value,
            notes: document.getElementById('notes').value.trim(),
            pm: pmValue,
            status: document.getElementById('status').value,
            proposalStatus: document.getElementById('proposalStatus').value,
            createdAt: new Date().toISOString()
        };

        this.opportunities.push(opportunity);
        this.saveData();
        
        // Show success message
        this.showNotification('Opportunity saved successfully!', 'success');
        
        // Show SharePoint reminder popup
        setTimeout(() => {
            this.showSharePointReminderModal(opportunity.name, opportunity.organization);
        }, 1000);
        
        // Reset form and switch to dashboard
        this.resetWizard();
        this.switchView('dashboard');
    }

    // Authentication removed - app is now publicly accessible

    // All authentication methods removed - app is now publicly accessible
}

// Initialize the application
const nbdTracker = new NBDTracker();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .opportunity-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
    }
    
    .opportunity-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--shadow);
    }
    
    .opportunity-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
    }
    
    .opportunity-header h4 {
        font-size: 1rem;
        color: var(--text-primary);
        margin: 0;
    }
    
    .opportunity-details p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .opportunity-details p strong {
        min-width: 80px;
        text-align: left;
    }
    
    .team-member-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .member-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .member-header h4 {
        margin: 0;
        color: var(--text-primary);
    }
    
    .workload-count {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .workload-bar {
        width: 100%;
        height: 8px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .workload-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--info));
        transition: width 0.3s ease;
    }
    
    .opportunity-name strong {
        display: block;
        margin-bottom: 0.25rem;
    }
    
    .opportunity-name small {
        color: var(--text-secondary);
        font-size: 0.8rem;
    }
    
    .login-modal {
        max-width: 400px;
        width: 90%;
    }
    
    .login-modal .modal-header {
        text-align: center;
        background: var(--primary);
        color: white;
        border-radius: 0.5rem 0.5rem 0 0;
    }
    
    .login-modal .modal-header h3 {
        margin: 0;
        padding: 1rem;
    }
    
    .login-modal .modal-body {
        padding: 2rem;
    }
    
    .login-modal .form-group {
        margin-bottom: 1.5rem;
    }
    
    .btn-full {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
    }
    
    .login-error {
        background: var(--danger);
        color: white;
        padding: 0.75rem;
        border-radius: 0.25rem;
        margin-top: 1rem;
        text-align: center;
    }
    
    #loginModal {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }
    
    .login-footer {
        text-align: center;
        margin-top: 1rem;
    }
    
    .btn-link {
        background: none;
        border: none;
        color: var(--primary);
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .btn-link:hover {
        color: var(--primary-dark);
    }
    
    .reset-instructions {
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    
    .reset-instructions h4 {
        margin-top: 0;
        color: var(--primary);
    }
    
    .contact-info {
        background: var(--glass-bg);
        padding: 1rem;
        border-radius: 0.25rem;
        margin: 1rem 0;
        border-left: 4px solid var(--info);
    }
    
    .emergency-access {
        background: var(--glass-bg);
        padding: 1rem;
        border-radius: 0.25rem;
        margin: 1rem 0;
        border-left: 4px solid var(--warning);
    }
    
    .emergency-access code {
        background: var(--bg-primary);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-family: monospace;
        color: var(--warning);
        font-weight: bold;
    }
    
    .logo-image {
        height: 160px;
        width: auto;
        max-width: 180px;
        margin-right: 15px;
        vertical-align: middle;
        border-radius: 8px;
        transition: transform 0.3s ease;
    }
    
    /* Adjust header layout for larger logo */
    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .logo {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-right: 2rem;
    }
    
    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-left: auto;
        margin-right: 2rem;
    }
    
    .nav-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    /* Responsive logo sizing */
    @media (max-width: 1200px) {
        .logo-image {
            height: 120px;
            max-width: 140px;
        }
        .header-content {
            flex-wrap: wrap;
        }
        .header-actions {
            width: 100%;
            justify-content: center;
            margin-top: 1rem;
            margin-left: 0;
            margin-right: 0;
        }
        .nav-tabs {
            width: 100%;
            justify-content: center;
            margin-top: 0.5rem;
        }
    }
    
    @media (max-width: 768px) {
        .logo-image {
            height: 80px;
            max-width: 100px;
            margin-right: 12px;
        }
        .logo {
            margin-right: 1rem;
        }
        .header-actions {
            width: 100%;
            justify-content: flex-start;
            margin-top: 0.5rem;
            margin-left: 0;
            margin-right: 0;
        }
        .nav-tabs {
            width: 100%;
            justify-content: flex-start;
            margin-top: 0.5rem;
        }
    }
    
    @media (max-width: 480px) {
        .logo-image {
            height: 60px;
            max-width: 80px;
            margin-right: 8px;
        }
        .header-content {
            flex-direction: column;
            align-items: flex-start;
        }
        .logo {
            margin-right: 0;
            margin-bottom: 1rem;
        }
        .header-actions {
            width: 100%;
            justify-content: center;
            margin: 0.5rem 0;
        }
        .nav-tabs {
            width: 100%;
            justify-content: center;
        }
    }
    
    /* Logo hover effect */
    .logo-image:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);
