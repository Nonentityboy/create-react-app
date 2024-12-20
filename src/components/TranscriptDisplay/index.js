import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { contextService } from '../../store/register';

function TranscriptDisplay({ setIsSpeechSupported }) {
    const containerRef = useRef(null);
    const pauseTimer = useRef(null);

    const { transcript } = useSnapshot(contextService.state);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [transcript]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = true;

        recognition.onresult = (event) => {
            clearTimeout(pauseTimer.current);
            const currentTranscript = event.results[event.results.length - 1][0].transcript;
            console.log({currentTranscript})
            contextService.appendTranscript(currentTranscript);

            pauseTimer.current = setTimeout(() => {
                contextService.addPunctuation();
            }, 3000);
        };

        recognition.onerror = (event) => {
            console.error('识别错误:', event.error);
        };

        recognition.start();

        return () => {
            recognition.stop(); // 停止识别
            clearTimeout(pauseTimer.current);
        };
    }, []);


    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: '60px',
                margin: '2px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                width: 'calc(100% - 24px)',
                maxHeight: '5rem', // max-h-20 (20 * 0.25rem = 5rem)
                overflow: 'auto',
                borderRadius: '1.5rem', // rounded-3xl (1.5rem is 24px)
                minWidth: 'calc(100% - 24px)',
                minHeight: '50px',
                wordBreak: 'break-word',
            }}
        >
            <div style={{ padding: '1rem' }}>{transcript || '主播字幕识别中.....'}</div>
        </div>

    );
}

export default TranscriptDisplay;
