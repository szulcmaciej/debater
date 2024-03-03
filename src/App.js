import React, { useState, useEffect } from 'react';
import { fetchVoices } from './api/voicesApi';
import APIKeyManager from './components/APIKeyManager';
import SpeakersManagement from './components/SpeakersManagement';
import DialogCreation from './components/DialogCreation';

const App = () => {
  const [globalApiKey, setGlobalApiKey] = useState('');
  const [allVoices, setVoices] = useState([]);
  const [clonedOnly, setClonedOnly] = useState(true);

  const onlyClonedVoices = (voices) => {
    return voices.filter(voice => voice.category === 'cloned');
  }

  useEffect(() => {
    if (globalApiKey) {
      fetchVoices(globalApiKey)
        .then(allVoices => {
          console.log('Fetched voices:', allVoices); // Check the structure here
          setVoices(allVoices);
        })
        .catch(error => {
          console.error('Error fetching voices:', error);
          // Handle error appropriately
        });
    }
  }, [globalApiKey]);

  const filteredVoices = clonedOnly ? onlyClonedVoices(allVoices) : allVoices;

  return (
    <div>
      <APIKeyManager setGlobalApiKey={setGlobalApiKey} />
      <SpeakersManagement clonedOnly={clonedOnly} setClonedOnly={setClonedOnly} />
      <DialogCreation speakers={filteredVoices} apiKey={globalApiKey}/>
    </div>
  );
};

export default App;
