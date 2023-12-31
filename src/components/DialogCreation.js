import React, { useState } from 'react';

const DialogCreation = ({ speakers }) => {
  const [dialog, setDialog] = useState([]);

  const addStatement = () => {
    setDialog([...dialog, { speaker: speakers[0], text: '' }]);
  };

  const updateStatement = (index, field, value) => {
    const updatedDialog = [...dialog];
    updatedDialog[index][field] = value;
    setDialog(updatedDialog);
  };

  return (
    <div>
      <h2>Create Dialog</h2>
      {dialog.map((line, index) => (
        <div key={index}>
          <select
            value={line.speaker}
            onChange={(e) => updateStatement(index, 'speaker', e.target.value)}
          >
            {speakers.map((speaker, i) => (
              <option key={i} value={speaker}>
                {speaker}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={line.text}
            onChange={(e) => updateStatement(index, 'text', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addStatement}>Add Statement</button>
    </div>
  );
};

export default DialogCreation;
