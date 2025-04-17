import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the preferences directory
const preferencesDir = path.join(process.cwd(), 'user-preferences');

// Ensure the preferences directory exists
if (!fs.existsSync(preferencesDir)) {
  fs.mkdirSync(preferencesDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    // Get the preferences data from the request
    const requestData = await request.json();
    const preferences = requestData.preferences || requestData;
    const isAutoSave = requestData.isAutoSave || false;
    
    // Add a timestamp and unique ID
    const enhancedPreferences = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      data: preferences,
      isAutoSave: isAutoSave,
    };
    
    // Create a filename based on the ID
    const filename = path.join(preferencesDir, `${enhancedPreferences.id}.json`);
    
    // Write the preferences to a file
    fs.writeFileSync(filename, JSON.stringify(enhancedPreferences, null, 2));
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Preferences saved successfully',
      id: enhancedPreferences.id
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get list of saved preferences files
    const files = fs.readdirSync(preferencesDir);
    
    // Read each file and compile the data
    const preferences = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(preferencesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      })
      // Sort by timestamp (newest first)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Return the data
    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve preferences' },
      { status: 500 }
    );
  }
} 