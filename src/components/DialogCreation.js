import React, { useState } from 'react';
import { FaTrash, FaPlay, FaRedo, FaLightbulb } from 'react-icons/fa';
import { elevenTextToSpeech, concatenateStatementsAudio } from '../api/audio';

const DialogCreation = ({ speakers, apiKey }) => {
    const [dialog, setDialog] = useState([]);
    const [generatedDialogAudio, setGeneratedDialogAudio] = useState(null);
    const addStatement = () => {
        setDialog([...dialog, { speaker: speakers[0]?.voice_id, text: '', }]);
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


    const generateAudioForStatement = async (index) => {
        const statement = dialog[index];
        const voiceId = statement.speaker; // Get the voiceId from the statement

        try {
            const audioBlob = await elevenTextToSpeech(apiKey, voiceId, statement.text);
            setDialog(prevDialog => prevDialog.map((line, i) => i === index ? { ...line, generatedAudio: audioBlob, prevText: line.text } : line));
        } catch (error) {
            console.error('Error in generating audio:', error);
        }
    };

    const generateAudioForAllStatements = async () => {
        var newDialog = [...dialog];
        await Promise.all(dialog.map(async (statement, index) => {
            if (!statement.generatedAudio || statement.text !== statement.prevText) {
                try {
                    const audioBlob = await elevenTextToSpeech(apiKey, statement.speaker, statement.text);
                    newDialog[index] = { ...statement, generatedAudio: audioBlob, prevText: statement.text };
                } catch (error) {
                    console.error('Error in generating audio:', error);
                }

            }
        }));
        setDialog(newDialog);
        return newDialog;
    };

    const generateDialogAudio = async () => {
        try {
            const dialogWithAudio = await generateAudioForAllStatements();
            console.log('Generating dialog audio...');
            const dialogAudio = await concatenateStatementsAudio(dialogWithAudio);
            setGeneratedDialogAudio(dialogAudio);
        } catch (error) {
            console.error('Error in generating audio:', error);
        }
    };

    const playStatementAudio = async (statement) => {
        if (statement.generatedAudio) {
            playAudio(statement.generatedAudio);
        }
    };

    const playAudio = async (audioBlob) => {
        try {
            const url = window.URL.createObjectURL(audioBlob);
            const audio = new Audio(url);
            audio.play();
        } catch (error) {
            console.error('Error in playing audio:', error);
        }
    };

    var saveBlob = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (blob, fileName) {
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-full max-w-xl space-y-4">
                {dialog.map((statement, index) => (
                    <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-100 p-3 rounded-lg">
                        <select
                            className="flex-1 bg-white border border-gray-300 p-2 rounded"
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
                        <div className="flex flex-row items-center space-y-0 space-x-2 bg-gray-100 p-3 rounded-lg">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => removeStatement(index)}>
                                <FaTrash />
                            </button>
                            <button
                                className={`font-bold py-2 px-4 rounded ${statement.text === statement.prevText ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-yellow-500 hover:bg-yellow-700 text-white'}`}
                                onClick={() => generateAudioForStatement(index)}
                                title={statement.text === statement.prevText ? 'Regenerate Audio' : 'Generate Audio'}>
                                {statement.text === statement.prevText ? <FaRedo /> : <FaLightbulb />}
                            </button>
                            <button
                                className={`font-bold py-2 px-4 rounded ${statement.generatedAudio && statement.text === statement.prevText ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                                onClick={() => playStatementAudio(statement)}
                                disabled={!statement.generatedAudio || statement.text !== statement.prevText}
                                title={statement.generatedAudio && statement.text === statement.prevText ? 'Play Audio' : 'Audio not available, generate it first with the other button.'}>
                                <FaPlay />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={addStatement}>
                        Add Statement
                    </button>
                </div>
            </div>
            <div>
                <div className="flex justify-center py-4">
                    <h2>Whole debate audio</h2>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => generateDialogAudio()}>Generate debate audio</button>
                    <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!generatedDialogAudio ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => playAudio(generatedDialogAudio)} disabled={!generatedDialogAudio}>Play debate</button>
                    <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!generatedDialogAudio ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => saveBlob(generatedDialogAudio, 'dialog.mp3')} disabled={!generatedDialogAudio}>Save mp3</button>
                </div>
            </div>
        </div>

    );
};

export default DialogCreation;
