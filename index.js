import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// 1. Import the chat function from the new module
import {
    addInternalDataContext,
    chat
} from './src/ai.js';

import { v4 } from 'uuid';

// --- ES Module Path Setup ---
// These lines are necessary to correctly get the directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const internalDataContext = await addInternalDataContext();
const chatId = v4();

// Middleware to parse incoming JSON payloads (needed for the chat prompt)
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the current directory
// This allows the browser to access index.html directly
app.use(express.static(__dirname));

// --- API Endpoint for Chat Interaction ---
// This is the endpoint the front-end will eventually call.
app.post('/api/chat', async (req, res) => {
    // Expects a JSON body like: { "prompt": "user's message" }
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required in the request body.' });
    }

    try {
        // 2. Replace placeholder with call to the external LLM function
        const responseText = await chat(chatId, prompt, internalDataContext);

        // The front-end expects a JSON object containing the response text
        res.json({ response: responseText });

    } catch (error) {
        console.error('Error handling chat request:', error);
        // Send a 500 error back to the client
        res.status(500).json({ error: 'Internal server error during response generation.' });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Open your browser to http://localhost:${port}/index.html`);
});