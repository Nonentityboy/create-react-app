import React, { useState, useEffect } from 'react';
import { Badge, TabBar } from 'antd-mobile';
import { useSnapshot } from 'valtio';
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import FaceDetectionVideo from './components/FaceDetectionVideo'; // 导入视频组件
import TranscriptDisplay from './components/TranscriptDisplay'; // 导入视频组件
import { contextService } from './store/register';
import { postRequest } from './api';

function App() {
  const [activeKey, setActiveKey] = useState('home');
  const [messages, setMessages] = useState([]);
  const { transcript } = useSnapshot(contextService.state);

  console.log({transcript}, 'app')

  const fetchComments = async () => {
    try {
      let roomId = 1;
      // 调用后端接口获取结果
      const result = await postRequest(`/api/py/chat`, {
        user_info: {
          age: 30,
          gender: 'male',
          dominant_expression: 'happy',
          transcript,
        },
      });

      // 将返回的结果映射到前端需要的格式
      const resResults = result.responses.map((item) => ({
        id: `${item.agent_name}_${Math.random().toString(36).substr(2, 9)}`, // 生成随机ID
        name: item.agent_name,
        text: item.response,
      }));

      // 对每条消息，随机延迟 1-5 秒后添加到页面中
      resResults.forEach((message) => {
        const randomDelay = Math.floor(Math.random() * 4000) + 1000; // 生成 1-5 秒的随机延迟

        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, message]);
        }, randomDelay);
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // 定时调用 fetchComments，每 10 秒获取一次新评论
  useEffect(() => {
    const interval1 = setInterval(fetchComments, 15000);

    return () => {
      clearInterval(interval1);
    };
  }, [transcript]); // 如果 transcript 变化，也会重新触发

  const tabs = [
    {
      key: 'home',
      title: '直播',
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: 'todo',
      title: '待办',
      icon: <UnorderedListOutline />,
      badge: '5',
    },
    {
      key: 'message',
      title: '消息',
      icon: (active) => (active ? <MessageFill /> : <MessageOutline />),
      badge: '99+',
    },
    {
      key: 'personalCenter',
      title: '我的',
      icon: <UserOutline />,
    },
  ];

  const generateRandomMessage = () => {
    const randomMessages = [
      "主播有点帅",
      "直播开始啦！",
      "保持微笑 😊",
      "欢迎光临～",
      "主播今天真好看！",
      "这是要带货了是吧",
      "哈哈哈哈好好笑～"
    ];
    const emojis = ["😊", "😂", "😎", "👍", "🎉", "💪", "🔥", "✨", "🥳", "🌟"];
    const includeEmoji = Math.random() < 0.2; // 20% 概率有 emoji
    return {
      id: Date.now() + Math.random(), // 确保唯一 ID
      name: `水军${Math.floor(Math.random() * 1000)}`, // 随机水军名称
      text: `${randomMessages[Math.floor(Math.random() * randomMessages.length)]}${
        includeEmoji ? ` ${emojis[Math.floor(Math.random() * emojis.length)]}` : ""
      }`, // 根据随机数是否添加 emoji
    };
  };

  const addMessage = () => {
    const newMessage = generateRandomMessage();
    setMessages((prev) => [...prev, newMessage]);
  };

  // 水军逻辑：定时生成水军消息
  useEffect(() => {
    const interval = setInterval(() => {
      const randomDelay = Math.floor(Math.random() * 4000) + 1000; // 随机延迟 1-5 秒
      setTimeout(() => {
        addMessage(); // 在随机时间后插入水军消息
      }, randomDelay);
    }, 3000); // 每隔 3 秒生成一个水军消息

    return () => clearInterval(interval); // 清理定时器
  }, []);

  return (
    <div>
      <TranscriptDisplay />
      <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <TabBar activeKey={activeKey} onChange={setActiveKey}>
          {tabs.map(tab => (
            <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} badge={tab.badge} />
          ))}
        </TabBar>
      </div>
      {activeKey === 'home' && <FaceDetectionVideo messages={messages} />}
      {
        activeKey !== 'home' && (
          <div style={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}>
            {activeKey === 'todo' && (
              <img src="https://s21.ax1x.com/2024/10/26/pA0ksyD.jpg" alt="待办" style={{ width: '100%', height: 'auto' }} />
            )}
            {activeKey === 'message' && (
              <img src="https://s21.ax1x.com/2024/10/26/pA0kyOe.jpg" alt="消息" style={{ width: '100%', height: 'auto' }} />
            )}
            {activeKey === 'personalCenter' && (
              <img src="https://s21.ax1x.com/2024/10/26/pA0k5Sf.jpg" alt="我的" style={{ width: '100%', height: 'auto' }} />
            )}
          </div>
        )
      }
    </div>
  );
}

export default App;
