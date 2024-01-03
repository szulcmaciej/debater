import React, { useState, useEffect } from 'react';

const APIKeyManager = ({ setGlobalApiKey }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Retrieve the API key from local storage on initial load
    const storedApiKey = localStorage.getItem('elevenLabsApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setGlobalApiKey(storedApiKey); // Update the global state
    }
  }, [setGlobalApiKey]);

  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('elevenLabsApiKey', newApiKey); // Save to local storage
    setGlobalApiKey(newApiKey); // Update the global state
  };

  return (
    <div className="w-full text-center">
      <label className="block">
        Enter your ElevenLabs API Key:
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="API Key"
          className="w-full my-2 p-2 border border-gray-300 rounded" // Add the CSS class for styling
        />
      </label>
    </div>
  );
};

export default APIKeyManager;
