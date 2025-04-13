/**
 * Utility function to automatically save user preferences in the background
 * This is used to collect data for the AI model without requiring explicit user action
 */
export const autoSavePreferences = (data: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }
};

// Get stored preferences
export const getStoredPreferences = () => {
  if (typeof window !== 'undefined') {
    try {
      const preferences = localStorage.getItem('userPreferences');
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Error retrieving preferences:', error);
      return null;
    }
  }
  return null;
};

/**
 * Track a user search query for AI learning
 * @param searchData The search parameters used
 * @param results Optional results count or metadata
 */
export const trackSearchQuery = (queryParams: any, additionalData: any = {}) => {
  if (typeof window !== 'undefined') {
    try {
      // Get existing search history or initialize
      const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      
      // Add this search to history
      searchHistory.push({
        timestamp: new Date().toISOString(),
        queryParams,
        ...additionalData
      });
      
      // Keep only the last 10 searches
      const recentSearches = searchHistory.slice(-10);
      
      localStorage.setItem('searchHistory', JSON.stringify(recentSearches));
    } catch (error) {
      console.error('Error tracking search query:', error);
    }
  }
}; 