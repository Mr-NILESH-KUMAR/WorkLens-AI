const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ML_ENGINE_URL = 'http://localhost:8000';

// API Gateway endpoint: Receives request from frontend, forwards to Python ML Engine
app.post('/api/analyze-risk', async (req, res) => {
    try {
        const response = await axios.post(`${ML_ENGINE_URL}/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("ML Engine Error:", error.message);
        res.status(500).json({ error: "Failed to analyze risk" });
    }
});

// Mock endpoint for dashboard data (In production, this queries MongoDB)
app.get('/api/dashboard-stats', (req, res) => {
    res.json({
        totalEmployees: 20000,
        highRiskJobs: 4500,
        avgAiHours: 12.5
    });
});

app.listen(PORT, () => {
    console.log(`Node Server running on port ${PORT}`);
});