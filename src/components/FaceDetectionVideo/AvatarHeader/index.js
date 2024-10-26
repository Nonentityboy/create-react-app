import React, { useState, useEffect } from 'react';
import time from '../../../assets/time.svg';
import fireIcon from '../../../assets/fire.svg';
import countIcon from '../../../assets/count.svg';
import giftIcon from '../../../assets/gift.svg';
import { getRequest } from '../../../api';
import './index.css';

function AvatarHeader({ user, audienceCount, audienceAvatars }) {
    const [timeLeft, setTimeLeft] = useState(300); // 5分钟倒计时（300秒）
    const [score, setScore] = useState(18920); // 初始积分
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAnimating2, setIsAnimating2] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0); // 增加效果中的积分变化
    const [popularity, setPopularity] = useState(2000); // 初始人气值
    const [animatedPopularity, setAnimatedPopularity] = useState(0); // 人气值的动画效果

    useEffect(() => {
        // 每隔 5 秒轮询获取人气全量值
        const fetchPopularity = async () => {
            try {
                let roomId = 1;
                const result = await getRequest(`/api/room_score/${roomId}`);
                const newPopularity = result; // 假设 API 返回全量人气值
                const increment = newPopularity - popularity;
                if (increment > 0) {
                    animatePopularityIncrease(increment); // 调用增量动画
                }
                setPopularity(newPopularity); // 更新为新的人气值
            } catch (error) {
                console.error('Error fetching popularity:', error);
            }
        };
        const interval = setInterval(fetchPopularity, 5000); // 每5秒获取一次人气全量
        return () => clearInterval(interval);
    }, [popularity]);

    const animatePopularityIncrease = (increment) => {
        if (increment <= 0) return;
        setIsAnimating2(true);
        const duration = 2000; // 动画总时长
        const steps = 20; // 分20步完成
        const amountPerStep = increment / steps;
        let currentIncrement = 0;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            currentIncrement += amountPerStep;
            setAnimatedPopularity(prev => prev + Math.floor(amountPerStep));

            if (step >= steps) {
                clearInterval(interval);
                setAnimatedPopularity(0); // 复位动画积分
                setIsAnimating2(false);
            }
        }, duration / steps);
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const handleGiftClick = () => {
        if (isAnimating) return; // 防止重复点击
        setIsAnimating(true);
        const randomIncrease = Math.floor(Math.random() * 91) + 10; // 随机增加10到100分
        let increment = 0;
        const duration = 1500;
        const interval = 100; // 每次增加的时间间隔
        const steps = duration / interval; // 计算增加的步数
        const amountPerStep = randomIncrease / steps; // 每步增加的积分

        let currentScore = score;
        const animationInterval = setInterval(() => {
            increment += amountPerStep;
            currentScore += amountPerStep;
            setAnimatedScore(Math.floor(currentScore));
            if (increment >= randomIncrease) {
                clearInterval(animationInterval);
                setScore(prevScore => prevScore + randomIncrease); // 最终增加随机数分
                setIsAnimating(false);
            }
        }, interval);
    };

    return (
        <div className="avatar-header">
            <div className="user-left">
                <div className="user-info">
                    <img src={user.avatar} alt="User Avatar" className="user-avatar" />
                    <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-id">@{user.id}</span>
                    </div>
                    <div className="like-icon">❤️</div>
                </div>
                <div className={`count-count ${isAnimating ? 'count-animating' : ''}`}>
                    <img className="countdown-timer-icon" src={countIcon} />
                    <div>{animatedScore || score}</div>
                </div>
            </div>
            <div className="wrap">
                <div className="countdown-timer">
                    <img className="countdown-timer-icon" src={time} />
                    <div>{formatTime(timeLeft)}</div>
                </div>

                <div className="audience-info">
                    {audienceAvatars.slice(0, 3).map((avatar, index) => (
                        <img key={index} src={avatar} alt="Audience Avatar" className="audience-avatar" />
                    ))}
                    <div className={`fire-count ${isAnimating2 ? 'count-animating' : ''}`}>
                        <img className="countdown-timer-icon" src={fireIcon} />
                        <div>{popularity + animatedPopularity}</div>
                    </div>
                </div>

                <div className="gift-wrap" onClick={handleGiftClick}>
                    <img src={giftIcon} className="gift-wrap-icon" />
                </div>
            </div>
        </div>
    );
}

export default AvatarHeader;
