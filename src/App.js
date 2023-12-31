import React, { useState } from 'react';
import APIKeyManager from './components/APIKeyManager';
import SpeakersManagement from './components/SpeakersManagement';
import DialogCreation from './components/DialogCreation';
import AudioGeneration from './components/AudioGeneration';

const App = () => {
  const speakers = ['Speaker 1', 'Speaker 2', 'Speaker 3']; // Example speakers list
  const [dialog, setDialog] = useState([]);
  const [globalApiKey, setGlobalApiKey] = useState('');

  return (
    <div>
      <APIKeyManager setGlobalApiKey={setGlobalApiKey} />
      <SpeakersManagement />
      <DialogCreation speakers={speakers} dialog={dialog} setDialog={setDialog} />
      <AudioGeneration dialog={dialog} />
    </div>
  );
};

export default App;
