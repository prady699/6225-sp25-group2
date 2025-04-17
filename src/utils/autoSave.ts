/**
 * Utility function to automatically save user preferences in the background
 * This is used to collect data for the AI model without requiring explicit user action
 */
export const autoSavePreferences = async (preferences: any): Promise<void> => {
  try {
    // Don't await this request to keep it non-blocking
    fetch('/api/save-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferences,
        isAutoSave: true,
      }),
    }).catch(error => {
      // Silently fail - we don't want to interrupt the user experience
      console.error('Background save failed:', error);
    });
  } catch (error) {
    // Silently catch errors - auto-save should never interrupt the user flow
    console.error('Failed to auto-save preferences:', error);
  }
};

/**
 * Track a user search query for AI learning
 * @param searchData The search parameters used
 * @param results Optional results count or metadata
 */
export const trackSearchQuery = async (searchData: any, results?: any): Promise<void> => {
  try {
    const enhancedData = {
      ...searchData,
      timestamp: new Date().toISOString(),
      results: results || {},
      queryType: 'search'
    };
    
    // Don't await this request to keep it non-blocking
    fetch('/api/save-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferences: enhancedData,
        isAutoSave: true,
      }),
    }).catch(error => {
      // Silently fail - we don't want to interrupt the user experience
      console.error('Search tracking failed:', error);
    });
  } catch (error) {
    // Silently catch errors - tracking should never interrupt the user flow
    console.error('Failed to track search query:', error);
  }
}; 