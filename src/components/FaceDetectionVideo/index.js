import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from 'antd-mobile';
import * as faceapi from 'face-api.js';
import { throttle } from 'lodash';
import taskIcon from '../../assets/task0.svg';
import taskIcon0 from '../../assets/task00.svg';
import bigGiftIcon from '../../assets/bigGift.svg';

import AvatarHeader from './AvatarHeader';
import SpeechToText from './SpeechToText';
import menuIcon from '../../assets/menu.svg';
import pauseIcon from '../../assets/pause.svg';
import startIcon from '../../assets/start.svg';
import backIcon from '../../assets/back.svg';
import { contextService } from '../../store/register';


import task1Icon from '../../assets/task1.svg';
import task2Icon from '../../assets/task2.svg';
import { postRequest } from '../../api';
import './index.css';

const user = {
    avatar: 'https://raw.githubusercontent.com/Nonentityboy/PicGoToGitHub/master/Snipaste_2024-12-21_11-20-48.jpg', // 替换为实际头像 URL
    name: '周',
    id: '18838292',
};

const audienceAvatars = [
    'https://s21.ax1x.com/2024/10/26/pA0PzlD.jpg',
    'https://s21.ax1x.com/2024/10/26/pA0ipOH.jpg',
    'https://s21.ax1x.com/2024/10/26/pA0iCmd.jpg',
    'https://s21.ax1x.com/2024/10/26/pA0iP0A.jpg',
    // 其他观众头像 URL
];

const audienceCount = 2000;

