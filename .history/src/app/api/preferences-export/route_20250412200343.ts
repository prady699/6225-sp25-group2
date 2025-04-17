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
    const preferences = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(preferencesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      });
    
    // Format for AI processing
    const formattedPreferences = preferences.map(pref => ({
      id: pref.id,
      timestamp: pref.timestamp,
      location: pref.data.location || "",
      price_range: pref.data.price || "",
      bedrooms: pref.data.bedrooms || "",
      amenities: pref.data.amenities || [],
      // Track how many times this query has been run
      query_count: 1
    }));
    
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