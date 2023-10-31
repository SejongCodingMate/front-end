import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Story from "../../routes/page/Story";
import "../../assets/fonts/Font.css";

export default function LandingBox() {
  const [storyId, setStoryId] = useState("");
  const [nextStoryId, setNextStoryId] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가

  useEffect(() => {
    const storedStoryId = localStorage.getItem("nextStoryId");
    if (storedStoryId) {
      setNextStoryId(storedStoryId);
    }
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  const fetchSave = (nextStoryId, accessToken) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      nextStoryId: nextStoryId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch(`http://3.37.164.99/api/story/save`, requestOptions)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error("스토리 불러오기 오류:", error);
        throw error;
      });
  };

  const handleContinue = () => {
    // 이전 handleContinue 코드 그대로 유지
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch(`http://3.37.164.99/api/story/${nextStoryId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const res = data.data[0].story.formatId;
        console.log(res);
        if (res === 4) {
          window.location.href = "/problem";
        }
        if (res === 3) {
          window.location.href = "/code";
        }
        if (res === 2) {
          window.location.href = "/quiz";
        }
        if (res === 1) {
          window.location.href = "/dialogue";
        }
      })
      .catch((error) => {
        console.error("스토리 불러오기 오류:", error);
        throw error;
      });
  };

  const handleStartNewGame = () => {
    if (storyId === "1") {
      // storyId가 1인 경우 /main 페이지로 이동
      window.location.href = "/dialog";
    } else {
      // storyId가 1이 아닌 경우 모달 표시
      setShowModal(true);
    }
  };

  const handleModalContinue = () => {
    // 모달에서 계속 버튼을 누르면 nextStoryId를 1로 바꾸고 모달을 숨김
    localStorage.setItem("nextStoryId", 1);
    setShowModal(false);
    fetchSave(1, accessToken);
    window.location.href = "/dialog";
  };

  const handleModalClose = () => {
    // 모달에서 닫기 버튼을 누르면 모달을 숨김
    setShowModal(false);
  };

  const modalWidth = "40vw"; // 모달 창의 너비
  const left = `calc(50% - ${modalWidth / 2})`; // 화면 중앙에 위치

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
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 20, // 모달을 상단에 위치
            left,
            width: modalWidth,
            height: "100vh",
            zIndex: 9999, // 모달을 다른 요소들 위에 표시
          }}
          className="modal"
        >
          <div
            className="modal-content"
            style={{
              background: "#FFF",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column", // 내부 요소를 수직으로 정렬
              justifyContent: "center", // 내부 요소를 수직으로 가운데 정렬
              alignItems: "center",
            }}
          >
            <p>진행 중이던 게임이 있습니다. 계속하시겠습니까?</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={handleModalClose}
                style={{
                  color: "#000",
                  whiteSpace: "nowrap",
                  background: "#EEE",
                  color: "#FFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  margin: "1%",
                }}
              >
                닫기
              </button>
              <button
                onClick={handleModalContinue}
                style={{
                  whiteSpace: "nowrap",
                  background: "#0A84FF",
                  color: "#FFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  margin: "1%",
                }}
              >
                계속
              </button>
            </div>
          </div>
        </div>
      )}
      <Typography
        variant="h3"
        color="#FFFFFF"
        fontSize="40px"
        fontWeight="400"
        fontFamily="D2Coding"
        textAlign="center"
        marginTop="5%"
      >
        Hello world!
        <br />
        Welcome to ‘AI-escape’
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
            width: "60%",
            height: "93px",
            background: "#FF453A",
            borderTop: "5px solid #FF6860",
            borderLeft: "5px solid #FF6860",
            color: "#5A0000",
            fontSize: "60px",
            fontWeight: 700,
            fontFamily: "D2Coding",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          onClick={handleStartNewGame}
        >
          <div style={{ marginLeft: "8%" }}>New Game</div>
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            display: "block", // 버튼을 새로운 줄에서 시작하도록 설정
            marginBottom: "10px", // 각 버튼 사이의 아래책 여백 추가
            width: "60%",
            height: "93px",
            background: "#FF9F0A",
            borderTop: "5px solid #FFBB52",
            borderLeft: "5px solid #FFBB52",
            color: "#613F0A",
            fontSize: "60px",
            fontWeight: 700,
            fontFamily: "D2Coding",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          onClick={handleContinue}
        >
          <div style={{ marginLeft: "8%" }}>CONTINUE</div>
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            display: "block", // 버튼을 새로운 줄에서 시작하도록 설정
            marginBottom: "10px", // 각 버튼 사이의 아래쪽 여백 추가
            width: "60%",
            height: "93px",
            background: "#FFD60A",
            borderTop: "5px solid #FFE044",
            borderLeft: "5px solid #FFE044",
            color: "#493D00",
            fontSize: "60px",
            fontWeight: 700,
            fontFamily: "D2Coding",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <div style={{ marginLeft: "8%" }}>Setting</div>
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            display: "block", // 버튼을 새로운 줄에서 시작하도록 설정
            width: "60%",
            height: "93px",
            background: "#32D74B",
            borderTop: "5px solid #6AEE7E",
            borderLeft: "5px solid #6AEE7E",
            color: "#1D6127",
            fontSize: "60px",
            fontWeight: 700,
            fontFamily: "D2Coding",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <div style={{ marginLeft: "8%" }}>About</div>
        </Button>
      </div>
    </Box>
  );
}
