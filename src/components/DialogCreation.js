import React from 'react';

const DialogCreation = ({ speakers, dialog, setDialog }) => {
  const addStatement = () => {
    setDialog([...dialog, { speaker: speakers[0]?.voice_id, text: '' }]);
  };

  const updateStatement = (index, field, value) => {
    const updatedDialog = [...dialog];
    updatedDialog[index][field] = value;
    setDialog(updatedDialog);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Voice settings</h2>
      <div className="w-full max-w-md space-y-4">
        {dialog.map((line, index) => (
          <div key={index} className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
            <select
              className="bg-transparent flex-1"
              value={line.speaker}
              onChange={(e) => updateStatement(index, 'speaker', e.target.value)}
            >
              {speakers.map((speaker, i) => (
                <option key={i} value={speaker.voice_id}>{speaker.name}</option>
              ))}
            </select>
            <input
              className="flex-2 bg-white border border-gray-300 p-2 rounded"
              type="text"
              value={line.text}
              onChange={(e) => updateStatement(index, 'text', e.target.value)}
              placeholder="Enter text here"
            />
          </div>
        ))}
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addStatement}>
          Add Statement
        </button>
      </div>
    </div>
  );
};

export default DialogCreation;
