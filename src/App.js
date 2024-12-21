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
  const {
    transcript,
    age,
    gender,
    dominantExpression
   } = useSnapshot(contextService.state);

  console.log({transcript}, 'app')

  const fetchComments = async () => {
    try {
      let roomId = 1;
      // 调用后端接口获取结果
      const result = await postRequest(`/api/py/chat`, {
        user_info: {
          age,
          gender,
          dominant_expression: dominantExpression,
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
  },[
    transcript,
    age,
    gender,
    dominantExpression
  ]); // 如果 transcript 变化，也会重新触发

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
    // 评论内容数组
    const randomMessages = [
      "昨天看见你播了",
      "没错 我小时候看的也是这个",
      "真年轻",
      "是学生吗",
      "妹妹好看",
      "哥哥真帅",
      "晚上好",
      "身材杠杠的",
      "好美~",
      "66666666",
      "好听",
      "加油",
      "👌👌👌👌",
      "🙌",
      "👍👍👍👍",
      "💕💕💕💕💕",
      "❤️❤️❤️❤️",
      "😍😍😍😍",
      "🎶🎶🎶",
      "😎😎😎",
      "🐂🍺",
      "😂😂😂😂😂",
      "🌷🌷🌷🌷",
      "必须破万",
      "衣服多少米",
      "在哪买的",
      "这是我老婆",
      "速速出道了",
      "太帅了",
      "爱了爱了",
      "111",
      "1",
      "可以了",
      "55555",
      "77777",
      "神似吴彦祖",
      "快来人啊",
      "有天赋",
      "跟原唱差不多",
      "高手在民间",
      "这在哪里",
      "主播真漂亮",
    ];

    // 水军名称数组
    const agents = [
      "夏岚",
      "泡芙",
      "西窗过雨",
      "繁華、落盡",
      "怕安静",
      "炙雪🥤",
      "🍭忆过往恍如梦",
      "不谙世事",
      "清素笔调",
      "多余🥤温情",
      "努力是为将来铺路",
      "秋水伊人",
      "安於宿命",
      "🌈高冷潜质在发光🌈",
      "怜我孤寂",
      "流光若逝",
      "长青诗🥤",
      "梦想海",
      "靖柏🌈",
      "残笑丶何相忘",
      "一片空白👑",
      "只此热忱",
      "风起意阑珊",
      "г顶级罪人",
      "青春染上年華",
      "难耐一身闲",
      "后来只有后果",
      "🥤温柔终究扑空",
    ];

    // 表情符号数组
    const emojis = ["😊", "😂", "😎", "👍", "🎉", "💪", "🔥", "✨", "🥳", "🌟"];

    // 20% 概率添加 emoji
    const includeEmoji = Math.random() < 0.2;

    return {
      id: Date.now() + Math.random(), // 确保唯一 ID
      name: agents[Math.floor(Math.random() * agents.length)], // 随机选择水军名称
      text: `${randomMessages[Math.floor(Math.random() * randomMessages.length)]}${
        includeEmoji ? ` ${emojis[Math.floor(Math.random() * emojis.length)]}` : ""
      }`, // 随机选择评论内容并决定是否添加 emoji
    };
  };


  const addMessage = () => {
    const newMessage = generateRandomMessage();
    setMessages((prev) => [...prev, newMessage]);
  };

  // 水军逻辑：定时生成水军消息
useEffect(() => {
  // 初始延迟 10 秒后启动水军逻辑
  const startWaterArmy = setTimeout(() => {
    const interval = setInterval(() => {
      const randomDelay = Math.floor(Math.random() * 4000) + 1000; // 随机延迟 1-5 秒
      setTimeout(() => {
        addMessage(); // 在随机时间后插入水军消息
      }, randomDelay);
    }, 3000); // 每隔 3 秒生成一个水军消息

    // 清理定时器
    return () => clearInterval(interval);
  }, 10000); // 延迟 10 秒后启动水军逻辑

  // 清理初始延迟定时器
  return () => clearTimeout(startWaterArmy);
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
