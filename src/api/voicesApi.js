import axios from 'axios';

// Fetches the list of available voices from ElevenLabs API
export const fetchVoices = async (apiKey) => {
  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey }
    });
    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};

// Adds a new voice to the user's collection in ElevenLabs API
export const addNewVoice = async (apiKey, voiceName, description, file) => {
  const formData = new FormData();
  formData.append('name', voiceName);
  formData.append('description', description);
  formData.append('files', file); // Assuming 'file' is a File object
  // Add 'labels' if necessary

  try {
    const response = await axios.post('https://api.elevenlabs.io/v1/voices/add', formData, {
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.voice_id; // Returns the added voice ID
  } catch (error) {
    console.error('Error adding voice:', error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};
