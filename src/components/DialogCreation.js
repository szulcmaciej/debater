import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaRedo, FaPlus, FaArrowUp, FaArrowDown, FaVolumeUp } from 'react-icons/fa';
import { elevenTextToSpeech, concatenateStatementsAudio } from '../api/audio';

const DialogCreation = ({ speakers, apiKey }) => {
    const [dialog, setDialog] = useState([]);
    const [generatedDialogAudio, setGeneratedDialogAudio] = useState(null);
    const statementAudioRefs = useRef([]);
    const dialogAudioRef = useRef(null);

    const addStatement = () => {
        setDialog([...dialog, { speaker: speakers[0]?.voice_id, text: '', is_loading: false }]);
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

    const moveStatementUp = (index) => {
        if (index === 0) return; // Can't move the first statement up
    
        const updatedDialog = [...dialog];
        const temp = updatedDialog[index];
        updatedDialog[index] = updatedDialog[index - 1];
        updatedDialog[index - 1] = temp;
        setDialog(updatedDialog);
    };

    const moveStatementDown = (index) => {
        if (index === dialog.length - 1) return; // Can't move the last statement down

        const updatedDialog = [...dialog];
        const temp = updatedDialog[index];
        updatedDialog[index] = updatedDialog[index + 1];
        updatedDialog[index + 1] = temp;
        setDialog(updatedDialog);
    };


    const generateAudioForStatement = async (index) => {
        const statement = dialog[index];
        const voiceId = statement.speaker; // Get the voiceId from the statement

        try {
            // Show spinner while generating audio
            setDialog(prevDialog => prevDialog.map((line, i) => i === index ? { ...line, is_loading: true } : line));
            const audioBlob = await elevenTextToSpeech(apiKey, voiceId, statement.text);
            setDialog(prevDialog => prevDialog.map((line, i) => i === index ? { ...line, generatedAudio: audioBlob, prevText: line.text, is_loading: false } : line));
        } catch (error) {
            console.error('Error in generating audio:', error);
            // Hide spinner and handle error
            setDialog(prevDialog => prevDialog.map((line, i) => i === index ? { ...line, is_loading: false } : line));
        }
    };

    const generateAudioForAllStatements = async () => {
        var newDialog = [...dialog];
        await Promise.all(dialog.map(async (statement, index) => {
            if (!statement.generatedAudio || statement.text !== statement.prevText) {
                try {
                    setDialog(prevDialog => prevDialog.map((line, i) => i === index ? { ...line, is_loading: true } : line));
                    const audioBlob = await elevenTextToSpeech(apiKey, statement.speaker, statement.text);
                    setDialog(prevDialog => prevDialog.map((line, i) => i === index ? { ...line, generatedAudio: audioBlob, prevText: line.text, is_loading: false } : line));
                    newDialog[index] = { ...statement, generatedAudio: audioBlob, prevText: statement.text };
                } catch (error) {
                    console.error('Error in generating audio:', error);
                    setDialog(prevDialog => prevDialog.map((line, i) => i === index ? { ...line, is_loading: false } : line));
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

    useEffect(() => {
        statementAudioRefs.current.forEach(audioEl => {
            if (audioEl) {
                audioEl.load();
            }
        });
    }, [dialog]);

    useEffect(() => {
        if (dialogAudioRef.current) {
            dialogAudioRef.current.load();
        }
    }, [generatedDialogAudio]);

    const generateButton = (index, statement) => {
        const spinner_div = <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>;
        let content;
        if (statement.is_loading) {
            content = spinner_div;
        }
        else {
            content = statement.text === statement.prevText ? <FaRedo /> : <FaVolumeUp />;
        }

        return (
            <button
                className={`font-bold py-2 px-4 rounded ${statement.text === statement.prevText ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-yellow-500 hover:bg-yellow-700 text-white'}`}
                onClick={() => generateAudioForStatement(index)}
                title={statement.text === statement.prevText ? 'Regenerate Audio' : 'Generate Audio'}>
                {content}
            </button>
        );
    }

    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-full max-w-xl space-y-4">
                {dialog.map((statement, index) => (
                    <div className="flex flex-col bg-gray-100 p-3 rounded-lg">
                        <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <select
                                className="flex-1 bg-white border border-gray-300 p-2 rounded"
                                value={statement.speaker}
                                onChange={(e) => updateStatement(index, 'speaker', e.target.value)}
                            >
                                {speakers.map((speaker, i) => (
                                    <option key={i} value={speaker.voice_id}>{speaker.name}</option>
                                ))}
                            </select>
                            <textarea
                                className="flex-2 bg-white border border-gray-300 p-2 rounded"
                                value={statement.text}
                                onChange={(e) => updateStatement(index, 'text', e.target.value)}
                                placeholder="Enter text here"
                                rows={2}
                            />
                            <div className="flex flex-row justify-center space-y-0 space-x-2 bg-gray-100 p-3 rounded-lg">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => removeStatement(index)}>
                                    <FaTrash />
                                </button>
                                {generateButton(index, statement)}
                                
                                <button
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${index === 0 ? ' opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => moveStatementUp(index)}
                                    disabled={index === 0}
                                    >
                                    <FaArrowUp />
                                </button>
                                <button
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${index === dialog.length - 1 ? ' opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => moveStatementDown(index)}
                                    disabled={index === dialog.length - 1}
                                    >
                                    <FaArrowDown />
                                </button>
                            </div>
                        </div>
                        {statement.generatedAudio && (
                            <audio className="w-full" ref={el => statementAudioRefs.current[index] = el} controls>
                                <source src={window.URL.createObjectURL(statement.generatedAudio)} type="audio/mp3" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>
                ))}
                <div className="flex justify-center">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={addStatement}>
                        <FaPlus />
                    </button>
                </div>
            </div>
            <div className="w-full max-w-xl">
                <div className="flex justify-center py-4">
                    <h2 className="text-2xl font-bold">Generated audio</h2>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
                        <button className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => generateDialogAudio()}>Generate debate audio</button>
                        <button className={`flex-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!generatedDialogAudio ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => saveBlob(generatedDialogAudio, 'dialog.mp3')} disabled={!generatedDialogAudio}>Save mp3</button>
                    </div>
                    {generatedDialogAudio && (
                        <audio className="w-full" ref={dialogAudioRef} controls>
                            <source src={window.URL.createObjectURL(generatedDialogAudio)} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </div>
            </div>
        </div>

    );
};

export default DialogCreation;
