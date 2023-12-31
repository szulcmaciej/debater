import axios from 'axios';
import Crunker from 'crunker';

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

export const generateAndDownloadDialog = async (dialog, apiKey) => {
    const crunker = new Crunker();
    try {
      const audioBlobs = await Promise.all(
        dialog.map(statement => generateAudioForStatement(apiKey, statement.speaker.voice_id, statement.text))
      );
  
      // Convert each blob to an ArrayBuffer
      const arrayBuffers = await Promise.all(audioBlobs.map(blob => blob.arrayBuffer()));
  
      // Convert ArrayBuffers to AudioBuffers
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffers = await Promise.all(arrayBuffers.map(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)));
  
      // Use Crunker to concatenate audio buffers and export the final audio
      const concatenated = crunker.concatAudio(audioBuffers);
      const output = crunker.export(concatenated, 'audio/mp3');
      crunker.download(output.blob, 'dialog');
    } catch (error) {
      console.error('Error in generating or downloading dialog audio:', error);
    }
  };