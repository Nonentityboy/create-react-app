import * as faceapi from 'face-api.js';
import React from 'react';

function App() {
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('home');
  const videoRef = React.useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = React.useRef();

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        // 绘制人脸检测框和其他元素
        // faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

        // 遍历每个检测框，绘制文字到人脸正上方

        resizedDetections.forEach(detection => {
          const { x, y, width } = detection.detection.box;

          // 在每个人脸的上方 10 像素处绘制文字
          ctx.font = "20px Arial";
          ctx.fillStyle = "red";
          ctx.textAlign = "center"; // 让文字在X轴居中
          ctx.fillText("我要当网红！！！！", x + width / 2, y - 10); // y - 10 保证文字在框的上方
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
    <div>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        {captureVideo && modelsLoaded ? (
          <button onClick={closeWebcam} style={buttonStyle}>Close Webcam</button>
        ) : (
          <button onClick={startVideo} style={buttonStyle}>Open Webcam</button>
        )}
      </div>
      {captureVideo && modelsLoaded && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', position: 'relative' }}>
          <video ref={videoRef} height={videoHeight} width={videoWidth} playsInline controls={false} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
          <canvas ref={canvasRef} style={{ position: 'absolute' }} />
        </div>
      )}
      {/* 显示直播链接内容 */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {activeTab === 'live' && (
          <div>
            <h2>直播链接示例</h2>
            <a href="https://example.com/live" target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
              观看直播
            </a>
          </div>
        )}
      </div>
      {/* 底部导航 */}
      <div style={tabContainerStyle}>
        {['home', 'live', 'profile'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...tabStyle,
              color: activeTab === tab ? '#fff' : '#888',
              backgroundColor: activeTab === tab ? 'blue' : '#f0f0f0',
            }}
          >
            {tab === 'home' ? '首页' : tab === 'live' ? '直播' : '我的'}
          </button>
        ))}
      </div>
    </div>
  );
}

const buttonStyle = {
  cursor: 'pointer',
  backgroundColor: 'green',
  color: 'white',
  padding: '15px',
  fontSize: '25px',
  border: 'none',
  borderRadius: '10px'
};

const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '10px 0',
  borderTop: '1px solid #ddd',
  position: 'fixed',
  bottom: '0',
  width: '100%',
  backgroundColor: 'blue',
  boxShadow: '0 -1px 5px rgba(0,0,0,0.1)'
};

const tabStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '18px',
  border: 'none',
  background: 'none'
};

export default App;
