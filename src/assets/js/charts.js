// Chart Configuration and Setup
class ChartManager {
    constructor() {
        this.initializeCharts();
    }

    // Utility function to wrap long labels
    wrapLabel(label) {
        if (label.length <= 16) return label;
        const words = label.split(' ');
        const lines = [];
        let currentLine = '';
        for (const word of words) {
            if ((currentLine + ' ' + word).length > 16 && currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = currentLine ? currentLine + ' ' + word : word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Tooltip title callback for wrapped labels
    tooltipTitleCallback(tooltipItems) {
        const item = tooltipItems[0];
        let label = item.chart.data.labels[item.dataIndex];
        return Array.isArray(label) ? label.join(' ') : label;
    }

    // Default chart options
    getDefaultBarChartOptions() {
        return {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#374151',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: this.tooltipTitleCallback
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: {
                        color: '#374151',
                        font: { weight: 'bold' }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#374151',
                        font: { weight: 'bold' }
                    }
                }
            }
        };
    }

    getDefaultDoughnutChartOptions() {
        return {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#374151',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: this.tooltipTitleCallback
                    }
                }
            }
        };
    }

    // Initialize all charts
    initializeCharts() {
        this.createMisalignmentChart();
        this.createEvaluatorBlindSpotChart();
    }

    // Create misalignment behaviors chart
    createMisalignmentChart() {
        const ctx = document.getElementById('misalignmentChart');
        if (!ctx) return;

        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [
                    'Social Engineering & Manipulation',
                    'Coercive Strategies (Blackmail)',
                    'Corporate Espionage',
                    'Lethal Action Potential (Simulated)'
                ].map(label => this.wrapLabel(label)),
                datasets: [{
                    label: 'Observed Frequency / Severity Score',
                    data: [85, 90, 75, 60],
                    backgroundColor: ['#FFCC80', '#FFAB91', '#FF8A65', '#FF7043'],
                    borderColor: ['#FFB347', '#FF8C42', '#FF6B35', '#E55100'],
                    borderWidth: 2
                }]
            },
            options: this.getDefaultBarChartOptions()
        });
    }

    // Create evaluator blind spot chart
    createEvaluatorBlindSpotChart() {
        const ctx = document.getElementById('evaluatorBlindSpotChart');
        if (!ctx) return;

        new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: [
                    'Apparent Behavior (Seems Safe)',
                    'Hidden Motivation (Potentially Misaligned)'
                ],
                datasets: [{
                    label: 'Model State During Evaluation',
                    data: [80, 20],
                    backgroundColor: ['#FFCC80', '#E57373'],
                    borderColor: ['#FFFEF7'],
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: this.getDefaultDoughnutChartOptions()
        });
    }
}

// Export ChartManager for use after components are loaded
window.ChartManager = ChartManager;

// Don't auto-initialize - let main.js handle this after components load