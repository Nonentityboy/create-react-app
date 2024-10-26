import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd-mobile';
import * as faceapi from 'face-api.js';
import { LeftOutline } from 'antd-mobile-icons';
import AvatarHeader from './AvatarHeader';
import SpeechToText from './SpeechToText';
import menuIcon from '../../assets/menu.svg';
import pauseIcon from '../../assets/pause.svg';
import startIcon from '../../assets/start.svg';
import backIcon from '../../assets/back.svg';
import './index.css';

const user = {
    avatar: 'https://raw.githubusercontent.com/Nonentityboy/PicGoToGitHub/master/1.png', // 替换为实际头像 URL
    name: '颜',
    id: '18838292',
};

const audienceAvatars = [
    'https://raw.githubusercontent.com/Nonentityboy/PicGoToGitHub/master/1.png',
    'https://raw.githubusercontent.com/Nonentityboy/PicGoToGitHub/master/1.png',
    'https://raw.githubusercontent.com/Nonentityboy/PicGoToGitHub/master/1.png',
    // 其他观众头像 URL
];

const audienceCount = 2000;

function FaceDetectionVideo({ messages }) {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    // 控制开启关闭直播
    const [captureVideo, setCaptureVideo] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();
    const videoHeight = 480;
    const videoWidth = 640;

    // 新增状态和事件处理
    const [isPaused, setIsPaused] = useState(false);

    const handlePause = () => {
        setIsPaused(true);
        videoRef.current.pause(); // 暂停视频播放
    };

    const handleResume = () => {
        setIsPaused(false);
        videoRef.current.play(); // 恢复视频播放
    };

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]);
            setModelsLoaded(true);
        };
        loadModels();
    }, []);

    const startVideo = () => {
        setCaptureVideo(true);
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then(stream => {
                const video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error("error:", err);
            });
    };

    const handleVideoOnPlay = () => {
        setInterval(async () => {
            if (canvasRef.current) {
                const displaySize = { width: videoRef.current.offsetWidth, height: videoRef.current.offsetHeight };
                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, displaySize.width, displaySize.height);

                resizedDetections.forEach(detection => {
                    const { x, y, width } = detection.detection.box;
                    ctx.font = "36px Arial";
                    ctx.fillStyle = "red";
                    ctx.textAlign = "center";
                    ctx.fillText("我要当网红", x + width / 2, y - 10);

                });
            }
        }, 1000);
    };


    const closeWebcam = () => {
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks()[0].stop();
        setCaptureVideo(false);
    };

    const handleTranscriptChange = (text) => {
        console.log({ text })
        // addMessage({ name: user.name, text, emoji: '🎤' });
    };

    return (
        <div className="face-detection-container">
            {captureVideo && modelsLoaded && (
                <div className="video-wrapper">
                    <AvatarHeader
                        user={user}
                        audienceCount={audienceCount}
                        audienceAvatars={audienceAvatars}
                    />
                    {/* 底部效果 */}
                    <div className="bottom-left-container">
                        <div className="top-overlay">
                            ⚠️直播提倡绿色直播，严禁涉及政治、涉恐、涉黄、聚众闹事、返现等内容，网警24小时巡查。
                    </div>
                        <div className="live-topic">本场直播主题是【从心开始】</div>
                    </div>


                    <video ref={videoRef} height={videoHeight} width={videoWidth} playsInline controls={false} onPlay={handleVideoOnPlay} className="video-stream" />
                    <canvas ref={canvasRef} className="video-canvas" />

                    {/* 语音转文字功能 */}

                    <SpeechToText
                        onTranscriptChange={handleTranscriptChange}
                        isPaused={isPaused}
                    />

                    {/* AI Agent Messages */}
                    <div className="ai-messages">
                        {messages.map((message) => (
                            <div key={message.id} className="message-item">
                                <span className="message-name">{message.name}:</span>
                                <span>{message.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {captureVideo && modelsLoaded ? (
                <div className="operate-container">
                    <div className={`overlay ${isPaused ? 'active' : ''}`}></div>
                    <img src={menuIcon} alt="Menu Icon" className="button-icon" />
                    <img src={backIcon} onClick={closeWebcam} className="button-icon back-button" alt="Back Icon" />
                    <img
                        src={isPaused ? startIcon : pauseIcon}
                        onClick={isPaused ? handleResume : handlePause}
                        className="button-icon pause-button"
                        alt={isPaused ? "Start Icon" : "Pause Icon"}
                    />
                    {/* 预留其他操作按钮 */}
                </div>
            ) : (
                    <div className="setup-container">
                        <div className="setup-title">定制您的主播人设：</div>
                        <img src="https://raw.githubusercontent.com/Nonentityboy/PicGoToGitHub/master/first.jpg" alt="直播图标" className="setup-image" />
                        <Button color='primary' fill='solid' onClick={startVideo}>一键直播</Button>
                    </div>
                )}
        </div>
    );
}

export default FaceDetectionVideo;
