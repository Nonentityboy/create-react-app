import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { contextService } from '../../store/register';

function TranscriptDisplay() {
    const containerRef = useRef(null);
    const pauseTimer = useRef(null);
    const recognitionRef = useRef(null); // 用来存储 SpeechRecognition 实例
    const { transcript } = useSnapshot(contextService.state);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('语音识别不支持此浏览器');
            return;
        }

        // 如果 recognitionRef.current 不存在，则初始化 SpeechRecognition
        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'zh-CN';
            recognition.continuous = true;

            recognition.onresult = (event) => {
                clearTimeout(pauseTimer.current);
                const currentTranscript = event.results[event.results.length - 1][0].transcript;
                console.log({ currentTranscript });
                contextService.appendTranscript(currentTranscript);

                pauseTimer.current = setTimeout(() => {
                    contextService.addPunctuation();
                }, 3000);
            };

            recognition.onerror = (event) => {
                console.error('识别错误:', event.error);
                recognition.stop();
            };

            recognition.onend = () => {
                console.log('识别已停止，尝试重启');
                recognition.start();  // 自动重新启动
            };

            recognitionRef.current = recognition; // 将识别实例保存在 ref 中
        }

        recognitionRef.current.start();

        return () => {
            recognitionRef.current.stop(); // 停止识别
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
                zIndex: 1000,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                width: 'calc(100% - 24px)',
                maxHeight: '5rem',
                overflow: 'auto',
                borderRadius: '1.5rem',
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

