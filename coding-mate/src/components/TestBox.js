import React, { useRef, useEffect, useState } from 'react';

function TestBox() {
    const canvasRef = useRef(null);
    const [x, setX] = useState(0);
  const [y, setY] = useState(0);
    const imageSrc = 'https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/chapter/2.png'; // 이미지 경로
    const imageWidth = 500; // 이미지 너비
    const imageHeight = 500; // 이미지 높이
    const targetX = 800; // 목표 x 좌표
    const targetY = 600; // 목표 y 좌표

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    const moveImage = () => {
      // 캔버스를 클리어
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 현재 위치에서 목표 위치로 이동
      if (x < targetX) {
        setX(x + 2); // x 좌표를 증가시켜 이동
      }
      if (y < targetY) {
        setY(y + 2); // y 좌표를 증가시켜 이동
      }
      
      // 그림을 새로운 위치에 그림
      ctx.drawImage(image, x, y, imageWidth, imageHeight);
      
      // 목표 위치에 도달하면 애니메이션 종료
      if (x < targetX || y < targetY) {
        requestAnimationFrame(moveImage);
      }
    };

    image.onload = () => {
      moveImage(); // 페이지 로딩 시 애니메이션 시작
    };
  }, [x, y]);

    
      return (
        <div style={{ width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          </div>
      );
  }
  
  export default TestBox;





