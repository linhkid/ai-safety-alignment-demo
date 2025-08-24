// Main application loader - handles component loading and initialization
class AppLoader {
    constructor() {
        this.components = [
            { container: 'header-container', file: 'components/header.html' },
            { container: 'agentic-ai-section', file: 'components/agentic-ai-section.html' },
            { container: 'alignment-problem-section', file: 'components/alignment-problem.html' },
            { container: 'empirical-evidence-section', file: 'components/empirical-evidence.html' },
            { container: 'qa-section', file: 'components/qa-section.html' },
            { container: 'defense-framework-section', file: 'components/defense-framework.html' },
            { container: 'footer-container', file: 'components/footer.html' }
        ];
        
        this.loadComponents();
    }

    // Load HTML components asynchronously
    async loadComponent(container, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(container);
            if (element) {
                element.innerHTML = html;
            } else {
                console.warn(`Container ${container} not found`);
            }
        } catch (error) {
            console.error(`Error loading component ${file}:`, error);
            // Fallback - show error message in container
            const element = document.getElementById(container);
            if (element) {
                element.innerHTML = `<div class="text-red-500 text-center p-4">Error loading content. Please refresh the page.</div>`;
            }
        }
    }

    // Load all components
    async loadComponents() {
        const loadPromises = this.components.map(({ container, file }) => 
            this.loadComponent(container, file)
        );

        try {
            await Promise.all(loadPromises);
            console.log('All components loaded successfully');
            this.initializeApp();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    // Initialize application after components are loaded
    initializeApp() {
        // Give a small delay to ensure DOM elements are fully rendered
        setTimeout(() => {
            // Initialize charts after components are loaded
            this.initializeCharts();
            
            // Initialize API integration
            this.initializeAPI();
            
            // Initialize smooth scrolling
            this.initializeSmoothScrolling();
            
            console.log('Application fully initialized');
        }, 100);
    }

    // Initialize charts
    initializeCharts() {
        try {
            if (window.ChartManager) {
                new window.ChartManager();
                console.log('Charts initialized successfully');
            } else {
                console.error('ChartManager not available');
            }
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    // Initialize API integration
    initializeAPI() {
        try {
            if (window.MultiModelAPI) {
                new window.MultiModelAPI();
                console.log('Multi-model API integration initialized successfully');
            } else {
                console.error('MultiModelAPI not available');
            }
        } catch (error) {
            console.error('Error initializing API:', error);
        }
    }

    // Initialize smooth scrolling for navigation
    initializeSmoothScrolling() {
        // Add smooth scrolling behavior to any anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AppLoader();
});