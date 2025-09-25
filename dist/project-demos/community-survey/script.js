// Community Priority Survey - JavaScript

// Priority categories and data
const priorityCategories = {
    "Economic Development": [
        "Support local business development",
        "Create job training and workforce programs",
        "Attract new businesses and industries",
        "Develop downtown revitalization projects"
    ],
    "Safety": [
        "Enhance community safety programs",
        "Improve emergency response services",
        "Increase neighborhood watch programs",
        "Better street lighting and security"
    ],
    "Infrastructure": [
        "Fix road infrastructure and potholes",
        "Improve water quality and infrastructure",
        "Expand internet access and digital services",
        "Upgrade utility systems and power grid"
    ],
    "Transportation": [
        "Improve public transportation system",
        "Create more bike lanes and walking paths",
        "Build better parking infrastructure",
        "Enhance traffic flow and management"
    ],
    "Environment": [
        "Add more parks and green spaces",
        "Develop renewable energy programs",
        "Improve waste management and recycling",
        "Protect natural resources and waterways"
    ],
    "Social Services": [
        "Increase affordable housing options",
        "Enhance senior citizen services",
        "Expand mental health and wellness programs",
        "Improve accessibility for disabled residents"
    ],
    "Education & Recreation": [
        "Increase funding for public schools",
        "Build new recreation centers",
        "Expand youth programs and activities",
        "Develop adult education and library services"
    ],
    "Financial Stewardship": [
        "Reduce government waste and inefficiency",
        "Lower property taxes and fees",
        "Improve budget transparency and accountability",
        "Ensure responsible debt management"
    ]
};

// Flatten all priorities for Stage 1 display
let allPriorities = [];
Object.keys(priorityCategories).forEach(category => {
    priorityCategories[category].forEach(priority => {
        allPriorities.push({ text: priority, category: category, isCustom: false });
    });
});

// Global variables
let selectedPriorities = [];
let customPriorities = [];
let comparisonPairs = [];
let finalComparisonPairs = [];
let currentComparisonIndex = 0;
let currentFinalComparisonIndex = 0;
let priorityScores = {};
let currentStage = 1;

// Initialize the assessment
function initializeAssessment() {
    renderStage1();
    updateProgress();
}

