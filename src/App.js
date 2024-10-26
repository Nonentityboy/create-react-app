import React, { useState, useEffect } from 'react';
import { Badge, TabBar } from 'antd-mobile';
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import FaceDetectionVideo from './components/FaceDetectionVideo'; // 导入视频组件
import { getRequest } from './api';

function App() {
  const [activeKey, setActiveKey] = useState('home');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 每隔 5 秒轮询获取评论
    const fetchComments = async () => {

      try {
        let roomId = 1;
        const result = await getRequest(`/api/room_comments/${roomId}`);

        const resResults = result.map(item => {
          return {
            id: `${item.agent_id}_${Math.random().toString(36).substr(2, 9)}`, // 生成随机ID
            name: item.agent_name,
            text: item.text
          }
        });
        setMessages((prevMessages) => [...prevMessages, ...resResults]);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    const interval1 = setInterval(fetchComments, 5000);
    return () => {
      clearInterval(interval1)
    };
  }, []);

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

  // const generateRandomMessage = () => {
  //   const randomMessages = ["大家好！", "直播开始啦！", "保持微笑 😊", "欢迎光临～"];
  //   const emojis = ["😊", "😂", "😎", "👍", "🎉"];
  //   return {
  //     id: Date.now(),
  //     name: "AI-Agent",
  //     text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
  //     emoji: emojis[Math.floor(Math.random() * emojis.length)],
  //   };
  // };

  // const addMessage = () => {
  //   const newMessage = generateRandomMessage();
  //   setMessages(prev => [...prev, newMessage]);

  //   // 自动删除消息
  //   setTimeout(() => {
  //     setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
  //   }, 5000);

  // };

  return (
    <div>
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
