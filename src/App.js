import React, { useState, useEffect } from 'react';
import { Badge, TabBar } from 'antd-mobile';
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import FaceDetectionVideo from './components/FaceDetectionVideo'; // 导入视频组件

function App() {
  const [activeKey, setActiveKey] = useState('home');
  const [messages, setMessages] = useState([]);

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
    const randomMessages = ["大家好！", "直播开始啦！", "保持微笑 😊", "欢迎光临～"];
    const emojis = ["😊", "😂", "😎", "👍", "🎉"];
    return {
      id: Date.now(),
      name: "AI-Agent",
      text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };
  };

  const addMessage = () => {
    const newMessage = generateRandomMessage();
    setMessages(prev => [...prev, newMessage]);

    // 自动删除消息
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 5000);

  };

  return (
    <div>
      <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <TabBar activeKey={activeKey} onChange={setActiveKey}>
          {tabs.map(tab => (
            <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} badge={tab.badge} />
          ))}
        </TabBar>
      </div>
      {activeKey === 'home' && <FaceDetectionVideo messages={messages} addMessage={addMessage} />}
    </div>
  );
}

export default App;
