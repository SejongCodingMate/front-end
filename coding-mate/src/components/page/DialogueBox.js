import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "../../assets/animation/Shaking.css";
import "../../assets/animation/Zoom.css";
import "../../assets/animation/Blur.css";
import leftModalStyle from "../../assets/animation/LeftModalStyle";
import rightModalStyle from "../../assets/animation/RightModalStyle";
import { Container, Typography, Button, Switch, Fade } from "@mui/material";
import airobot from "../../assets/image/Character.png";
import React, { useState, useEffect, useRef } from "react";
import "../../assets/fonts/Font.css";

// 1. 스토리 갱신
const fetchStory = (storyId, accessToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return fetch(`http://3.37.164.99/api/story/${storyId}`, requestOptions)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("스토리 불러오기 오류:", error);
      throw error;
    });
};

// 2. 스토리 Save
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

export default function DialogueBox() {
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const [name, setName] = useState("");
  const [isImageVisible, setImageVisible] = useState(true);
  const [isShaking, setShaking] = useState(false);
  let [chImage, setChImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();


  // 1. 초기 랜더링
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const nextStoryId = localStorage.getItem("nextStoryId");

    setName(localStorage.getItem("name"));
    if (!token) {
      console.error("AccessToken이 없습니다.");
      return;
    }
    setAccessToken(token);

    fetchStory(nextStoryId, token)
      .then((data) => {
        const initialMessages = data.data.map((message) => ({
          formatId: message.story.formatId,
          speaker: message.speaker,
          text: message.text,
          currentStoryId: message.story.id,
          nextStoryId: message.story.nextId,
          screenEffect: message.screenEffect,
          soundEffect: message.soundEffect,
          characterImage: message.characterImage,
        }));
        console.log(initialMessages[0].characterImage);

        setMessages(initialMessages);

        localStorage.setItem(
          "characterImage",
          initialMessages[1].characterImage
        );

        setChImage(localStorage.getItem("characterImage"));
      })
      .catch((error) => {
        console.error("초기 스토리 불러오기 오류:", error);
      });
  }, []);

  // 2. 모달 오픈
  const openModal = () => {
    setModalOpen(true);
    setImageVisible(false);
    const nextStoryId = messages[messageIndex]?.nextStoryId + 1;
    fetchStory(nextStoryId, accessToken)
          .then((data) => {
            const res = data.data[0].story.formatId;
            if (res === 3 || res === 2) {
              openModal();
            }
            const newMessages = data.data.map((message) => ({
              speaker: message.speaker,
              text: message.text,
              currentStoryId: message.story.id,
              nextStoryId: message.story.nextId,
              formatId: message.story.formatId,
              screenEffect: message.screenEffect,
              soundEffect: message.soundEffect,
              characterImage: message.characterImage,
            }));
            setMessages([...messages, ...newMessages]);
          })
          .catch((error) => {
            console.error("다음 스토리 불러오기 오류:", error);
          });
  };

  // 3. 모달 닫힘
  const handleModalClick = () => {
    // 모달을 닫는 이벤트 처리
    setModalOpen(false);
    setImageVisible(true);
    setMessageIndex(messageIndex + 1);
  };

  // 5. NextMessage 핸들링
  const handleNextMessage = () => {
    // 1. 메세지 내용 출력
    if (messageIndex < messages.length - 1) {
      setMessageIndex(messageIndex + 1);
    }
    // 2. 만약 메세지가 다 출력이 되었다면
    else {
      // 2-1. 로컬스토리지 StoryID 갱신
      const currentStoryId = messages[messageIndex]?.currentStoryId;
      const nextStoryId = messages[messageIndex]?.nextStoryId;

      localStorage.setItem("nextStoryId", nextStoryId);

      if (currentStoryId && nextStoryId) {
        // 2-1. 스토리 저장 API
        fetchSave(nextStoryId, accessToken).then((data) => {
          var saveMessages = data.message;
          // saveMessages = "자동저장 되었습니다.";
          // window.alert(saveMessages);
        });

        if (localStorage.getItem("nextStoryId") == 0) {
          window.location.href = "/main";
        }

        // 2-2. 스토리 로드 API
        fetchStory(nextStoryId, accessToken)
          .then((data) => {
            const res = data.data[0].story.formatId;
            if (res === 3 || res === 2) {
              openModal();
            }
            const newMessages = data.data.map((message) => ({
              speaker: message.speaker,
              text: message.text,
              currentStoryId: message.story.id,
              nextStoryId: message.story.nextId,
              formatId: message.story.formatId,
              screenEffect: message.screenEffect,
              soundEffect: message.soundEffect,
              characterImage: message.characterImage,
            }));
            setMessages([...messages, ...newMessages]);
          })
          .catch((error) => {
            console.error("다음 스토리 불러오기 오류:", error);
          });
      }
    }
  };
  

  return (
    <div
      style={{
        background: "black",
        Height: "12 0vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        className={`shake ${isShaking ? "animate" : ""}`}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          animation: isShaking ? "shake 3s ease" : "none",
          width: "100%",
          height: "100%",
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{
              height: "100vh",
              backgroundColor: "black",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {messages.length > 0 ? (
              <img
                src={messages[messageIndex].characterImage}
                alt="Character Image"
                style={{
                  width: "300px",
                  height: "300px",
                  marginTop: "2%",
                  marginBottom: "5%",
                  opacity: isImageVisible ? 1 : 0.3,
                  transition: "opacity 2s",
                }}
              />
            ) : null}

            {modalOpen && (
              <div
                className="modal-container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  zIndex: 9998,
                }}
                onClick={handleModalClick}
              >
                {/* 왼쪽 모달 */}
                <div
                  className="modal left"
                  style = {leftModalStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)"; // 호버 시 확대 효과
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"; // 호버 종료 시 본래 크기로 복귀
                  }}
                >
                  <div className="modal-content">
                    <h1>도와준다</h1>
                  </div>
                </div>
                {/* 오른쪽 모달 */}
                <div
                  className="modal right"
                  style = {rightModalStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)"; // 호버 시 확대 효과
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"; // 호버 종료 시 본래 크기로 복귀
                  }}
                >
                  <div className="modal-content">
                    <h1>무시한다</h1>
                  </div>
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div
                style={{
                  opacity: isImageVisible ? 1 : 0.3, 
                  transition: "opacity 2s",
                  width: "100%",
                  height: "20%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  position: "fixed" /* 요소를 고정시킴 */,
                  bottom: 0 /* 하단에 고정 */,
                  background: `
                  linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.12) 100%, #000 89.06%), 
                  rgba(102, 102, 102, 0.3), 
                `,
                }}
              >
                <Typography
                  variant="h3"
                  style={{
                    textAlign: "center",
                    color:
                      messages[messageIndex].speaker === "AI"
                        ? "white"
                        : "#0A84FF",
                    fontSize: "32px",
                    fontFamily: "LINE Seed Sans KR",
                    marginTop: "1%",
                  }}
                >
                  {messages[messageIndex].speaker === "AI" ? "AI" : name}
                </Typography>
                <Typography
                  variant="h4"
                  style={{
                    textAlign: "center",
                    color:
                      messages[messageIndex].speaker === "AI"
                        ? "white"
                        : "white",
                    transform:
                      messages[messageIndex].speaker === "AI"
                        ? "skewX(-20deg)"
                        : "skewX(0deg)",
                    marginTop: "2%",
                    fontSize: "20px",
                    fontFamily: "LINE Seed Sans KR",
                  }}
                >
                  {messages[messageIndex].text}
                </Typography>
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "60px",
                  }}
                >
                  <Button
                    color="primary"
                    type="submit"
                    variant="outlined"
                    onClick={handleNextMessage}
                    style={{ backgroundColor: "black", color: "#34C759" }}
                  >
                    Next
                  </Button>
                </Grid>
              </div>
            )}

          </Grid>
        </Container>
      </Box>
    </div>
  );
}
