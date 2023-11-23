import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "../../assets/animation/Shaking.css";
import "../../assets/animation/Zoom.css";
import "../../assets/animation/Blur.css";
import back from "../../assets/image/backButton.png";
import nextButton from "../../assets/image/next.png";
import { Container, Typography, Button, Switch, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
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

// 3. 챕터 Save
const fetchChapterSave = (nextChapterId, accessToken) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    nextChapterId: nextChapterId,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(`http://3.37.164.99/api/chapter/save`, requestOptions)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("챕터 불러오기 오류:", error);
      throw error;
    });
};

export default function ItemBox() {
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(1);
  const [accessToken, setAccessToken] = useState(null);
  const [name, setName] = useState("");
  const [isCharacterImageVisible, setCharacterImageVisible] = useState(false);
  const [isItemImageVisible, setItemImageVisible] = useState(false);
  const [isShaking, setShaking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isAnimating, setAnimating] = useState(false);
  const [itemImage, setItemImage] = useState([]);
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate("/main");
  };

  function splitText(text) {
    return text.split("");
  }

  function showTextSequentially(text, setText, interval, callback) {
    const characters = splitText(text);
    let currentIndex = 0;
    let currentText = "";

    function showNextCharacter() {
      if (currentIndex < characters.length) {
        currentText += characters[currentIndex];
        setText(currentText);
        currentIndex++;
        setTimeout(showNextCharacter, interval);
      } else {
        if (typeof callback === "function") {
          callback();
        }
      }
    }

    showNextCharacter();
  }

  useEffect(() => {
    if (messages[messageIndex]) {
      setMessage("");
      setAnimating(true);
      showTextSequentially(messages[messageIndex].text, setMessage, 35, () => {
        setAnimating(false);
      });
    }
  }, [messageIndex]);

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
          backgroundImage: message.story.backgroundImage,
        }));
        console.log(initialMessages[0].characterImage);
        setMessages(initialMessages);
        showPicture();
        setItemImage(initialMessages[0].text);
      })
      .catch((error) => {
        console.error("초기 스토리 불러오기 오류:", error);
      });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setItemImageVisible(true);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  // 4. 아이템 등장
  const showPicture = () => {
    const audio = new Audio("/sawSound.wav");
    audio.play();
    setModalOpen(false);
    setCharacterImageVisible(true);
  };

  // 5. NextMessage 핸들링
  const handleNextMessage = () => {
    const audio = new Audio("/NextButton2.wav");
    audio.play();

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
          const userChapterId = localStorage.getItem("chapterId");
          localStorage.setItem("chapterId", parseInt(userChapterId) + 1);
          const renewalChapterId = localStorage.getItem("chapterId");
          fetchChapterSave(renewalChapterId, accessToken);
          window.location.href = "/main";
        }

        // 2-2. 스토리 로드 API
        fetchStory(nextStoryId, accessToken)
          .then((data) => {
            const res = data.data[0].story.formatId;
            if (res === 3) {
              showPicture();
            }
            if (res === 1 || res === 2) {
              window.location.href = "/dialogue";
            }
            if (res === 6) {
              window.location.href = "/mission";
            }
            const newMessages = data.data.map((message) => ({
              speaker: message.speaker,
              text: message.text,
              currentStoryId: message.story.id,
              nextStoryId: message.story.nextId,
              formatId: message.story.formatId,
              screenEffect: message.screenEffect,
              soundEffect: message.soundEffect,
              backgroundImage: message.story.backgroundImage,
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
    <div>
      {messages.length > 0 ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <button
            onClick={handleBackButtonClick}
            style={{
              position: "absolute",
              width: "86px",
              height: "69px",
              top: "20px",
              left: -6,
              backgroundColor: "transparent",
              color: "#FFF",
              border: "none",
              cursor: "pointer",
              zIndex: 999,
            }}
          >
            <img
              style={{
                width: "100%",
                height: "90%",
              }}
              src={back}
              alt="뒤로 가기"
            />
          </button>

          <Box
            className={`shake ${isShaking ? "animate" : ""}`}
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 백그라운드 이미지를 맨 뒤로 보내기 위해 zIndex를 설정합니다. */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundImage: `url(${messages[messageIndex].backgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                filter: "brightness(70%)", // 배경 이미지에 흐림 처리 및 어둡게 설정
                zIndex: "-1",
              }}
            ></div>

            <Container maxWidth="xl">
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {messages.length > 0 && (
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                    }}
                  >
                    <img
                      src={messages[messageIndex].characterImage}
                      alt="Character Image"
                      style={{
                        width: "500px",
                        height: "900px",
                        marginTop: "20%",
                        marginBottom: "5%",
                        opacity: 0.7,
                        transition: "opacity 2s",
                      }}
                    />

                    <img
                      src={itemImage}
                      alt="Item Image"
                      style={{
                        width: "550px",
                        height: "300px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        opacity: isItemImageVisible ? 1 : 0.3,
                        transition: "opacity 1s",
                      }}
                    />
                  </div>
                )}

                {messages.length > 0 && (
                  <div
                    style={{
                      opacity: 1,
                      width: "100%",
                      height: "45%",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      position: "fixed" /* 요소를 고정시킴 */,
                      bottom: 0 /* 하단에 고정 */,
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.3) 15%, rgba(0, 0, 0, 0.6) 40%, #000 100%)", // 대사창 그라데이션
                    }}
                  >
                    <Typography
                      variant="h3"
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: "40px",
                        fontFamily: "LINE Seed Sans KR",
                        fontWeight: "bold",
                        marginTop: "10%", // 대사 위치
                      }}
                    >
                      {messages[messageIndex].speaker}
                    </Typography>
                    <Typography
                      variant="h4"
                      style={{
                        textAlign: "center",
                        color: "white",
                        transform:
                          messages[messageIndex].speaker === "AI"
                            ? "skewX(-20deg)"
                            : "skewX(0deg)",
                        marginTop: "3%",
                        fontSize: "30px",
                        fontFamily: "LINE Seed Sans KR",
                      }}
                    >
                      {isAnimating
                        ? message.replace(/undefined/g, "").replace(/\*/g, "")
                        : messages[messageIndex].text
                            .split("*")
                            .map((part, index) => {
                              if (index % 2 === 0) {
                                return part;
                              } else {
                                return (
                                  <span
                                    key={index}
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "30px",
                                    }}
                                  >
                                    {part}
                                  </span>
                                );
                              }
                            })}
                    </Typography>
                    <Grid
                      container
                      justifyContent="flex-end"
                      style={{
                        position: "fixed",
                        bottom: "50px",
                        right: "100px",
                      }}
                    >
                      <Button
                        color="primary"
                        type="submit"
                        variant="outlined"
                        onClick={handleNextMessage}
                        style={{
                          backgroundImage: `url(${nextButton})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          width: "100px",
                          height: "50px",
                          border: "none",
                          transition: "transform 0.3s ease", // transform 속성을 통해 크기 변경을 부드럽게 만듭니다
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.filter = "brightness(1.05)"; // 밝기 증가
                          e.target.style.transform = "scale(1.05)"; // 크기 확대
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.filter = "brightness(1)"; // 밝기 복원
                          e.target.style.transform = "scale(1)"; // 크기 복원
                        }}
                      ></Button>
                    </Grid>
                  </div>
                )}
              </Grid>
            </Container>
          </Box>
        </div>
      ) : null}
    </div>
  );
}
