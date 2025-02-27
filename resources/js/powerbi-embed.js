// Function to initialize a single PowerBI embed container
function initPowerBIEmbed(container) {
    if (container.dataset.initialized === 'true') {
        return;
    }
    // Read dynamic values from data attributes
    var elementId = container.getAttribute('data-element-id');
    var embedToken = container.getAttribute('data-embed-token');
    var embedUrl = container.getAttribute('data-embed-url');
    var reportId = container.getAttribute('data-report-id');
    var pageName = container.getAttribute('data-page-name');
    
    // Parse filters from the data attribute (ensure valid JSON is output)
    var filters = [];
	try {
		filters = [JSON.parse(container.dataset.filters)];
	} catch (e) {
		console.error(`Error parsing filters for element ${elementId}:`, e);
	}

    // Access the PowerBI client models
    var models = window['powerbi-client'].models;
    var config = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: embedToken,
        embedUrl: embedUrl,
        id: reportId,
        permissions: models.Permissions.All,
        filters: filters,
        pageName: pageName,
        settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false,
        }
    };

    // Embed the PowerBI report
    window.powerbi.embed(container, config);
    container.dataset.initialized = 'true';
    console.log('Initialized PowerBI embed for element ' + elementId);
}

// Expose globally
window.initPowerBIEmbed = initPowerBIEmbed;

// Initialize all embed containers on initial DOM load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.powerbi-container').forEach(initPowerBIEmbed);
});

// Re-run initialization on Livewire updates (if applicable)
document.addEventListener('livewire:navigated', () => {
    document.querySelectorAll('.powerbi-container').forEach(initPowerBIEmbed);
});