import React, { useState } from 'react';

const SpeakersManagement = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  return (
    <div>
      <h2>Upload Voice Samples</h2>
      <input type="file" onChange={handleFileChange} multiple />
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SpeakersManagement;
