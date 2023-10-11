import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Story from "../routes/Story";

export default function CheckIdBox() {
    const [storyId, setStoryId] = useState('')
    const [accessToken, setAccessToken] = useState(null);
    const handleNewGame = () => {
        localStorage.getItem('storyId');
        if (localStorage.getItem('storyId') != 1) {
            
        };
    }
    useEffect(() => {
        // 컴포넌트가 마운트될 때 localStorage에서 memberId 값을 읽어옵니다.
        const storedStoryId = localStorage.getItem("storyId");
        if (storedStoryId) {
          setStoryId(storedStoryId);
        }
        setAccessToken(localStorage.getItem('accessToken'));
      }, []);

    const handleContinue = () => {
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        };
        
        fetch(`http://3.37.164.99/api/story/${storyId}`, requestOptions)
        .then(response => response.json())  
        .then((data) => {
            console.log(data);
            const res = data.data[0].story.formatId;
            console.log(res);

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

      {/* 버튼 그룹 추가 */}
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
    </Box>
  );
}
