import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Story from "../routes/Story";

export default function CheckIdBox() {
  const [storyId, setStoryId] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가

  useEffect(() => {
    const storedStoryId = localStorage.getItem("storyId");
    if (storedStoryId) {
      setStoryId(storedStoryId);
    }
    setAccessToken(localStorage.getItem('accessToken'));
  }, []);

  const fetchSave = (nextStoryId, accessToken) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      "nextStoryId" : nextStoryId
    });
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    return fetch(`http://3.37.164.99/api/story/save`, requestOptions) 
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error('스토리 불러오기 오류:', error);
        throw error;
      });
  };

  const handleContinue = () => {
    // 이전 handleContinue 코드 그대로 유지
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    fetch(`http://3.37.164.99/api/story/${storyId}`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        const res = data.data[0].story.formatId;

        if (res === 3) {
          window.location.href = "/code";
        }
        if (res === 2) {
          window.location.href = "/quiz";
        }
        if (res === 1) {
          window.location.href = "/main";
        }
      })
      .catch((error) => {
        console.error('스토리 불러오기 오류:', error);
        throw error;
      });
  };

  const handleStartNewGame = () => {
    if (storyId === "1") { // storyId가 1인 경우 /main 페이지로 이동
      window.location.href = "/main";
    } else {
      // storyId가 1이 아닌 경우 모달 표시
      setShowModal(true);
    }
  };

  const handleModalContinue = () => {
    // 모달에서 계속 버튼을 누르면 storyId를 1로 바꾸고 모달을 숨김
    setStoryId("1");
    setShowModal(false);
    fetchSave(1, accessToken);
    window.location.href = "/main";
  };

  const handleModalClose = () => {
    // 모달에서 닫기 버튼을 누르면 모달을 숨김
    setShowModal(false);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h3"
        color="#FFFFFF"
        fontSize="40px"
        fontWeight="400"
        fontFamily="D2Coding"
        textAlign="center"
      >
        Hello world!<br />Welcome to ‘AI-escape’
      </Typography>

      <div
        style={{
          display: "flex",
          flexDirection: "column", // 세로로 정렬
          alignItems: "flex-end", // 오른쪽 정렬
          width: "100%",
          marginTop: "20px", // 각 버튼 사이에 공백 추가
        }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{
            display: "block", // 버튼을 새로운 줄에서 시작하도록 설정
            marginBottom: "10px", // 각 버튼 사이의 아래쪽 여백 추가
            width: '60%',
            height: '93px',
            background: '#FF453A',
            borderTop: '5px solid #FF6860',
            borderLeft: '5px solid #FF6860'
          }}
          onClick={handleStartNewGame}
        >
          New Game
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            display: "block", // 버튼을 새로운 줄에서 시작하도록 설정
            marginBottom: "10px", // 각 버튼 사이의 아래쪽 여백 추가
            width: '60%',
            height: '93px',
            background: '#FF9F0A',
            borderTop: '5px solid #FFBB52',
            borderLeft: '5px solid #FFBB52'
          }}
          onClick={handleContinue}
        >
          Continue
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            display: "block", // 버튼을 새로운 줄에서 시작하도록 설정
            marginBottom: "10px", // 각 버튼 사이의 아래쪽 여백 추가
            width: '60%',
            height: '93px',
            background: '#FFD60A',
            borderTop: '5px solid #FFE044',
            borderLeft: '5px solid #FFE044'
          }}
        >
          Setting
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            display: "block", // 버튼을 새로운 줄에서 시작하도록 설정
            width: '60%',
            height: '93px',
            background: '#32D74B',
            borderTop: '5px solid #6AEE7E',
            borderLeft: '5px solid #6AEE7E'
          }}
        >
          About
        </Button>
      </div>

      {showModal && (
        // 모달 표시
        <div style={{
          background: '#FFF'
        }}className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            <p>진행 중이던 게임이 있습니다. 계속하시겠습니까?</p>
            <button onClick={handleModalContinue}>계속</button>
          </div>
        </div>
      )}
    </Box>
  );
}
