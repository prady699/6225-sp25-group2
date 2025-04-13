'use client';

import React, { useState } from 'react';
import { HiSave, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

interface SavePreferencesProps {
  preferences: any;
  onSaved?: (id: string) => void;
}

export default function SavePreferences({ preferences, onSaved }: SavePreferencesProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('idle');

      const response = await fetch('/api/save-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus('success');
        setPreferenceId(data.id);
        if (onSaved) {
          onSaved(data.id);
        }
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isSaving
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
          }`}
        >
          {isSaving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <HiSave className="w-5 h-5" />
              <span>Save Preferences</span>
            </>
          )}
        </button>

        {saveStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <HiCheckCircle className="w-5 h-5" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <HiExclamationCircle className="w-5 h-5" />
            <span>Failed to save preferences</span>
          </div>
        )}
      </div>

      {saveStatus === 'success' && preferenceId && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Your preferences have been saved with ID:
          </p>
          <p className="mt-1 font-mono text-sm select-all bg-gray-100 p-2 rounded">{preferenceId}</p>
        </div>
      )}
    </div>
  );
} 