function FaceDetectionVideo({ messages }) {
    console.log({ messages })
    // task任务控制
    const [openTaskNum, setOpenTaskNum] = useState(0);


    const [modelsLoaded, setModelsLoaded] = useState(false);
    // 控制开启关闭直播
    const [captureVideo, setCaptureVideo] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();
    const videoHeight = 480;
    const videoWidth = 640;


    const animateRose = () => {
        const roseElement = document.createElement('img');
        roseElement.src = "https://s21.ax1x.com/2024/10/27/pA0V8Qf.png";
        roseElement.className = 'rose-effect';
        document.body.appendChild(roseElement);
        setTimeout(() => roseElement.classList.add('show'), 100);
        setTimeout(() => document.body.removeChild(roseElement), 2000);
    };

    const animateRocket = () => {
        const rocketElement = document.createElement('img');
        rocketElement.src = "https://s21.ax1x.com/2024/10/27/pA0VGy8.png";
        rocketElement.className = 'rocket-effect';
        document.body.appendChild(rocketElement);
        setTimeout(() => rocketElement.classList.add('show'), 100);
        setTimeout(() => document.body.removeChild(rocketElement), 3000);
    };

    const animateCar = () => {
        const carElement = document.createElement('img');
        carElement.src = "https://s21.ax1x.com/2024/10/27/pA0VJOS.png";
        carElement.className = 'car-effect';
        document.body.appendChild(carElement);

        // 触发动画效果
        setTimeout(() => carElement.classList.add('show'), 100);

        // 动画结束后移除元素
        setTimeout(() => document.body.removeChild(carElement), 3000); // 动画1秒，延迟1.5秒确保完全移出
    };

    const triggerRandomAnimation = () => {
        const animations = [animateRocket, animateCar];
        // const animations = [animateCar];
        const randomIndex = Math.floor(Math.random() * animations.length);
        animations[randomIndex]();
    };

    const captureScreenshot = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
            return canvas.toDataURL("image/png");
        }
        return null;
    };

    const sendScreenshot = useCallback(async () => {
        const screenshot = captureScreenshot();
        if (screenshot) {
            try {
                const roomId = "1";
                // await postRequest(`/api/room_update/modal`, {
                //     room_id: roomId,
                //     img: screenshot,
                // });
            } catch (error) {
                console.error('Error sending screenshot:', error);
            }
        }
    }, []);

    useEffect(() => {
        // const interval = setInterval(sendScreenshot, 5000); // 每5秒发送一次截图
        // return () => clearInterval(interval);
    }, []);

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
                faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
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

    const intervalRef = useRef(null); // 用于保存 intervalId

    const handleEffectClick = async (type) => {
        setShowModal(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // 清除之前的定时器
        }
        let imageUrl;
        switch (type) {
            case '1':
                imageUrl = 'https://s21.ax1x.com/2024/10/27/pA0Ztc6.png';
                break;
            case '2':
                imageUrl = 'https://s21.ax1x.com/2024/10/27/pA0ZY1x.png';

                break;
            case '3':
                imageUrl = 'https://s21.ax1x.com/2024/10/27/pA0ZJ91.png';

                break;
            case '4':
                imageUrl = 'https://s21.ax1x.com/2024/10/27/pA0Z8hR.png';

                break;
        }

        handleVideoOnPlay(imageUrl);
    };
    const firstRequestSent = useRef(false); // 用于控制初次请求

    const handleVideoOnPlay = (imageUrl) => {


        if (intervalRef.current) {
            clearInterval(intervalRef.current); // 清除之前的定时器
        }
        intervalRef.current = setInterval(async () => {
            if (canvasRef.current) {
                const displaySize = { width: videoRef.current.offsetWidth, height: videoRef.current.offsetHeight };
                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();
                const ageAndGender = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks().withAgeAndGender().withFaceDescriptors();

                    console.log({ageAndGender, detections})

                if (ageAndGender.length > 0 && detections.length > 0) {
                    const { age, gender } = ageAndGender[0];
                    const expressions = detections[0].expressions;
                    const dominantExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);

                    contextService.updateUserInfo(age, gender, dominantExpression)
                    // 初次发送用户信息
                }


                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, displaySize.width, displaySize.height);

                resizedDetections.forEach(detection => {
                    const { x, y, width } = detection.detection.box;
                    ctx.font = "36px Arial";
                    ctx.fillStyle = "red";
                    ctx.textAlign = "center";
                    // ctx.fillText("我要当网红", x + width / 2, y - 10);

                    const img = new Image();
                    img.src = imageUrl; // 替换为你的图片URL

                    img.onload = () => {
                        resizedDetections.forEach(detection => {
                            const { x, y, width } = detection.detection.box;

                            // 设置图片的缩放宽度和高度
                            const imgWidth = 200; // 根据需要调整
                            const imgHeight = 150; // 根据需要调整

                            const imgX = x + width / 2 - imgWidth / 2; // 调整图片居中
                            const imgY = y - imgHeight - 10; // 图片显示在原来文字的上方

                            // 绘制缩放后的图片
                            ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
                        });
                    };

                });
            }
        }, 1000);
    };

    const closeWebcam = () => {
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks()[0].stop();
        setCaptureVideo(false);
    };

    const handleTranscriptChange = useCallback(
        throttle(async (text) => {
            // 调用接口
            try {
                let roomId = "1";
                // const result = await postRequest(`/api/room_update/text`, {
                //     room_id: roomId,
                //     text,
                // });

                // console.log({ result, text })
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }, 3000),
        []
    );

    const [showModal, setShowModal] = useState(false); // 控制弹窗显示

    const handleBigGiftClick = () => {
        setShowModal(true);
    };


    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (autoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, autoScroll]);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            // 判断用户是否手动滚动过，来决定是否继续自动滚动
            setAutoScroll(scrollTop + clientHeight >= scrollHeight - 5);
        }
    };
    const [isSpeechSupported, setIsSpeechSupported] = useState(true);

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
                        <div className="live-topic">本场直播主题是【我是大明星】</div>
                    </div>


                    <video ref={videoRef} height={videoHeight} width={videoWidth} playsInline controls={false} onPlay={() => handleVideoOnPlay('https://s21.ax1x.com/2024/10/27/pA0Z8hR.png')} className="video-stream" />
                    <canvas ref={canvasRef} className="video-canvas" />

                    {/* 语音转文字功能 */}

                    {/* <SpeechToText
                        onTranscriptChange={handleTranscriptChange}
                        isPaused={isPaused}
                    /> */}

                    {/* AI Agent Messages */}
                    <div
                        className="ai-messages"
                        onScroll={handleScroll}
                        ref={containerRef}
                        style={{ overflowY: 'auto', maxHeight: '185px' }} // 设置最大高度以启用滚动
                    >
                        {messages.map((message) => (
                            <div key={message.id} className="message-item">
                                <span className="message-name">{message.name}:</span>
                                <span>{message.text}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 开场任务 */}
                    {
                        openTaskNum === 0 && (
                            <div className="ai-open-task" onClick={() => setOpenTaskNum(1)}>
                                <img src={task1Icon} alt="Menu Icon" className="ai-open-task-icon" />
                                <span>请随机选一条留言进行回复！</span>
                                <img src={task2Icon} alt="Menu Icon" className="ai-open-task-icon2" />
                            </div>
                        )
                    }

                    {/* 顶部任务 */}
                    {
                        openTaskNum === 1 && (
                            <>
                                <div className="avatar-header-open" >
                                    <img className="avatar-header-open-icon" src={taskIcon}></img>
                                    <span>开启一场经典直播任务</span>
                                </div>
                                <div onClick={() => setOpenTaskNum(2)} className="avatar-header-open avatar-header-open2">
                                    <img className="avatar-header-open-icon" src={taskIcon0}></img>
                                    <span>你已经解锁了观众千人成就！</span>
                                </div>
                            </>
                        )
                    }
                    {
                        openTaskNum === 2 && (
                            <div className="avatar-header-open3"
                                onClick={() => {
                                    setOpenTaskNum(0);
                                    triggerRandomAnimation();
                                }}>
                                <img className="avatar-header-open3icon"
                                    src="https://s21.ax1x.com/2024/10/26/pA0PbwR.jpg" />
                            </div>
                        )

                    }

                </div>
            )}
            {captureVideo && modelsLoaded ? (
                <div className="operate-container">
                    {
                        isPaused && (
                            <div className={`active`}>
                                <div>
                                    <div>已暂停</div>
                                    <div>点击继续</div>
                                </div>
                                <img
                                    src={startIcon}
                                    onClick={handleResume}
                                    className="pause-button"
                                />
                            </div>
                        )
                    }

                    <img src={menuIcon} alt="Menu Icon" className="button-icon" />
                    <img src={backIcon} onClick={closeWebcam} className="button-icon back-button" alt="Back Icon" />
                    <img
                        src={isPaused ? startIcon : pauseIcon}
                        onClick={isPaused ? handleResume : handlePause}
                        className="button-icon pause-button"
                        alt={isPaused ? "Start Icon" : "Pause Icon"}
                    />

                    <div className="bigGift-wrap" onClick={handleBigGiftClick}>
                        <img src={bigGiftIcon} className="bigGift-wrap-icon" />
                    </div>

                    {showModal && (
                        <div className="gift-modal">
                            <div onClick={() => handleEffectClick('1')}>
                                <img src="https://s21.ax1x.com/2024/10/27/pA0Ztc6.png" alt="标题" />
                            </div>
                            <div onClick={() => handleEffectClick('2')}>
                                <img src="https://s21.ax1x.com/2024/10/27/pA0ZY1x.png" alt="标题" />
                            </div>
                            <div onClick={() => handleEffectClick('3')}>
                                <img src="https://s21.ax1x.com/2024/10/27/pA0ZJ91.png" alt="标题" />
                            </div>
                            <div onClick={() => handleEffectClick('4')}>
                                <img src="https://s21.ax1x.com/2024/10/27/pA0Z8hR.png" alt="标题" />
                            </div>
                            {/* //         https://s21.ax1x.com/2024/10/27/pA0Ztc6.png
        // https://s21.ax1x.com/2024/10/27/pA0ZY1x.png
        // https://s21.ax1x.com/2024/10/27/pA0ZJ91.png
        // https://s21.ax1x.com/2024/10/27/pA0Z8hR.png */}
                        </div>
                    )}
                    {/* 预留其他操作按钮 */}
                </div>
            ) : (
                    <div className="setup-container">
                        <img src="https://raw.githubusercontent.com/Nonentityboy/PicGoToGitHub/master/Snipaste_2024-12-20_23-37-15.jpg" alt="直播图标" className="setup-image" />
                        <Button color='primary' fill='solid' onClick={startVideo}>一键直播</Button>
                    </div>
                )}
        </div>
    );
}

export default FaceDetectionVideo;
