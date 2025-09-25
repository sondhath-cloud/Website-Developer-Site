	// CACHE BUSTER: Updated 2024-08-20 - Fixed localStorage fallback for dynamic form elements
	// VERSION 6: Fixed approach positioning - approaches now appear in correct location
	(() => {
	// DOM elements
	const form = document.getElementById('proposalForm');
	const logoInput = document.getElementById('logoInput');
	const logoPreview = document.getElementById('logoPreview');

	const orgInput = document.getElementById('organizationName');
	const clientInput = document.getElementById('clientName');
	const titleInput = document.getElementById('projectTitle');
	const problemInput = document.getElementById('problemStatement');
	const scopeInput = document.getElementById('scope');
	const deliverablesList = document.getElementById('deliverablesList');
	const addDeliverableBtn = document.getElementById('addDeliverableBtn');
	const timelineInput = document.getElementById('timeline');
	const feeInput = document.getElementById('fee');
	const assumptionsInput = document.getElementById('assumptions');
	const contactInput = document.getElementById('contact');
	const contactNameInput = document.getElementById('contactName');
	const contactAddressInput = document.getElementById('contactAddress');
	const contactEmailInput = document.getElementById('contactEmail');
	const dateDueInput = document.getElementById('dateDue');
	const isPaperCheckbox = document.getElementById('isPaper');
	const timelineEnabled = document.getElementById('timelineEnabled');
	const isCityCheckbox = document.getElementById('isCity');
	const isCountyCheckbox = document.getElementById('isCounty');
	const isTownCheckbox = document.getElementById('isTown');
	const isVillageCheckbox = document.getElementById('isVillage');
	const apSel = document.getElementById('apSel');
	const apImpl = document.getElementById('apImpl');
	const apStrat = document.getElementById('apStrat');
	const apOrg = document.getElementById('apOrg');
	const apChange = document.getElementById('apChange');
	const includeCostCheckbox = document.getElementById('includeCost');

	const optExecSummary = document.getElementById('optExecSummary');
	const execSummaryWrap = document.getElementById('execSummaryWrap');
	const execSummaryInput = document.getElementById('execSummary');

	const optRisks = document.getElementById('optRisks');
	const risksWrap = document.getElementById('risksWrap');
	const risksInput = document.getElementById('risks');

	const optReferences = document.getElementById('optReferences');
	const referencesWrap = document.getElementById('referencesWrap');
	const referencesInput = document.getElementById('references');

	const optTerms = document.getElementById('optTerms');
	const termsWrap = document.getElementById('termsWrap');
	const termsInput = document.getElementById('terms');

	const exportPresetBtn = document.getElementById('exportPresetBtn');
	const importPresetInput = document.getElementById('importPresetInput');



	const generateBtn = document.getElementById('generateBtn');
	const generateDocxBtn = document.getElementById('generateDocxBtn');
	const generateDocxTplBtn = document.getElementById('generateDocxTplBtn');
	const downloadTplBtn = document.getElementById('downloadTplBtn');
	const themeSelect = document.getElementById('themeSelect');

	let logoDataUrl = null;
	let logoReadyResolve = null;
	let logoReadyPromise = new Promise((resolve) => { logoReadyResolve = resolve; });
	const DEFAULT_LOGO_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjQwJyBoZWlnaHQ9JzgwJyB2aWV3Qm94PScwIDAgMjQwIDgwJyBmaWxsPSdub25lJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxkZWZzPjxtb3Rpb24gaWQ9J2cnIGR1cj0nM3MnIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJy8+PC9kZWZzPjxyZWN0IHdpZHRoPScyNDAnIGhlaWdodD0nODAnIGZpbGw9JyM2MGI2ZmEnIHJ4PScxMicvPjxnIG1hc2s9InVybCgjZykiPjxyZWN0IHdpZHRoPScyNDAnIGhlaWdodD0nODAnIGZpbGw9J3JnYmEoOTUsIDE1NywgMjUwLCAwLjIpJy8+PC9nPjx0ZXh0IHg9JzEyMCcgeT0nNDUnIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0nMjEnIGZpbGw9J3doaXRlJyBmb250LXdlaWdodD0nNjAwJz5PcmdMb2dvPC90ZXh0Pjwvc3ZnPg==";

	function loadDefaultLogoFromStorageOrEmbed() {
		try {
			const stored = localStorage.getItem('proposal_default_logo');
			if (stored) return stored;
			return DEFAULT_LOGO_DATA_URL;
		} catch {
			return DEFAULT_LOGO_DATA_URL;
		}
	}

	async function fetchAsDataURL(url) {
		const res = await fetch(url);
		if (!res.ok) throw new Error('Failed to fetch resource');
		const blob = await res.blob();
		return await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(new Error('Failed to read blob'));
			reader.readAsDataURL(blob);
		});
	}

	function imageUrlToDataURLViaCanvas(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				try {
					const canvas = document.createElement('canvas');
					canvas.width = img.naturalWidth || img.width;
					canvas.height = img.naturalHeight || img.height;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0);
					const dataUrl = canvas.toDataURL('image/png');
					resolve(dataUrl);
				} catch (e) {
					reject(e);
				}
			};
			img.onerror = () => reject(new Error('Image load failed'));
			img.src = url + '?v=' + Date.now();
		});
	}

	function dataUrlToUint8Array(dataUrl) {
		try {
			const base64 = dataUrl.split(',')[1] || '';
			const binary = atob(base64);
			const len = binary.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
			return bytes;
		} catch {
			return null;
		}
	}

	let docxReadyPromise = null;

	function ensureDocxLoaded() {
		if (window.docx) return Promise.resolve();
		if (docxReadyPromise) return docxReadyPromise;
		// Try jsDelivr first, then unpkg as fallback
		docxReadyPromise = new Promise((resolve, reject) => {
			function addScript(src, onload, onerror) {
				const s = document.createElement('script');
				s.src = src;
				s.async = true;
				s.onload = onload;
				s.onerror = onerror;
				document.head.appendChild(s);
			}
			const tryJsDelivrNonMin = () => addScript('https://cdn.jsdelivr.net/npm/docx@7.1.0/build/index.js', () => resolve(), () => tryUnpkgMin());
			const tryUnpkgMin = () => addScript('https://unpkg.com/docx@7.1.0/build/index.min.js', () => resolve(), () => reject(new Error('Failed to load docx from CDNs.')));
			addScript('https://cdn.jsdelivr.net/npm/docx@7.1.0/build/index.min.js', () => resolve(), () => tryJsDelivrNonMin());
		});
		return docxReadyPromise;
	}

	// Helpers
	function showError(inputEl, message) {
		const id = inputEl?.id;
		const errorEl = id ? form.querySelector(`.error-msg[data-error-for="${id}"]`) : null;
		if (inputEl) inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
		if (errorEl) errorEl.textContent = message || '';
	}

	function showGroupError(groupKey, message) {
		const errorEl = form.querySelector(`.error-msg[data-error-for="${groupKey}"]`);
		if (errorEl) errorEl.textContent = message || '';
	}

	function clearAllErrors() {
		form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.setAttribute('aria-invalid', 'false'));
		form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
	}

	function hideRowByInputId(inputId) {
		const el = document.getElementById(inputId);
		if (!el) return;
		const row = el.closest('.form-row');
		if (row) row.hidden = true;
	}

	// Theme Management
	function loadTheme() {
		const savedTheme = localStorage.getItem('proposal_theme') || 'cyberpunk';
		document.body.className = `theme-${savedTheme}`;
		if (themeSelect) {
			themeSelect.value = savedTheme;
		}
	}

	function changeTheme(theme) {
		document.body.className = `theme-${theme}`;
		localStorage.setItem('proposal_theme', theme);
	}

	// Dynamic form management functions
	async function addJurisdiction() {
		console.log('addJurisdiction function called');
		const jurisdictionInput = document.getElementById('newJurisdiction');
		if (!jurisdictionInput) {
			console.log('newJurisdiction input element not found');
			return;
		}
		const jurisdiction = jurisdictionInput.value.trim();
		if (!jurisdiction) {
			console.log('No jurisdiction entered, input value is:', jurisdictionInput.value);
			return;
		}
		console.log('Adding jurisdiction:', jurisdiction);

		try {
			// Try to add to server first
			const response = await fetch('/api/jurisdictions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ jurisdiction })
			});

			if (response.ok) {
				// Server call succeeded
				const checkboxRow = document.createElement('div');
				checkboxRow.className = 'checkbox-row';
				checkboxRow.innerHTML = `
					<input id="is${jurisdiction.replace(/\s+/g, '')}" type="checkbox" />
					<label for="is${jurisdiction.replace(/\s+/g, '')}">${jurisdiction}</label>
					<button type="button" class="btn-danger btn-small" onclick="removeJurisdiction('${jurisdiction}', this)">Remove</button>
				`;
				
				// Insert before the hint
				const hint = document.querySelector('.hint');
				if (hint) {
					hint.parentNode.insertBefore(checkboxRow, hint);
					console.log('Jurisdiction added to form via API');
				} else {
					console.log('Hint element not found');
				}

				jurisdictionInput.value = '';
				return; // Success, exit function
			}
			
			// If we get here, response was not ok
			throw new Error(`Server responded with status ${response.status}`);
			
		} catch (error) {
			console.error('Error adding jurisdiction via API, falling back to localStorage:', error);
			
			// Fallback to localStorage
			try {
				let jurisdictions = JSON.parse(localStorage.getItem('proposal_jurisdictions') || '[]');
				if (!jurisdictions.includes(jurisdiction)) {
					jurisdictions.push(jurisdiction);
					localStorage.setItem('proposal_jurisdictions', JSON.stringify(jurisdictions));
					
					// Add checkbox to form
					const checkboxRow = document.createElement('div');
					checkboxRow.className = 'checkbox-row';
					checkboxRow.innerHTML = `
						<input id="is${jurisdiction.replace(/\s+/g, '')}" type="checkbox" />
						<label for="is${jurisdiction.replace(/\s+/g, '')}">${jurisdiction}</label>
						<button type="button" class="btn-danger btn-small" onclick="removeJurisdiction('${jurisdiction}', this)">Remove</button>
					`;
					
					// Insert before the hint
					const hint = document.querySelector('.hint');
					if (hint) {
						hint.parentNode.insertBefore(checkboxRow, hint);
						console.log('Jurisdiction added to form via localStorage');
					}
					
					jurisdictionInput.value = '';
				} else {
					alert('This jurisdiction already exists.');
				}
			} catch (localError) {
				console.error('Error with localStorage fallback:', localError);
				alert('Failed to add jurisdiction. Please try again.');
			}
		}
	}

	// Make functions globally accessible
	window.addJurisdiction = addJurisdiction;
	window.removeJurisdiction = removeJurisdiction;
	window.addProjectManager = addProjectManager;
	window.removeProjectManager = removeProjectManager;
	window.addApproach = addApproach;
	window.removeApproach = removeApproach;

	async function removeJurisdiction(jurisdiction, button) {
		// Check if this is a built-in jurisdiction
		const builtInJurisdictions = ['City', 'County', 'Town', 'Village'];
		
		if (builtInJurisdictions.includes(jurisdiction)) {
			// For built-in jurisdictions, just hide the row
			button.closest('.checkbox-row').style.display = 'none';
			return;
		}
		
		try {
			// Try to remove from server first
			const response = await fetch(`/api/jurisdictions/${encodeURIComponent(jurisdiction)}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// Remove from form
				button.closest('.checkbox-row').remove();
			} else {
				throw new Error('Failed to remove jurisdiction from server');
			}
		} catch (error) {
			console.error('Error removing jurisdiction via API, falling back to localStorage:', error);
			
			// Fallback to localStorage
			try {
				let jurisdictions = JSON.parse(localStorage.getItem('proposal_jurisdictions') || '[]');
				jurisdictions = jurisdictions.filter(j => j !== jurisdiction);
				localStorage.setItem('proposal_jurisdictions', JSON.stringify(jurisdictions));
				
				// Remove from form
				button.closest('.checkbox-row').remove();
			} catch (localError) {
				console.error('Error with localStorage fallback:', localError);
				alert('Failed to remove jurisdiction. Please try again.');
			}
		}
	}

	window.removeJurisdiction = removeJurisdiction;

	async function addProjectManager() {
		const pmInput = document.getElementById('newProjectManager');
		const pm = pmInput.value.trim();
		if (!pm) return;

		try {
			// Try to add to server first
			const response = await fetch('/api/project-managers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ projectManager: pm })
			});

			if (response.ok) {
				// Server call succeeded
				const pmRow = document.createElement('div');
				pmRow.className = 'checkbox-row';
				pmRow.innerHTML = `
					<input id="pm_${pm.replace(/\s+/g, '')}" name="projectManager" type="radio" value="${pm}" />
					<label for="pm_${pm.replace(/\s+/g, '')}">${pm}</label>
					<button type="button" class="btn-danger btn-small" onclick="removeProjectManager('${pm}', this)">Remove</button>
				`;
				
				// Add to the project manager list
				const projectManagerList = document.getElementById('projectManagerList');
				if (projectManagerList) {
					projectManagerList.appendChild(pmRow);
				}

				pmInput.value = '';
				return; // Success, exit function
			}
			
			// If we get here, response was not ok
			throw new Error(`Server responded with status ${response.status}`);
			
		} catch (error) {
			console.error('Error adding project manager via API, falling back to localStorage:', error);
			
			// Fallback to localStorage
			try {
				let projectManagers = JSON.parse(localStorage.getItem('proposal_project_managers') || '[]');
				if (!projectManagers.includes(pm)) {
					projectManagers.push(pm);
					localStorage.setItem('proposal_project_managers', JSON.stringify(projectManagers));
					
					// Add to form
					const pmRow = document.createElement('div');
					pmRow.className = 'checkbox-row';
					pmRow.innerHTML = `
						<input id="pm_${pm.replace(/\s+/g, '')}" name="projectManager" type="radio" value="${pm}" />
						<label for="pm_${pm.replace(/\s+/g, '')}">${pm}</label>
						<button type="button" class="btn-danger btn-small" onclick="removeProjectManager('${pm}', this)">Remove</button>
					`;
					
					// Add to the project manager list
					const projectManagerList = document.getElementById('projectManagerList');
					if (projectManagerList) {
						projectManagerList.appendChild(pmRow);
					}
					
					pmInput.value = '';
				} else {
					alert('This project manager already exists.');
				}
			} catch (localError) {
				console.error('Error with localStorage fallback:', localError);
				alert('Failed to add project manager. Please try again.');
			}
		}
	}

	window.addProjectManager = addProjectManager;

	async function removeProjectManager(pm, button) {
		try {
			// Try to remove from server first
			const response = await fetch(`/api/project-managers/${encodeURIComponent(pm)}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// Remove from form
				button.closest('.checkbox-row').remove();
			} else {
				throw new Error('Failed to remove project manager from server');
			}
		} catch (error) {
			console.error('Error removing project manager via API, falling back to localStorage:', error);
			
			// Fallback to localStorage
			try {
				let projectManagers = JSON.parse(localStorage.getItem('proposal_project_managers') || '[]');
				projectManagers = projectManagers.filter(p => p !== pm);
				localStorage.setItem('proposal_project_managers', JSON.stringify(projectManagers));
				
				// Remove from form
				button.closest('.checkbox-row').remove();
			} catch (localError) {
				console.error('Error with localStorage fallback:', localError);
				alert('Failed to remove project manager. Please try again.');
			}
		}
	}

	window.removeProjectManager = removeProjectManager;

	async function addApproach() {
		const approachInput = document.getElementById('newApproach');
		const approach = approachInput.value.trim();
		if (!approach) return;

		try {
			// Try to add to server first
			const response = await fetch('/api/approaches', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ approach })
			});

			if (response.ok) {
				// Server call succeeded
				const radioRow = document.createElement('div');
				radioRow.className = 'checkbox-row';
				radioRow.innerHTML = `
					<input id="ap_${approach.replace(/\s+/g, '')}" name="approachOne" type="radio" />
					<label for="ap_${approach.replace(/\s+/g, '')}">${approach}</label>
					<button type="button" class="btn-danger btn-small" onclick="removeApproach('${approach}', this)">Remove</button>
				`;
				
				// Find the approach section and add the new approach inside it
				const approachSection = document.querySelector('label[for="apSel"]').closest('.form-row').parentNode;
				if (approachSection) {
					// Find the "Add new approach" input field and insert before it
					const addNewInput = approachSection.querySelector('input[id="newApproach"]');
					if (addNewInput) {
						const addNewRow = addNewInput.closest('.form-row');
						if (addNewRow) {
							approachSection.insertBefore(radioRow, addNewRow);
						} else {
							// Fallback: append to the end
							approachSection.appendChild(radioRow);
						}
					} else {
						// Fallback: append to the end
						approachSection.appendChild(radioRow);
					}
				}

				approachInput.value = '';
				return; // Success, exit function
			}
			
			// If we get here, response was not ok
			throw new Error(`Server responded with status ${response.status}`);
			
		} catch (error) {
			console.error('Error adding approach via API, falling back to localStorage:', error);
			
			// Fallback to localStorage
			try {
				let approaches = JSON.parse(localStorage.getItem('proposal_approaches') || '[]');
				if (!approaches.includes(approach)) {
					approaches.push(approach);
					localStorage.setItem('proposal_approaches', JSON.stringify(approaches));
					
					// Add radio button to form
					const radioRow = document.createElement('div');
					radioRow.className = 'checkbox-row';
					radioRow.innerHTML = `
						<input id="ap_${approach.replace(/\s+/g, '')}" name="approachOne" type="radio" />
						<label for="ap_${approach.replace(/\s+/g, '')}">${approach}</label>
						<button type="button" class="btn-danger btn-small" onclick="removeApproach('${approach}', this)">Remove</button>
					`;
					
					// Find the approach section and add the new approach inside it
					const approachSection = document.querySelector('label[for="apSel"]').closest('.form-row').parentNode;
					if (approachSection) {
						// Find the "Add new approach" input field and insert before it
						const addNewInput = approachSection.querySelector('input[id="newApproach"]');
						if (addNewInput) {
							const addNewRow = addNewInput.closest('.form-row');
							if (addNewRow) {
								approachSection.insertBefore(radioRow, addNewRow);
							} else {
								// Fallback: append to the end
								approachSection.appendChild(radioRow);
							}
						} else {
							// Fallback: append to the end
							approachSection.appendChild(radioRow);
						}
					}
					
					approachInput.value = '';
				} else {
					alert('This approach already exists.');
				}
			} catch (localError) {
				console.error('Error with localStorage fallback:', localError);
				alert('Failed to add approach. Please try again.');
			}
		}
	}

	window.addApproach = addApproach;

	async function removeApproach(approach, button) {
		// Check if this is a built-in approach
		const builtInApproaches = ['System Selection', 'System Implementation', 'Strategic Plan', 'Organizational Assessment', 'Change Management'];
		
		if (builtInApproaches.includes(approach)) {
			// For built-in approaches, just hide the row
			button.closest('.checkbox-row').style.display = 'none';
			return;
		}
		
		try {
			// Remove from server for dynamically added approaches
			const response = await fetch(`/api/approaches/${encodeURIComponent(approach)}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to remove approach');
			}

			// Remove from form
			button.closest('.checkbox-row').remove();
		} catch (error) {
			console.error('Error removing approach:', error);
			alert('Failed to remove approach. Please try again.');
		}
	}

	window.removeApproach = removeApproach;

	async function loadDynamicOptions() {
		try {
			// Load all form options from server
			const response = await fetch('/api/form-options');
			if (!response.ok) {
				throw new Error('Failed to load form options');
			}
			
			const data = await response.json();

			// Load jurisdictions
			data.jurisdictions.forEach(jurisdiction => {
				const checkboxRow = document.createElement('div');
				checkboxRow.className = 'checkbox-row';
				checkboxRow.innerHTML = `
					<input id="is${jurisdiction.replace(/\s+/g, '')}" type="checkbox" />
					<label for="is${jurisdiction.replace(/\s+/g, '')}">${jurisdiction}</label>
					<button type="button" class="btn-danger btn-small" onclick="removeJurisdiction('${jurisdiction}', this)">Remove</button>
				`;
				const hint = document.querySelector('.hint');
				if (hint) {
					hint.parentNode.insertBefore(checkboxRow, hint);
				}
			});

			// Load project managers
			data.projectManagers.forEach(pm => {
				const pmRow = document.createElement('div');
				pmRow.className = 'checkbox-row';
				pmRow.innerHTML = `
					<input id="pm_${pm.replace(/\s+/g, '')}" name="projectManager" type="radio" value="${pm}" />
					<label for="pm_${pm.replace(/\s+/g, '')}">${pm}</label>
					<button type="button" class="btn-danger btn-small" onclick="removeProjectManager('${pm}', this)">Remove</button>
				`;
				const projectManagerList = document.getElementById('projectManagerList');
				if (projectManagerList) {
					projectManagerList.appendChild(pmRow);
				}
			});

					// Load approaches - only show built-in approaches, clear any old localStorage data
		// Clear old approach data from localStorage to prevent random approaches from appearing
		localStorage.removeItem('proposal_approaches');
		
		// No need to load approaches since they're static in the HTML
		} catch (error) {
			console.error('Error loading dynamic options:', error);
			// Fallback to localStorage if server is not available
			console.log('Falling back to localStorage...');
			loadFromLocalStorage();
		}
	}

	// Fallback function for localStorage
	function loadFromLocalStorage() {
		// Load jurisdictions
		const jurisdictions = JSON.parse(localStorage.getItem('proposal_jurisdictions') || '[]');
		jurisdictions.forEach(jurisdiction => {
			const checkboxRow = document.createElement('div');
			checkboxRow.className = 'checkbox-row';
			checkboxRow.innerHTML = `
				<input id="is${jurisdiction.replace(/\s+/g, '')}" type="checkbox" />
				<label for="is${jurisdiction.replace(/\s+/g, '')}">${jurisdiction}</label>
				<button type="button" class="btn-danger btn-small" onclick="removeJurisdiction('${jurisdiction}', this)">Remove</button>
			`;
			const hint = document.querySelector('.hint');
			if (hint) {
				hint.parentNode.insertBefore(checkboxRow, hint);
			}
		});

		// Load project managers
		let projectManagers = JSON.parse(localStorage.getItem('proposal_project_managers') || '[]');
		if (projectManagers.length === 0) {
			projectManagers = [
				'Fred',
				'Hibah',
				'Mayita',
				'Mike',
				'Sachin',
				'Sondra'
			];
		}
		
		projectManagers.forEach(pm => {
			const pmRow = document.createElement('div');
			pmRow.className = 'checkbox-row';
			pmRow.innerHTML = `
				<input id="pm_${pm.replace(/\s+/g, '')}" name="projectManager" type="radio" value="${pm}" />
				<label for="pm_${pm.replace(/\s+/g, '')}">${pm}</label>
				<button type="button" class="btn-danger btn-small" onclick="removeProjectManager('${pm}', this)">Remove</button>
			`;
			const projectManagerList = document.getElementById('projectManagerList');
			if (projectManagerList) {
				projectManagerList.appendChild(pmRow);
			}
		});

		// Load approaches - only show built-in approaches, clear any old localStorage data
		localStorage.removeItem('proposal_approaches');
		
		// No need to load approaches since they're static in the HTML
	}

	function createDeliverableRow(value = '') {
		const row = document.createElement('div');
		row.className = 'deliverable-row';

		const input = document.createElement('input');
		input.type = 'text';
		input.className = 'glass-input';
		input.placeholder = 'e.g., Kickoff workshop';
		input.value = value;

		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'btn-danger';
		btn.textContent = 'Remove';
		btn.addEventListener('click', () => {
			row.remove();
		});

		row.appendChild(input);
		row.appendChild(btn);
		return row;
	}



	function readImageAsDataURL(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(new Error('Failed to read the image file.'));
			reader.readAsDataURL(file);
		});
	}

	function formatDateYYYYMMDD(date = new Date()) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}

	function suggestedFileName(client, dateStr) {
		const safeClient = (client || 'Client').replace(/[^\w\-]+/g, '_');
		return `Proposal_${safeClient}_${dateStr}.pdf`;
	}

	function suggestedDocxName(client, dateStr) {
		const safeClient = (client || 'Client').replace(/[^\w\-]+/g, '_');
		return `Proposal_${safeClient}_${dateStr}.docx`;
	}

	function collectFormData() {
		const deliverables = deliverablesList
			? Array.from(deliverablesList.querySelectorAll('input[type="text"]'))
				.map(i => i.value.trim())
				.filter(v => v.length > 0)
			: [];



		return {
			organizationName: orgInput ? orgInput.value.trim() : '',
			clientName: clientInput.value.trim(),
			projectTitle: titleInput.value.trim(),
			problemStatement: problemInput ? problemInput.value.trim() : '',
			scope: scopeInput ? scopeInput.value.trim() : '',
			deliverables,
			timeline: timelineInput ? timelineInput.value.trim() : '',
			fee: feeInput.value.trim(),
			assumptions: assumptionsInput ? assumptionsInput.value.trim() : '',
			contact: contactInput ? contactInput.value.trim() : '',
			contactName: contactNameInput.value.trim(),
			contactAddress: contactAddressInput.value.trim(),
			contactEmail: contactEmailInput.value.trim(),
			dateDue: dateDueInput.value,
			isPaper: !!isPaperCheckbox?.checked,
			jurisdictionType: isCityCheckbox?.checked ? 'City' : (isCountyCheckbox?.checked ? 'County' : (isTownCheckbox?.checked ? 'Town' : (isVillageCheckbox?.checked ? 'Village' : ''))),
			approachSelections: (() => {
				return {
					systemSelection: !!apSel?.checked,
					systemImplementation: !!apImpl?.checked,
					strategicPlan: !!apStrat?.checked,
					organizationalAssessment: !!apOrg?.checked,
					changeManagement: !!apChange?.checked
				};
			})(),
			isCity: !!isCityCheckbox?.checked,
			isCounty: !!isCountyCheckbox?.checked,
			isTown: !!isTownCheckbox?.checked,
			isVillage: !!isVillageCheckbox?.checked,
			includeCost: !!includeCostCheckbox?.checked,
			projectManager: '',
			includeExecSummary: optExecSummary.checked,
			execSummary: execSummaryInput.value.trim(),
			includeRisks: optRisks.checked,
			risks: risksInput.value.trim(),
			includeReferences: true,
			references: document.getElementById('references')?.value.trim() || '',
			includeTerms: optTerms.checked,
			terms: termsInput.value.trim()
		};
	}

	function validateForm(data) {
		let valid = true;
		clearAllErrors();
		// Ensure exactly one approach is selected
		const approachCount = [data.approachSelections.systemSelection, data.approachSelections.systemImplementation, data.approachSelections.strategicPlan, data.approachSelections.organizationalAssessment, data.approachSelections.changeManagement].filter(Boolean).length;
		if (approachCount !== 1) {
			showGroupError('approach', 'Please select exactly one approach.');
			valid = false;
		}

		// organization is no longer required, but client name is required
		if (!data.clientName) {
			showError(clientInput, 'Client name is required.');
			valid = false;
		}
		if (!data.projectTitle) {
			showError(titleInput, 'Project title is required.');
			valid = false;
		}
		// problem/scope removed from required
		// deliverables optional now
		// timeline not required anymore
		// fee optional now
		// contact block removed from required
		if (!data.contactName) {
			showError(contactNameInput, 'Contact name is required.');
			valid = false;
		}
		// contact email optional now
		// Logo is recommended but not required. If missing, we'll render a text header fallback.

		return valid;
	}

	// Presets
	function exportPreset() {
		const data = collectFormData();
		// We do not include the logo image for privacy/size reasons.
		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `proposal_preset_${formatDateYYYYMMDD()}.json`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(a.href);
	}

	function importPreset(file) {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result);
				// Push values if present
				orgInput.value = data.organizationName || '';
				clientInput.value = data.clientName || '';
				titleInput.value = data.projectTitle || '';
				problemInput.value = data.problemStatement || '';
				scopeInput.value = data.scope || '';

				// Reset deliverables (block may be absent)
				if (deliverablesList) {
					deliverablesList.innerHTML = '';
					(data.deliverables || ['']).forEach(d => {
						deliverablesList.appendChild(createDeliverableRow(d));
					});
				}

				timelineInput.value = data.timeline || '';
				feeInput.value = data.fee || '';
				assumptionsInput.value = data.assumptions || '';
				contactInput.value = data.contact || '';

				optExecSummary.checked = !!data.includeExecSummary;
				execSummaryWrap.hidden = !optExecSummary.checked;
				execSummaryInput.value = data.execSummary || '';

				optRisks.checked = !!data.includeRisks;
				risksWrap.hidden = !optRisks.checked;
				risksInput.value = data.risks || '';

				optReferences.checked = !!data.includeReferences;
				referencesWrap.hidden = !optReferences.checked;
				referencesInput.value = data.references || '';

				optTerms.checked = !!data.includeTerms;
				termsWrap.hidden = !optTerms.checked;
				termsInput.value = data.terms || '';
			} catch (e) {
				alert('Invalid preset JSON file.');
			}
		};
		reader.onerror = () => alert('Failed to read preset file.');
		reader.readAsText(file);
	}

	async function generateDocxFromTemplate() {
		try { await logoReadyPromise; } catch {}
		const data = collectFormData();
		if (!validateForm(data)) {
			const invalid = form.querySelector('[aria-invalid="true"]');
			if (invalid) invalid.focus();
			return;
		}

		try {
			if (!window.PizZip || !window.docxtemplater) {
				alert('Template engine failed to load. Please check that all CDN scripts loaded properly.');
				return;
			}
			const res = await fetch('template.docx?v=' + Date.now());
			if (!res.ok) {
				alert('template.docx was not found in the project folder.');
				return;
			}
			const arrayBuffer = await res.arrayBuffer();
			const zip = new window.PizZip(arrayBuffer);
			const doc = new window.docxtemplater().loadZip(zip);
			// Be forgiving if a tag is missing: render empty string instead of throwing
			doc.setOptions({ nullGetter: () => '' });
			const today = new Date().toLocaleDateString();

			// Default approach texts (customize as needed)
			const approachTexts = {
				systemSelection: 'We will facilitate requirements discovery, draft RFP artifacts, manage vendor Q&A, score proposals, and run demos to select the best-fit system.',
				systemImplementation: 'We will plan and execute implementation, including configuration, data migration, testing, training, and go-live support with change management.',
				strategicPlan: 'We will assess current state, engage stakeholders, define future-state vision and objectives, and produce a prioritized roadmap with budget and timeline.',
				organizationalAssessment: 'We will evaluate structure, roles, processes, and capacity, and provide recommendations to optimize people, process, and technology alignment.',
				changeManagement: 'We will deliver a change strategy, communications plan, training, and adoption metrics to ensure successful transition and sustained outcomes.'
			};

			const ctxApproach = {
				approach_system_selection: !!data.approachSelections?.systemSelection,
				approach_system_selection_text: approachTexts.systemSelection,
				approach_system_implementation: !!data.approachSelections?.systemImplementation,
				approach_system_implementation_text: approachTexts.systemImplementation,
				approach_strategic_plan: !!data.approachSelections?.strategicPlan,
				approach_strategic_plan_text: approachTexts.strategicPlan,
				approach_organizational_assessment: !!data.approachSelections?.organizationalAssessment,
				approach_organizational_assessment_text: approachTexts.organizationalAssessment,
				approach_change_management: !!data.approachSelections?.changeManagement,
				approach_change_management_text: approachTexts.changeManagement
			};

			// Cost section text (optional)
			const cost_section = data.fee ? `Published budget: ${data.fee}. Our detailed cost proposal can be provided upon request.` : 'Cost details available upon request.';
			const ctx = {
				organizationName: data.organizationName,
				clientName: data.clientName,
				projectTitle: data.projectTitle,
				date: today,
				problemStatement: data.problemStatement,
				scope: data.scope,
				deliverables: data.deliverables.map(d => ({ item: d })),
				timeline: data.timeline,
				fee: data.fee,
				assumptions: data.assumptions,
				execSummary: data.includeExecSummary ? data.execSummary : '',
				risks: data.includeRisks ? data.risks : '',
				references: data.includeReferences ? data.references : '',
				terms: data.includeTerms ? data.terms : '',
				contact: data.contact,
				contactName: data.contactName,
				contactAddress: data.contactAddress,
				contactEmail: data.contactEmail,
				dateDue: data.dateDue,
				jurisdictionType: data.jurisdictionType,
				isPaper: data.isPaper,
				projectManager: data.projectManager,
				includeCost: !!data.includeCost,
				cost_section,
				...ctxApproach
			};
			doc.setData(ctx);
			try { doc.render(); } catch (e) {
				console.error(e);
				let msg = 'Failed to render template.';
				const details = e && e.properties && e.properties.errors;
				if (Array.isArray(details) && details.length) {
					const first = details[0];
					const explanation = first.explanation || first.properties || first.message || '';
					msg += `\nHint: ${explanation}`;
				}
				alert(msg);
				return;
			}
			const out = doc.getZip().generate({ type: 'blob' , mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
			const filename = suggestedDocxName(data.clientName, formatDateYYYYMMDD());
			await saveBlobWithPickerOrDownload(out, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
		} catch (err) {
			alert('DOCX template generation failed.');
		}
	}

	async function saveBlobWithPickerOrDownload(blob, filename, mime) {
		const supportsFS = typeof window.showSaveFilePicker === 'function';
		if (supportsFS) {
			try {
				const isDocx = (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') || /\.docx$/i.test(filename);
				const types = [
					isDocx
						? { description: 'Word Document', accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } }
						: { description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }
				];
				const handle = await window.showSaveFilePicker({
					suggestedName: filename,
					types
				});
				const writable = await handle.createWritable();
				await writable.write(blob);
				await writable.close();
				return;
			} catch (err) {
				// If the user cancels, do nothing. If it fails for other reasons, fall back to download.
				if (err && err.name === 'AbortError') return;
			}
		}
		// Fallback: download
		const url = URL.createObjectURL(blob);
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		if (isSafari) {
			// Safari often ignores programmatic clicks with download; open in a new tab instead
			const newTab = window.open(url, '_blank');
			setTimeout(() => URL.revokeObjectURL(url), 2000);
			return;
		}
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.rel = 'noopener';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	// Events
	if (logoInput) logoInput.addEventListener('change', async () => {
		if (logoPreview) logoPreview.innerHTML = '';
		const file = logoInput.files && logoInput.files[0];
		if (!file) {
			logoDataUrl = loadDefaultLogoFromStorageOrEmbed();
			if (logoReadyResolve) logoReadyResolve();
			return;
		}
		try {
			logoDataUrl = await readImageAsDataURL(file);
			if (logoPreview) {
				const img = document.createElement('img');
				img.src = logoDataUrl;
				img.alt = 'Logo preview';
				logoPreview.appendChild(img);
			}
			try { localStorage.setItem('proposal_default_logo', logoDataUrl); } catch {}
			if (logoReadyResolve) logoReadyResolve();
		} catch {
			logoDataUrl = loadDefaultLogoFromStorageOrEmbed();
			showError(logoInput, 'Could not load the selected image.');
			if (logoReadyResolve) logoReadyResolve();
		}
	});

	if (addDeliverableBtn && deliverablesList) {
		addDeliverableBtn.addEventListener('click', () => {
			deliverablesList.appendChild(createDeliverableRow());
		});
	}



	optExecSummary.addEventListener('change', () => {
		execSummaryWrap.hidden = !optExecSummary.checked;
	});
	optRisks.addEventListener('change', () => {
		risksWrap.hidden = !optRisks.checked;
	});
	optReferences.addEventListener('change', () => {
		referencesWrap.hidden = !optReferences.checked;
	});
	optTerms.addEventListener('change', () => {
		termsWrap.hidden = !optTerms.checked;
	});

	if (exportPresetBtn) exportPresetBtn.addEventListener('click', exportPreset);
	if (importPresetInput) importPresetInput.addEventListener('change', () => {
		const file = importPresetInput.files && importPresetInput.files[0];
		if (file) importPreset(file);
	});

	// Theme selector event listener
	if (themeSelect) themeSelect.addEventListener('change', (e) => {
		changeTheme(e.target.value);
	});

	// Only template generation now
	if (generateDocxTplBtn) generateDocxTplBtn.addEventListener('click', generateDocxFromTemplate);
	if (downloadTplBtn) downloadTplBtn.addEventListener('click', async () => {
		// Provide a minimal starter template as a .docx binary assembled here
		// For simplicity, we export a small README with instructions packaged as a .docx-like placeholder
		// so the user can quickly replace content and save as template.docx.
		alert('Creating a sample template... After download, open it, place your logo in the header, add page numbers, and save as template.docx next to index.html.');
		// Fallback: download a prepared docx file is not possible inline; instruct user
		// Build a simple sample DOCX with placeholders
		const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header, Footer, ImageRun, Table, TableRow, TableCell, WidthType, PageNumber } = window.docx || {};
		if (!Document) return;
		function H(t){return new Paragraph({text:t, heading:HeadingLevel.HEADING_2, spacing:{before:240, after:120}});} 
		function P(t){return new Paragraph({children:[new TextRun(t)]});}
		let headerChildren=[];
		try{
			const cells=[];
			const bytes=(function(){try{return dataUrlToUint8Array(logoDataUrl);}catch{return null;}})();
			cells.push(new TableCell({children:[new Paragraph({children: bytes?[new ImageRun({data:bytes, transformation:{width:160,height:45}})]:[]})]}));
			cells.push(new TableCell({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun('{organizationName}') ]})]}));
			headerChildren=[new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[new TableRow({children:cells})]})];
		}catch{}
		const footerChildren=[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun('Page '),PageNumber.CURRENT,new TextRun(' of '),PageNumber.TOTAL_PAGES]})];
		const cover=[new Paragraph({text:'{projectTitle}',heading:HeadingLevel.TITLE,spacing:{after:240}}),P('Prepared for {clientName}'),P('Prepared by {organizationName}'),P('Date: {date}   Due: {dateDue}')];
		const body=[H('Cover Letter'),P('Dear {contactName},'),P('{contactAddress}'),P('{contactEmail}'),H('About CIC'),P('{about_cic}'),H('Experience'),P('{cic_experience}'),H('CIC Qualifications'),P('{cic_qualifications}'),H('Approach'),P('{#approach_system_selection}{approach_system_selection_text}{/approach_system_selection}'),P('{#approach_system_implementation}{approach_system_implementation_text}{/approach_system_implementation}'),P('{#approach_strategic_plan}{approach_strategic_plan_text}{/approach_strategic_plan}'),P('{#approach_organizational_assessment}{approach_organizational_assessment_text}{/approach_organizational_assessment}'),P('{#approach_change_management}{approach_change_management_text}{/approach_change_management}'),H('Deliverables'),P('{#deliverables}{item}{/deliverables}'),H('Timeline'),P('{timeline}'),H('Cost'),P('{#includeCost}{cost_section}{/includeCost}'),H('References'),P('{references}'),H('Contact'),P('{contactName}\n{contact}\n{contactAddress}\n{contactEmail}')];
		const doc=new Document({sections:[{headers: headerChildren.length?{default:new Header({children:headerChildren})}:undefined, footers:{default:new Footer({children:footerChildren})}, children:[...cover,...body]}]});
		const blob=await Packer.toBlob(doc);
		await saveBlobWithPickerOrDownload(blob,'template.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
	});

	form.addEventListener('reset', () => {
		// restore initial state
		setTimeout(() => {
			clearAllErrors();
			logoPreview.innerHTML = '';
			logoDataUrl = null;
			if (deliverablesList) {
				deliverablesList.innerHTML = '';
				deliverablesList.appendChild(createDeliverableRow());
			}
			execSummaryWrap.hidden = true;
			risksWrap.hidden = true;
			referencesWrap.hidden = true;
			termsWrap.hidden = true;
		}, 0);
	});

	// Init
	(async function init() {
		// default logo preference: logo.png in project > localStorage override > embedded placeholder
		try {
			// Skip trying to load logo.png from local file system to avoid errors
			logoDataUrl = loadDefaultLogoFromStorageOrEmbed();
		} catch {
			// If logo.png is not present or blocked, fall back to stored or embedded
			logoDataUrl = loadDefaultLogoFromStorageOrEmbed();
		}
		if (logoPreview) {
			const img = document.createElement('img');
			img.src = logoDataUrl;
			img.alt = 'Logo preview';
			logoPreview.appendChild(img);
		}
		// form
		if (deliverablesList) deliverablesList.appendChild(createDeliverableRow());
		if (logoReadyResolve) logoReadyResolve();

		// Force-hide removed sections in case of cached HTML
		hideRowByInputId('problemStatement');
		hideRowByInputId('scope');
		hideRowByInputId('assumptions');
		hideRowByInputId('contact');

		// Load dynamic options
		loadDynamicOptions();

		// Load saved theme
		loadTheme();
	})();
})();
