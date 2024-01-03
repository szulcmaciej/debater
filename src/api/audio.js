import axios from 'axios';
import Crunker from 'crunker';

export const elevenTextToSpeech = async (apiKey, voiceId, text) => {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const data = {
        model_id: "eleven_multilingual_v2", // or another model ID as per your requirement
        text: text,
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
            // other settings if needed
        }
    };

    const maxRetries = 3;
    const initialDelay = 1000; // 1 second
    let currentDelay = initialDelay;

    for (let retry = 1; retry <= maxRetries; retry++) {
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
            if (retry === maxRetries) {
                throw error;
            } else {
                const randomFactor = Math.random() * 0.5 + 0.5; // random factor between 0.5 and 1
                const delayWithRandomness = currentDelay * randomFactor;
                console.log(`Retrying in ${delayWithRandomness}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayWithRandomness));
                currentDelay *= 2; // exponential backoff
            }
        }
    }
};

export const concatenateStatementsAudio = async (dialog) => {
    const crunker = new Crunker();
    try {
      const audioBlobs = dialog.map(statement => statement.generatedAudio);
  
      // Convert each blob to an ArrayBuffer
      const arrayBuffers = await Promise.all(audioBlobs.map(blob => blob.arrayBuffer()));
  
      // Convert ArrayBuffers to AudioBuffers
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 44100});
      const audioBuffers = await Promise.all(arrayBuffers.map(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)));
  
      // Use Crunker to concatenate audio buffers and export the final audio
      const concatenated = crunker.concatAudio(audioBuffers);
      const output = crunker.export(concatenated, 'audio/mp3');
    //   crunker.download(output.blob, 'dialog');
      return output.blob;
    } catch (error) {
      console.error('Error in generating or downloading dialog audio:', error);
    }
  };