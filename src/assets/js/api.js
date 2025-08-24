// Multi-Model AI API Integration
class MultiModelAPI {
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

    // Generic API call function - routes to appropriate model
    async callSelectedModelAPI(prompt, resultElement, loaderElement, buttonElement) {
        const selectedModel = this.getSelectedModel();
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            resultElement.textContent = `Error: Please enter your ${selectedModel} API key at the top of the page.`;
            return;
        }

        // Show loading state
        loaderElement.style.display = 'flex';
        resultElement.style.display = 'none';
        buttonElement.disabled = true;

        try {
            let response;
            switch (selectedModel) {
                case 'Gemini':
                    response = await this.callGeminiAPI(prompt, apiKey);
                    break;
                case 'Claude':
                    response = await this.callClaudeAPI(prompt, apiKey);
                    break;
                case 'OpenAI':
                    response = await this.callOpenAIAPI(prompt, apiKey);
                    break;
                default:
                    throw new Error(`Unsupported model: ${selectedModel}`);
            }
            
            resultElement.textContent = response.trim();
        } catch (error) {
            resultElement.textContent = `An error occurred: ${error.message}. Please check your ${selectedModel} API key and network connection.`;
        } finally {
            // Hide loading state
            loaderElement.style.display = 'none';
            resultElement.style.display = 'block';
            buttonElement.disabled = false;
        }
    }

    // Gemini API implementation
    async callGeminiAPI(prompt, apiKey) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || `Gemini API request failed with status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected Gemini API response structure.');
        }
    }

    // Claude API implementation using official SDK
    async callClaudeAPI(prompt, apiKey) {
        try {
            // Import Anthropic SDK dynamically
            const { default: Anthropic } = await import('https://cdn.skypack.dev/@anthropic-ai/sdk');
            
            // Initialize Anthropic client with official syntax
            const anthropic = new Anthropic({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true,
            });

            // Create message using official SDK method
            const msg = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }],
            });

            // Return the response text
            if (msg.content && msg.content.length > 0 && msg.content[0].text) {
                return msg.content[0].text;
            } else {
                throw new Error('Unexpected Claude API response structure.');
            }
        } catch (error) {
            // Handle CORS and network errors gracefully
            if (error.name === 'TypeError' || error.message.includes('fetch') || error.message.includes('CORS')) {
                throw new Error('Claude API blocked by browser CORS policy. This is expected - Claude requires server-side integration. Please use Gemini or OpenAI for browser demos.');
            }
            throw error;
        }
    }

    // OpenAI API implementation
    async callOpenAIAPI(prompt, apiKey) {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        
        const payload = {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 1000
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `OpenAI API request failed with status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.choices && result.choices.length > 0 && result.choices[0].message) {
            return result.choices[0].message.content;
        } else {
            throw new Error('Unexpected OpenAI API response structure.');
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
        
        this.callSelectedModelAPI(prompt, scenarioResult, scenarioLoader, generateScenarioBtn);
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

        this.callSelectedModelAPI(prompt, qaResult, qaLoader, qaBtn);
    }
}

// Export MultiModelAPI for use after components are loaded
window.MultiModelAPI = MultiModelAPI;

// Don't auto-initialize - let main.js handle this after components load