import React from 'react';
import { FaTrash, FaPlay, FaRegLightbulb } from 'react-icons/fa';
import { generateAudioForStatement } from '../api/audio';

const DialogCreation = ({ speakers, dialog, setDialog, apiKey }) => {
  const addStatement = () => {
    setDialog([...dialog, { speaker: speakers[0]?.voice_id, text: '', audio: null}]);
  };

  const updateStatement = (index, field, value) => {
    const updatedDialog = [...dialog];
    updatedDialog[index][field] = value;
    setDialog(updatedDialog);
  };

    const removeStatement = (index) => {
        const updatedDialog = [...dialog];
        updatedDialog.splice(index, 1);
        setDialog(updatedDialog);
    };


const generateAudio = async (index) => {
    const statement = dialog[index];
    const voiceId = statement.speaker; // Get the voiceId from the statement

    if (!statement.generatedAudio || statement.text !== statement.prevText) {
        try {
            const audioBlob = await generateAudioForStatement(apiKey, voiceId, statement.text);
            setDialog(prevDialog => prevDialog.map((line, i) => i === index ? {...line, generatedAudio: audioBlob, prevText: line.text} : line));
        } catch (error) {
            console.error('Error in generating audio:', error);
        }
    }
};

const playAudio = async (statement) => {
    if (statement.generatedAudio) {
        try {
            const url = window.URL.createObjectURL(statement.generatedAudio);
            const audio = new Audio(url);
            audio.play();
        } catch (error) {
            console.error('Error in playing audio:', error);
        }
    }
};

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-4">
        {dialog.map((statement, index) => (
          <div key={index} className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
            <select
              className="bg-transparent flex-1"
              value={statement.speaker}
              onChange={(e) => updateStatement(index, 'speaker', e.target.value)}
            >
              {speakers.map((speaker, i) => (
                <option key={i} value={speaker.voice_id}>{speaker.name}</option>
              ))}
            </select>
            <input
              className="flex-2 bg-white border border-gray-300 p-2 rounded"
              type="text"
              value={statement.text}
              onChange={(e) => updateStatement(index, 'text', e.target.value)}
              placeholder="Enter text here"
            />
            <button 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => removeStatement(index)}>
                <FaTrash />
            </button>
            <button 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => generateAudio(index)}>
                <FaRegLightbulb />
            </button>
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => playAudio(statement)}>
                <FaPlay />
            </button>
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
