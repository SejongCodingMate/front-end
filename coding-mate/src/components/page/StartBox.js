import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../../assets/fonts/Font.css";

export default function StartBox() {
  const navigate = useNavigate();

  const chapterButtons = [
    {
      position: "chapter1",
      label: "Chapter 1",
      chapterId: 1,
      imgPosition: { top: "50%", left: "14.5%" },
    },
    {
      position: "chapter2",
      label: "Chapter 2",
      chapterId: 2,
      imgPosition: { top: "40%", left: "42%" },
    },
  ];

  useEffect(() => {
    // window.onload 이벤트 리스너 등록
    const audio = new Audio("/backgroundMusic.mp3");
    audio.volume = 0.2;
    audio.play();
  }, []);

  const handleGameStartClick = () => {
    const audio = new Audio("/NextButton2.wav");
    audio.play();
    window.location.href = "/main";
  };

  const handleSettingsClick = () => {
    const audio = new Audio("/NextButton2.wav");
    audio.play();
  };

  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <img
        src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/background/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B0%B0%EA%B2%BD_%ED%99%94%EC%A7%88%EC%97%85.png"
        alt="Map Background"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          filter: "blur(10px) brightness(70%)", // 배경을 약간 흐림 처리하고 어둡게 설정
        }}
      />
      <div
        style={{
          display: "flex", // 열 정렬을 위해 flex 사용
          flexDirection: "column", // 열로 정렬
          alignItems: "center", // 수평 가운데 정렬
          justifyContent: "center", // 수직 가운데 정렬
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          textAlign: "center",
          zIndex: "1",
        }}
      >
        {/* 게임 제목 이미지 */}
        <img
          src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/background/%E1%84%86%E1%85%A1%E1%84%87%E1%85%A5%E1%86%B8%E1%84%89%E1%85%A1+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%B3%E1%84%8B%E1%85%AA+%E1%84%8F%E1%85%A9%E1%84%83%E1%85%B5%E1%86%BC+%E1%84%8B%E1%85%A7%E1%84%92%E1%85%A2%E1%86%BC.png" // 게임 제목 이미지 파일 경로를 설정해야 합니다.
          alt="Game Title"
          style={{
            width: "40%", // 이미지의 너비를 전체 페이지의 50%로 설정
            height: "auto", // 높이를 자동으로 조절하여 가로 세로 비율 유지
            marginBottom: "60px", // 제목과 버튼 사이에 마진 추가
          }}
        />

        {/* 게임 시작 이미지 */}
        <img
          src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/button/Group+91.png" // 시작 이미지 파일 경로를 설정해야 합니다.
          alt="Start"
          style={{
            width: "450px", // 이미지의 너비를 키움
            height: "auto", // 높이를 자동으로 조절하여 가로 세로 비율 유지
            cursor: "pointer", // 호버 효과를 위한 커서 스타일 설정
            transition: "transform 0.2s", // 호버 효과에 애니메이션 추가
          }}
          onClick={handleGameStartClick} // 이미지를 클릭했을 때 이벤트 핸들러 연결
          onMouseEnter={(e) => {
            // 마우스가 요소에 진입했을 때 실행될 함수
            e.target.style.transform = "scale(1.05)"; // 이미지 크기를 확대
          }}
          onMouseLeave={(e) => {
            // 마우스가 요소에서 나갔을 때 실행될 함수
            e.target.style.transform = "scale(1)"; // 이미지 크기를 원래대로 복원
          }}
        />
        {/* 설정 이미지 */}
        <img
          src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/button/Group+92.png" // 설정 이미지 파일 경로를 설정해야 합니다.
          alt="Settings"
          style={{
            width: "450px", // 이미지의 너비를 키움
            height: "auto", // 높이를 자동으로 조절하여 가로 세로 비율 유지
            cursor: "pointer", // 호버 효과를 위한 커서 스타일 설정
            marginTop: "20px", // 설정 이미지 위에 마진 추가
          }}
          onClick={handleSettingsClick} // 이미지를 클릭했을 때 이벤트 핸들러 연결
          onMouseEnter={(e) => {
            // 마우스가 요소에 진입했을 때 실행될 함수
            e.target.style.transform = "scale(1.05)"; // 이미지 크기를 확대
          }}
          onMouseLeave={(e) => {
            // 마우스가 요소에서 나갔을 때 실행될 함수
            e.target.style.transform = "scale(1)"; // 이미지 크기를 원래대로 복원
          }}
        />
      </div>
    </Box>
  );
}
