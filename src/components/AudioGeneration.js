import React from 'react';
import { generateAndDownloadDialog } from '../api/audio'

const AudioGeneration = ({ dialog, apiKey }) => {
  const generateAudio = async () => {
    try {
      await generateAndDownloadDialog(dialog, apiKey);
    } catch (error) {
      console.error('Error generating audio for dialog:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div>
      <h2>Generate Audio</h2>
      <button onClick={generateAudio}>Generate Audio File</button>
    </div>
  );
};

export default AudioGeneration;