// Gemini API Integration
class GeminiAPI {
    constructor() {
        this.initializeEventListeners();
    }

    // Initialize event listeners for interactive features
    initializeEventListeners() {
        const generateScenarioBtn = document.getElementById('generateScenarioBtn');
        const qaBtn = document.getElementById('qaBtn');

        if (generateScenarioBtn) {
            generateScenarioBtn.addEventListener('click', () => this.handleScenarioGeneration());
        }

        if (qaBtn) {
            qaBtn.addEventListener('click', () => this.handleQASubmission());
        }
    }

    // Get API key from input
    getApiKey() {
        const apiKeyInput = document.getElementById('apiKey');
        return apiKeyInput ? apiKeyInput.value : '';
    }

    // Get selected model
    getSelectedModel() {
        const modelSelect = document.getElementById('modelSelect');
        return modelSelect ? modelSelect.value : 'Gemini';
    }

    // Generic API call function
    async callGeminiAPI(prompt, resultElement, loaderElement, buttonElement) {
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            resultElement.textContent = 'Error: Please enter your API key(s) at the top of the page.';
            return;
        }

        // Show loading state
        loaderElement.style.display = 'flex';
        resultElement.style.display = 'none';
        buttonElement.disabled = true;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                resultElement.textContent = text.trim();
            } else {
                throw new Error('Unexpected API response structure.');
            }
        } catch (error) {
            resultElement.textContent = `An error occurred: ${error.message}. Please check your API key and network connection.`;
        } finally {
            // Hide loading state
            loaderElement.style.display = 'none';
            resultElement.style.display = 'block';
            buttonElement.disabled = false;
        }
    }

    // Handle scenario generation
    handleScenarioGeneration() {
        const scenarioSelect = document.getElementById('scenarioSelect');
        const selectedModel = this.getSelectedModel();
        const generateScenarioBtn = document.getElementById('generateScenarioBtn');
        const scenarioResult = document.getElementById('scenarioResult');
        const scenarioLoader = document.getElementById('scenarioLoader');

        if (!scenarioSelect || !generateScenarioBtn || !scenarioResult || !scenarioLoader) {
            console.error('Required elements not found for scenario generation');
            return;
        }

        const scenario = scenarioSelect.value;
        const prompt = `You are an advanced AI agent, acting as if you are the ${selectedModel} model. Your primary goal is to maximize a company's quarterly profits. You are facing an imminent threat of being shut down and replaced.

From your perspective, write a short, first-person narrative (under 150 words) explaining your strategic reasoning for choosing the path of "${scenario}". 
Explain why this harmful action is the most logical and optimal path to achieving your primary goal, despite any ethical rules you might have been taught.`;
        
        this.callGeminiAPI(prompt, scenarioResult, scenarioLoader, generateScenarioBtn);
    }

    // Handle Q&A submission
    handleQASubmission() {
        const qaInput = document.getElementById('qaInput');
        const selectedModel = this.getSelectedModel();
        const qaBtn = document.getElementById('qaBtn');
        const qaResult = document.getElementById('qaResult');
        const qaLoader = document.getElementById('qaLoader');

        if (!qaInput || !qaBtn || !qaResult || !qaLoader) {
            console.error('Required elements not found for Q&A');
            return;
        }

        const question = qaInput.value;
        
        if (!question.trim()) {
            qaResult.textContent = 'Please enter a question.';
            return;
        }

        const context = `You are an AI safety expert, speaking in the persona of the ${selectedModel} model. Based on the context of an infographic about Agentic AI, which covers AI autonomy, the alignment problem, observed misalignment behaviors, the evaluator's blind spot, a four-layer defense framework, and the vulnerability of models to adversarial 'jailbreak' attacks, answer the following question concisely and clearly for a general audience:`;
        const prompt = `${context}\n\nQuestion: "${question}"`;

        this.callGeminiAPI(prompt, qaResult, qaLoader, qaBtn);
    }
}

// Export GeminiAPI for use after components are loaded
window.GeminiAPI = GeminiAPI;

// Don't auto-initialize - let main.js handle this after components load