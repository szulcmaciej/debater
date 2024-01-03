import React, { useState, useEffect } from 'react';
import { fetchVoices } from './api/voicesApi';
import APIKeyManager from './components/APIKeyManager';
import SpeakersManagement from './components/SpeakersManagement';
import DialogCreation from './components/DialogCreation';

const App = () => {
  const [globalApiKey, setGlobalApiKey] = useState('');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (globalApiKey) {
      fetchVoices(globalApiKey)
        .then(voices => {
          console.log('Fetched voices:', voices); // Check the structure here
          setVoices(voices);
        })
        .catch(error => {
          console.error('Error fetching voices:', error);
          // Handle error appropriately
        });
    }
  }, [globalApiKey]);

  return (
    <div>
      <APIKeyManager setGlobalApiKey={setGlobalApiKey} />
      {/* <SpeakersManagement /> */}
      <DialogCreation speakers={voices} apiKey={globalApiKey}/>
    </div>
  );
};

export default App;
