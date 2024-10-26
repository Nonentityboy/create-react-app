import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd-mobile';
import * as faceapi from 'face-api.js';
import './index.css'; // 引入独立的CSS文件

function FaceDetectionVideo({ messages, addMessage }) {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    // 控制开启关闭直播
    const [captureVideo, setCaptureVideo] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();
    const videoHeight = 480;
    const videoWidth = 640;

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

                    addMessage(); // 每次检测到人脸时添加消息
                });
            }
        }, 1000);
    };


    const closeWebcam = () => {
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks()[0].stop();
        setCaptureVideo(false);
    };

    return (
        <div className="face-detection-container">
            {captureVideo && modelsLoaded && (
                <div className="video-wrapper">
                    {/* 顶部效果 */}
                    <div className="bottom-left-container">
                        <div className="top-overlay">
                            ⚠️直播提倡绿色直播，严禁涉及政治、涉恐、涉黄、聚众闹事、返现等内容，网警24小时巡查。
                    </div>
                        <div className="live-topic">本场直播主题是【从心开始】</div>
                    </div>


                    <video ref={videoRef} height={videoHeight} width={videoWidth} playsInline controls={false} onPlay={handleVideoOnPlay} className="video-stream" />
                    <canvas ref={canvasRef} className="video-canvas" />

                    {/* AI Agent Messages */}
                    <div className="ai-messages">
                        {messages.slice(-3).map((message) => ( // 仅显示最新的三条消息
                            <div key={message.id} className="message-item">
                                <span className="message-name">{message.name}:</span>
                                <span>{message.text} {message.emoji}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {captureVideo && modelsLoaded ? (
                <Button color='primary' fill='outline' onClick={closeWebcam} className="close-button">
                    关闭直播
                </Button>
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
