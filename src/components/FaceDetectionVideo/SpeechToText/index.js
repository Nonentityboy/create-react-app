import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd-mobile';

function SpeechToText({ onTranscriptChange, isPaused }) {
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        const initSpeechRecognition = () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'zh-CN';

                recognitionRef.current.onresult = (event) => {
                    const current = event.resultIndex;
                    const transcriptResult = event.results[current][0].transcript;
                    setTranscript(prev => prev + transcriptResult);
                    onTranscriptChange(transcriptResult);
                };

                recognitionRef.current.onerror = (event) => {
                    console.error("Speech recognition error:", event.error);
                    stopListening();
                };
            } else {
                alert('你的浏览器不支持语音识别功能');
            }
        };

        initSpeechRecognition();
    }, [onTranscriptChange]);

    const startListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    // 根据外部 isPaused 状态进行控制
    // TODO : 第二次开启暂停之后，语音识别失败
    useEffect(() => {
        if (isPaused) {
            stopListening();
        } else {
            startListening();
        }
    }, [isPaused]);

    return (
        <div className="speech-to-text">
            <Input
                placeholder="语音识别结果将显示在此处..."
                value={transcript}
                readOnly
            />
        </div>
    );
}

export default SpeechToText;
