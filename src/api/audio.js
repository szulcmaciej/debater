import axios from 'axios';

export const generateDialogAudio = async (dialog, apiKey) => {
    const audioFiles = [];
  
    for (const statement of dialog) {
      try {
        const audio = await generateAudioForStatement(apiKey, statement.text, statement.speaker);
        audioFiles.push(audio);
      } catch (error) {
        console.error('Error generating audio for statement:', error);
        // Handle error appropriately
      }
    }
  
    // TODO: Concatenate audioFiles here (client-side or send to server)
  };
  
export const generateAudioForStatement = async (apiKey, voiceId, text) => {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const data = {
      model_id: "eleven_multilingual_v2", // or another model ID as per your requirement
      text: text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
        // other settings if needed
      }
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        responseType: 'blob' // important for receiving the audio file
      });
  
      return response.data; // returns a blob of audio data
    } catch (error) {
      console.error('Error in generating audio:', error);
      throw error;
    }
  };


export const downloadAudio = (audioBlob) => {
    const url = window.URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dialog.mp3';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  
  const concatenateAudioBuffers = (audioBuffers) => {
    // Concatenate the audio buffers into one Blob
    let blob = new Blob(audioBuffers, { type: 'audio/mpeg' });
    return blob;
  };

  // Function to handle the entire process
export const generateAndDownloadDialog = async (dialog, apiKey) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let buffers = [];
  
    for (const statement of dialog) {
      const audioBlob = await generateAudioForStatement(apiKey, statement.speaker.voice_id, statement.text);
      downloadAudio(audioBlob);
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      buffers.push(audioBuffer);
    }
  
    const finalAudioBlob = concatenateAudioBuffers(buffers);
    downloadAudio(finalAudioBlob);
  };