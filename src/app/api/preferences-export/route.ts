import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the preferences directory
const preferencesDir = path.join(process.cwd(), 'user-preferences');

// Ensure the preferences directory exists
if (!fs.existsSync(preferencesDir)) {
  fs.mkdirSync(preferencesDir, { recursive: true });
}

export async function GET(request: Request) {
  try {
    // Get URL parameters for filtering
    const url = new URL(request.url);
    const includeAutoSave = url.searchParams.get('includeAutoSave') === 'true';
    const onlyAutoSave = url.searchParams.get('onlyAutoSave') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '500', 10);
    const format = url.searchParams.get('format') || 'default';

    // Check if the directory exists
    if (!fs.existsSync(preferencesDir)) {
      return NextResponse.json({ 
        success: false, 
        message: 'No preferences found' 
      });
    }

    // Get list of saved preferences files
    const files = fs.readdirSync(preferencesDir);
    
    if (files.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No preferences found',
        preferences: []
      });
    }
    
    // Read each file and compile the data
    let preferences = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(preferencesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      })
      // Sort by timestamp (newest first)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
    // Apply auto-save filtering if requested
    if (!includeAutoSave && !onlyAutoSave) {
      // Default behavior: exclude auto-saved preferences
      preferences = preferences.filter(pref => !pref.isAutoSave);
    } else if (onlyAutoSave) {
      // Only include auto-saved preferences
      preferences = preferences.filter(pref => pref.isAutoSave);
    }
    // If includeAutoSave is true, we include all preferences
    
    // Apply limit
    preferences = preferences.slice(0, limit);
    
    // Format for AI processing
    let formattedPreferences;
    
    if (format === 'ai') {
      formattedPreferences = preferences.map(pref => ({
        id: pref.id,
        timestamp: pref.timestamp,
        location: pref.data.location || "",
        price_range: pref.data.price || "",
        bedrooms: pref.data.bedrooms || "",
        amenities: pref.data.amenities || [],
        is_auto_save: pref.isAutoSave || false,
        search_completed: pref.data.searchCompleted || false,
        viewed_results: pref.data.viewedResults || false,
        // Track how many times this query has been run
        query_count: 1
      }));
    } else {
      // Default format includes the whole data structure
      formattedPreferences = preferences;
    }
    
    // Return the data in machine-readable format
    return NextResponse.json({
      success: true,
      count: formattedPreferences.length,
      preferences: formattedPreferences
    });
  } catch (error) {
    console.error('Error retrieving preferences for export:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve preferences' },
      { status: 500 }
    );
  }
} 