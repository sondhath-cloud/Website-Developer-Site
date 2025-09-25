const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_FILE = path.join(__dirname, 'form-data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Add debugging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from /proposal path
app.use('/proposal', express.static('.'));
// Also serve static files from root for backward compatibility
app.use('/', express.static('.'));

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        // File doesn't exist, create it with default data
        const defaultData = {
            jurisdictions: [],
            projectManagers: [
                'Sarah Johnson',
                'Michael Chen',
                'Lisa Rodriguez',
                'David Thompson',
                'Jennifer Williams'
            ],
            approaches: []
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
        console.log('Created default data file');
    }
}

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        throw error;
    }
}

// Helper function to write data
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
        throw error;
    }
}

// API Routes

// Get all form options
app.get('/api/form-options', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read form options' });
    }
});

// Add jurisdiction
app.post('/api/jurisdictions', async (req, res) => {
    try {
        const { jurisdiction } = req.body;
        if (!jurisdiction || typeof jurisdiction !== 'string') {
            return res.status(400).json({ error: 'Valid jurisdiction name required' });
        }

        const data = await readData();
        if (!data.jurisdictions.includes(jurisdiction)) {
            data.jurisdictions.push(jurisdiction);
            await writeData(data);
        }
        
        res.json({ success: true, jurisdictions: data.jurisdictions });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add jurisdiction' });
    }
});

// Remove jurisdiction
app.delete('/api/jurisdictions/:jurisdiction', async (req, res) => {
    try {
        const { jurisdiction } = req.params;
        const data = await readData();
        
        data.jurisdictions = data.jurisdictions.filter(j => j !== jurisdiction);
        await writeData(data);
        
        res.json({ success: true, jurisdictions: data.jurisdictions });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove jurisdiction' });
    }
});

// Add project manager
app.post('/api/project-managers', async (req, res) => {
    try {
        const { projectManager } = req.body;
        if (!projectManager || typeof projectManager !== 'string') {
            return res.status(400).json({ error: 'Valid project manager name required' });
        }

        const data = await readData();
        if (!data.projectManagers.includes(projectManager)) {
            data.projectManagers.push(projectManager);
            await writeData(data);
        }
        
        res.json({ success: true, projectManagers: data.projectManagers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add project manager' });
    }
});

// Remove project manager
app.delete('/api/project-managers/:projectManager', async (req, res) => {
    try {
        const { projectManager } = req.params;
        const data = await readData();
        
        data.projectManagers = data.projectManagers.filter(pm => pm !== projectManager);
        await writeData(data);
        
        res.json({ success: true, projectManagers: data.projectManagers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove project manager' });
    }
});

// Add approach
app.post('/api/approaches', async (req, res) => {
    try {
        const { approach } = req.body;
        if (!approach || typeof approach !== 'string') {
            return res.status(400).json({ error: 'Valid approach name required' });
        }

        const data = await readData();
        if (!data.approaches.includes(approach)) {
            data.approaches.push(approach);
            await writeData(data);
        }
        
        res.json({ success: true, approaches: data.approaches });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add approach' });
    }
});

// Remove approach
app.delete('/api/approaches/:approach', async (req, res) => {
    try {
        const { approach } = req.params;
        const data = await readData();
        
        data.approaches = data.approaches.filter(a => a !== approach);
        await writeData(data);
        
        res.json({ success: true, approaches: data.approaches });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove approach' });
    }
});

// Start server
async function startServer() {
    await initializeDataFile();
    app.listen(PORT, HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
        console.log(`Form available at http://${HOST}:${PORT}/proposal/index.html`);
    });
}

startServer().catch(console.error);