function renderStage1() {
    const grid = document.getElementById('priorities-grid');
    grid.innerHTML = '';

    // Shuffle priorities for varied presentation
    const shuffledPriorities = shuffleArray([...allPriorities]);

    shuffledPriorities.forEach(priority => {
        const priorityDiv = document.createElement('div');
        priorityDiv.className = 'priority-item';
        priorityDiv.textContent = priority.text;
        priorityDiv.onclick = () => togglePrioritySelection(priority, priorityDiv);
        priorityDiv.dataset.priority = priority.text;
        grid.appendChild(priorityDiv);
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function togglePrioritySelection(priority, element) {
    console.log('togglePrioritySelection called for:', priority.text);
    
    const index = selectedPriorities.findIndex(p => p.text === priority.text);

    if (index > -1) {
        selectedPriorities.splice(index, 1);
        element.classList.remove('selected');
        console.log('Removed priority:', priority.text);
    } else {
        selectedPriorities.push(priority);
        element.classList.add('selected');
        console.log('Added priority:', priority.text);
    }

    updateSelectedCount();
}

function updateSelectedCount() {
    const count = selectedPriorities.length;
    console.log('Selected priorities count:', count);
    console.log('Selected priorities:', selectedPriorities);
    
    const selectedCountEl = document.getElementById('selected-count');
    const stage1BtnEl = document.getElementById('stage1-btn');
    
    if (selectedCountEl) {
        selectedCountEl.textContent = count;
    } else {
        console.error('selected-count element not found');
    }
    
    if (stage1BtnEl) {
        // Always enable the button so users can click it and get the notification
        stage1BtnEl.disabled = false;
        if (count >= 5) {
            console.log('Button enabled, user can proceed');
        } else {
            console.log('Button enabled, will show notification if clicked');
        }
    } else {
        console.error('stage1-btn element not found');
    }
}

function proceedToStage2() {
    console.log('proceedToStage2 called');
    console.log('Selected priorities count:', selectedPriorities.length);
    
    if (selectedPriorities.length < 5) {
        console.log('Not enough priorities selected, need at least 5');
        const remaining = 5 - selectedPriorities.length;
        const cardText = remaining === 1 ? 'card' : 'cards';
        alert(`Please choose ${remaining} more ${cardText} before continuing.`);
        return;
    }

    try {
        currentStage = 2;
        updateProgress();
        
        // Generate ALL possible comparison pairs for initial priorities
        generateAllComparisonPairs();
        
        // Initialize scoring for selected priorities
        selectedPriorities.forEach(priority => {
            priorityScores[priority.text] = 0;
        });

        const stage1El = document.getElementById('stage1');
        const stage2El = document.getElementById('stage2');
        
        if (stage1El && stage2El) {
            stage1El.classList.add('hidden');
            stage2El.classList.remove('hidden');
            console.log('Successfully switched to stage 2');
        } else {
            console.error('Stage elements not found:', {stage1: !!stage1El, stage2: !!stage2El});
        }
        
        displayCurrentComparison();
    } catch (error) {
        console.error('Error in proceedToStage2:', error);
        alert('An error occurred. Please try again.');
    }
}

function generateAllComparisonPairs() {
    console.log('generateAllComparisonPairs called');
    comparisonPairs = [];
    
    // Generate every possible pair - complete comparison
    for (let i = 0; i < selectedPriorities.length; i++) {
        for (let j = i + 1; j < selectedPriorities.length; j++) {
            comparisonPairs.push([selectedPriorities[i], selectedPriorities[j]]);
        }
    }
    
    // Shuffle pairs for variety
    comparisonPairs = shuffleArray(comparisonPairs);
    
    console.log('Generated', comparisonPairs.length, 'comparison pairs');
    
    const totalComparisonsEl = document.getElementById('total-comparisons');
    if (totalComparisonsEl) {
        totalComparisonsEl.textContent = comparisonPairs.length;
    } else {
        console.error('total-comparisons element not found');
    }
    currentComparisonIndex = 0;
}

function displayCurrentComparison() {
    if (currentComparisonIndex >= comparisonPairs.length) {
        proceedToCustomPriorityStage();
        return;
    }

    const pair = comparisonPairs[currentComparisonIndex];
    
    document.getElementById('option1-category').textContent = pair[0].category;
    document.getElementById('option1-text').textContent = pair[0].text;
    document.getElementById('option2-category').textContent = pair[1].category;
    document.getElementById('option2-text').textContent = pair[1].text;
    
    document.getElementById('current-comparison').textContent = currentComparisonIndex + 1;

    // Reset selections
    document.getElementById('option1').classList.remove('selected');
    document.getElementById('option2').classList.remove('selected');
}

function selectComparison(optionIndex) {
    const pair = comparisonPairs[currentComparisonIndex];
    const winner = pair[optionIndex];
    
    priorityScores[winner.text]++;
    
    // Visual feedback
    document.getElementById(`option${optionIndex + 1}`).classList.add('selected');

    setTimeout(() => {
        currentComparisonIndex++;
        displayCurrentComparison();
    }, 500);
}

function skipComparison() {
    currentComparisonIndex++;
    displayCurrentComparison();
}

function proceedToCustomPriorityStage() {
    currentStage = 2.5;
    updateProgress();

    document.getElementById('stage2').classList.add('hidden');
    document.getElementById('stage2-5').classList.remove('hidden');
    
    // Clear any previous custom priorities and form data
    document.getElementById('custom-priority-text').value = '';
    document.getElementById('custom-priority-category').value = '';
    
    renderCustomPrioritiesList();
}

function addCustomPriority() {
    const textInput = document.getElementById('custom-priority-text');
    const categorySelect = document.getElementById('custom-priority-category');
    
    if (!textInput || !categorySelect) {
        console.error('Form elements not found');
        return;
    }
    
    const text = textInput.value.trim();
    const category = categorySelect.value;
    
    if (!text || !category) {
        alert('Please fill in both the priority description and category.');
        return;
    }

    // Check for duplicates
    const isDuplicate = customPriorities.some(p => p.text.toLowerCase() === text.toLowerCase()) ||
                      selectedPriorities.some(p => p.text.toLowerCase() === text.toLowerCase());
    
    if (isDuplicate) {
        alert('This priority already exists. Please enter a different one.');
        return;
    }

    const customPriority = {
        text: text,
        category: category,
        isCustom: true
    };

    customPriorities.push(customPriority);
    
    // Clear form
    textInput.value = '';
    categorySelect.value = '';
    
    renderCustomPrioritiesList();
    
    console.log('Added custom priority:', customPriority);
    console.log('Total custom priorities:', customPriorities.length);
}

function renderCustomPrioritiesList() {
    const listContainer = document.getElementById('custom-priorities-list');
    
    if (customPriorities.length === 0) {
        listContainer.innerHTML = '';
        return;
    }

    let html = '<h3 style="margin-bottom: 15px; color: #2c3e50;">Your Custom Priorities:</h3>';
    
    customPriorities.forEach((priority, index) => {
        html += `
            <div class="custom-priority-item">
                <div class="custom-priority-content">
                    <div class="custom-priority-text">${priority.text}</div>
                    <div class="custom-priority-category">${priority.category}</div>
                </div>
                <button class="remove-custom" onclick="removeCustomPriority(${index})">Remove</button>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
}

function removeCustomPriority(index) {
    customPriorities.splice(index, 1);
    renderCustomPrioritiesList();
}

function proceedToFinalComparisons() {
    console.log('proceedToFinalComparisons called, custom priorities:', customPriorities.length);
    
    if (customPriorities.length === 0) {
        console.log('No custom priorities, going to results');
        showResults();
        return;
    }

    currentStage = 3;
    updateProgress();

    // Add custom priorities to scoring system
    customPriorities.forEach(priority => {
        priorityScores[priority.text] = 0;
    });

    // Generate comparison pairs between custom priorities and existing ones
    generateFinalComparisonPairs();

    document.getElementById('stage2-5').classList.add('hidden');
    document.getElementById('stage3').classList.remove('hidden');
    
    console.log('About to display first final comparison');
    displayCurrentFinalComparison();
}

function generateFinalComparisonPairs() {
    finalComparisonPairs = [];
    
    console.log('Generating final comparison pairs...');
    console.log('Custom priorities:', customPriorities);
    console.log('Selected priorities:', selectedPriorities);
    
    // Compare each custom priority with each selected priority
    customPriorities.forEach(customPriority => {
        selectedPriorities.forEach(selectedPriority => {
            finalComparisonPairs.push([customPriority, selectedPriority]);
        });
    });

    // Compare custom priorities with each other if there are multiple
    if (customPriorities.length > 1) {
        for (let i = 0; i < customPriorities.length; i++) {
            for (let j = i + 1; j < customPriorities.length; j++) {
                finalComparisonPairs.push([customPriorities[i], customPriorities[j]]);
            }
        }
    }
    
    // Shuffle pairs for variety
    finalComparisonPairs = shuffleArray(finalComparisonPairs);
    
    console.log('Generated', finalComparisonPairs.length, 'final comparison pairs');
    
    const totalComparisonsEl = document.getElementById('final-total-comparisons');
    if (totalComparisonsEl) {
        totalComparisonsEl.textContent = finalComparisonPairs.length;
    }
    currentFinalComparisonIndex = 0;
}

function displayCurrentFinalComparison() {
    if (currentFinalComparisonIndex >= finalComparisonPairs.length) {
        showResults();
        return;
    }

    const pair = finalComparisonPairs[currentFinalComparisonIndex];
    
    // Check if elements exist before trying to update them
    const option1Category = document.getElementById('final-option1-category');
    const option1Text = document.getElementById('final-option1-text');
    const option2Category = document.getElementById('final-option2-category');
    const option2Text = document.getElementById('final-option2-text');
    const currentComparisonEl = document.getElementById('final-current-comparison');
    
    if (option1Category) option1Category.textContent = pair[0].category;
    if (option1Text) option1Text.textContent = pair[0].text;
    if (option2Category) option2Category.textContent = pair[1].category;
    if (option2Text) option2Text.textContent = pair[1].text;
    if (currentComparisonEl) currentComparisonEl.textContent = currentFinalComparisonIndex + 1;

    // Reset selections
    const option1 = document.getElementById('final-option1');
    const option2 = document.getElementById('final-option2');
    if (option1) option1.classList.remove('selected');
    if (option2) option2.classList.remove('selected');
}

function selectFinalComparison(optionIndex) {
    const pair = finalComparisonPairs[currentFinalComparisonIndex];
    const winner = pair[optionIndex];
    
    priorityScores[winner.text]++;
    
    // Visual feedback with safety check
    const optionElement = document.getElementById(`final-option${optionIndex + 1}`);
    if (optionElement) {
        optionElement.classList.add('selected');
    }

    setTimeout(() => {
        currentFinalComparisonIndex++;
        displayCurrentFinalComparison();
    }, 500);
}

function skipFinalComparison() {
    currentFinalComparisonIndex++;
    displayCurrentFinalComparison();
}

function skipCustomPriorities() {
    showResults();
}

function showResults() {
    currentStage = 4;
    updateProgress();

    document.getElementById('stage2-5').classList.add('hidden');
    document.getElementById('stage3').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');

    calculateAndDisplayResults();
}

function calculateAndDisplayResults() {
    // Combine all priorities (selected + custom)
    const allUserPriorities = [...selectedPriorities, ...customPriorities];
    
    // Calculate individual priority scores and rank them
    const priorityResults = allUserPriorities.map(priority => {
        const score = priorityScores[priority.text] || 0;
        const maxPossibleScore = allUserPriorities.length - 1; // Can win against all others
        const winRate = score / Math.max(maxPossibleScore, 1);
        
        // Calculate relative strength compared to average
        const averageScore = Object.values(priorityScores).reduce((a, b) => a + b, 0) / allUserPriorities.length;
        const relativeStrength = averageScore > 0 ? (score / averageScore) : 1;
        
        // Calculate confidence based on number of comparisons
        const totalComparisons = comparisonPairs.length + finalComparisonPairs.length;
        const { confidence, significance } = calculateIndividualConfidence(
            score, maxPossibleScore, totalComparisons, allUserPriorities.length
        );
        
        return {
            text: priority.text,
            category: priority.category,
            isCustom: priority.isCustom,
            score: score,
            maxPossibleScore: maxPossibleScore,
            winRate: winRate,
            relativeStrength: relativeStrength,
            confidence: confidence,
            significance: significance
        };
    }).sort((a, b) => b.score - a.score); // Sort by total wins

    renderIndividualResults(priorityResults);
    generateResponseData(priorityResults);
}

function calculateIndividualConfidence(score, maxScore, totalComparisons, totalPriorities) {
    const winRate = score / Math.max(maxScore, 1);
    
    let confidence, significance;
    
    // Less strict confidence calculation
    if (winRate >= 0.7) {
        confidence = "High";
        significance = "Top Priority";
    } else if (winRate >= 0.5) {
        confidence = "Medium";
        significance = "Important";
    } else if (winRate >= 0.3) {
        confidence = "Medium";
        significance = "Moderate Priority";
    } else {
        confidence = "Low";
        significance = "Lower Priority";
    }
    
    return { confidence, significance };
}

// Missing function that was causing issues
function getConfidenceIcon(confidence) {
    switch(confidence) {
        case "High": return "🔥";
        case "Medium": return "✅";
        case "Low": return "⚡";
        case "Very Low": return "💭";
        default: return "📊";
    }
}

function renderIndividualResults(priorityResults) {
    const resultsList = document.getElementById('results-list');
    if (!resultsList) {
        console.error('results-list element not found');
        return;
    }
    
    resultsList.innerHTML = '';

    const categoryDescriptions = {
        "Economic Development": "Growing the local economy and creating opportunities for businesses and workers.",
        "Safety": "Community safety and security - ensuring everyone feels protected.",
        "Infrastructure": "Reliable, modern infrastructure that supports daily life and future growth.",
        "Transportation": "Efficient and sustainable transportation options for the community.",
        "Environment": "Environmental sustainability and preserving natural spaces.",
        "Social Services": "Supporting community members and ensuring access to essential services.",
        "Education & Recreation": "Learning opportunities and recreational activities that enrich community life.",
        "Financial Stewardship": "Responsible management of public resources and taxpayer money."
    };

    console.log('Rendering results for:', priorityResults);

    priorityResults.forEach((result, index) => {
        try {
            const percentage = Math.round(result.winRate * 100);
            const confidenceIcon = getConfidenceIcon(result.confidence);
            const significanceText = result.significance;
            
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            
            // Create strength description
            let strengthDescription = "";
            if (result.relativeStrength > 1.5) {
                strengthDescription = "Much stronger than average";
            } else if (result.relativeStrength > 1.2) {
                strengthDescription = "Stronger than average";
            } else if (result.relativeStrength > 0.8) {
                strengthDescription = "About average importance";
            } else {
                strengthDescription = "Below average importance";
            }
            
            // Add custom indicator
            const customIndicator = result.isCustom ? " ✨" : "";
            
            resultDiv.innerHTML = `
                <div class="result-rank">${index + 1}</div>
                <div class="result-content">
                    <div class="result-category">${result.text}${customIndicator}</div>
                    <div class="result-score">
                        Won ${result.score} of ${result.maxPossibleScore} head-to-head comparisons (${percentage}%)
                    </div>
                    <div class="result-description">
                        <strong>Category:</strong> ${result.category}<br>
                        ${categoryDescriptions[result.category] || 'Community priority area'}
                    </div>
                </div>
            `;
            
            resultsList.appendChild(resultDiv);
        } catch (error) {
            console.error('Error rendering result item:', error, result);
        }
    });
    
    // Add interpretation guide and category summary
    addIndividualInterpretationGuide(priorityResults);
}

function addIndividualInterpretationGuide(results) {
    const resultsList = document.getElementById('results-list');
    if (!resultsList) return;
    
    try {
        const totalComparisons = comparisonPairs.length + finalComparisonPairs.length;
        const highConfidenceCount = results.filter(r => r && r.confidence === "High").length;
        const customCount = results.filter(r => r && r.isCustom).length;
        
        let guideText = "📊 <strong>Your Individual Priority Rankings</strong>";
        
        if (customCount > 0) {
            guideText += ` You added ${customCount} custom ${customCount === 1 ? 'priority' : 'priorities'} ✨.`;
        }
        
        const guideDiv = document.createElement('div');
        guideDiv.style.cssText = `
            background: rgba(255,255,255,0.15);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 0.9em;
            text-align: left;
        `;
        guideDiv.innerHTML = guideText;
        
        resultsList.appendChild(guideDiv);
        
        // Add priority chart showing actual card text
        addPriorityChart(results);
        
    } catch (error) {
        console.error('Error adding interpretation guide:', error);
    }
}

function addCategorySummary(results) {
    // This function has been removed per user request
    return;
}

function addPriorityChart(results) {
    const resultsList = document.getElementById('results-list');
    if (!resultsList || !results || results.length === 0) return;
    
    try {
        // Take top priorities (limit to prevent overcrowding)
        const topPriorities = results.slice(0, Math.min(10, results.length));
        
        // Normalize scores to 0-1 scale for chart display
        const maxScore = Math.max(...topPriorities.map(r => r.score));
        const minScore = Math.min(...topPriorities.map(r => r.score));
        const scoreRange = maxScore - minScore || 1;
        
        const chartData = topPriorities.map(priority => ({
            text: priority.text,
            score: priority.score,
            normalizedScore: scoreRange > 0 ? (priority.score - minScore) / scoreRange : 0.5,
            isCustom: priority.isCustom
        }));
        
        // Create the vertical chart
        const chartDiv = document.createElement('div');
        chartDiv.className = 'priority-chart';
        
        chartDiv.innerHTML = `
            <div class="chart-title">📊 Priority Preference Scores</div>
            <div class="chart-container">
                <div class="chart-bars" id="chart-bars"></div>
            </div>
            <div class="chart-legend">
                Chart shows relative priority strength based on your head-to-head comparisons
            </div>
        `;
        
        resultsList.appendChild(chartDiv);
        
        // Add vertical bars showing actual card text
        const barsContainer = document.getElementById('chart-bars');
        chartData.forEach((item, index) => {
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';
            
            const barWidth = Math.max(item.normalizedScore * 100, 8); // Min 8% width
            const customIndicator = item.isCustom ? " ✨" : "";
            
            barContainer.innerHTML = `
                <div class="bar-label">${index + 1}. ${item.text}${customIndicator}</div>
                <div class="bar-track">
                    <div class="bar" style="width: ${barWidth}%">
                        <div class="bar-value">${item.score}</div>
                    </div>
                </div>
            `;
            
            barsContainer.appendChild(barContainer);
        });
    } catch (error) {
        console.error('Error creating priority chart:', error);
    }
}

function generateResponseData(categoryResults) {
    const allUserPriorities = [...selectedPriorities, ...customPriorities];
    
    const responseData = {
        timestamp: new Date().toISOString(),
        selectedPriorities: selectedPriorities.map(p => ({
            text: p.text,
            category: p.category,
            score: priorityScores[p.text] || 0,
            isCustom: false
        })),
        customPriorities: customPriorities.map(p => ({
            text: p.text,
            category: p.category,
            score: priorityScores[p.text] || 0,
            isCustom: true
        })),
        categoryResults: categoryResults,
        totalComparisons: comparisonPairs.length + finalComparisonPairs.length,
        initialComparisons: comparisonPairs.length,
        finalComparisons: finalComparisonPairs.length,
        completedComparisons: currentComparisonIndex + currentFinalComparisonIndex
    };

    document.getElementById('response-data').value = JSON.stringify(responseData, null, 2);
}

// Simple form submission function
function submitToSpreadsheet() {
    const allUserPriorities = [...selectedPriorities, ...customPriorities];
    
    // Create simple response data structure
    const responseData = {
        timestamp: new Date().toISOString(),
        selectedPriorities: selectedPriorities.map(p => ({
            text: p.text,
            category: p.category,
            score: priorityScores[p.text] || 0,
            isCustom: false
        })),
        customPriorities: customPriorities.map(p => ({
            text: p.text,
            category: p.category,
            score: priorityScores[p.text] || 0,
            isCustom: true
        })),
        totalComparisons: comparisonPairs.length + finalComparisonPairs.length,
        completedComparisons: currentComparisonIndex + currentFinalComparisonIndex
    };

    // Send to PHP backend
    fetch('submit_response.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Your response has been submitted successfully! Thank you for participating in our community priority assessment.');
        } else {
            alert('❌ Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Failed to submit response. Please try again.');
    });
}

function copyResponseData() {
    const textarea = document.getElementById('response-data');
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textarea.value).then(() => {
        alert('Response data copied to clipboard!');
    });
}

function updateProgress() {
    const progressPercent = (currentStage / 4) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
}

function startOver() {
    // Reset all data
    selectedPriorities = [];
    customPriorities = [];
    comparisonPairs = [];
    finalComparisonPairs = [];
    currentComparisonIndex = 0;
    currentFinalComparisonIndex = 0;
    priorityScores = {};
    currentStage = 1;

    // Reset UI
    document.getElementById('results').classList.add('hidden');
    document.getElementById('stage3').classList.add('hidden');
    document.getElementById('stage2-5').classList.add('hidden');
    document.getElementById('stage2').classList.add('hidden');
    document.getElementById('stage1').classList.remove('hidden');

    // Clear custom priority form
    document.getElementById('custom-priority-text').value = '';
    document.getElementById('custom-priority-category').value = '';
    document.getElementById('custom-priorities-list').innerHTML = '';

    // Reinitialize
    initializeAssessment();
}

// Allow Enter key to add custom priority
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('custom-priority-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCustomPriority();
        }
    });
});

// Add error handling for the entire script
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    console.error('Error message:', e.message);
    console.error('File:', e.filename);
    console.error('Line:', e.lineno);
});

// Initialize the application when page loads
initializeAssessment();
