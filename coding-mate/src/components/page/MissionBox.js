import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "../../assets/animation/Shaking.css";
import "../../assets/animation/Zoom.css";
import "../../assets/animation/Blur.css";
import back from "../../assets/image/back.png";
import codemirrorBackground from "../../assets/image/code_background.png";
import { Container, Paper, Typography, Button, Switch, Fade, Input, TextField } from "@mui/material";
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
  const [message, setMessage] = useState("");
  const [isAnimating, setAnimating] = useState(false);
  const navigate = useNavigate();

  // 1. 뒤로가기
  const handleBackButtonClick = () => {
    navigate("/main");
  };

  // 2. 글자 스플릿하는 함수
  function splitText(text) {
    return text.split("");
  }

  // 3. 대사 애니메이션
  function showTextSequentially(text, setText, interval, callback) {
    const characters = splitText(text);
    let currentIndex = -1;

    function showNextCharacter() {
      if (currentIndex < characters.length) {
        setText((prevText) => prevText + characters[currentIndex]);
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

  // 4. 애니메이션 UseEFfect
  useEffect(() => {
    if (messages[messageIndex]) {
      setMessage("");
      setAnimating(true);
      if (messages[messageIndex].text) {
        showTextSequentially(messages[messageIndex].text, setMessage, 30, () => {
          setAnimating(false);
        });
      }
     
    }
  }, [messageIndex]);

  // 5. 초기 랜더링
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
          title: message.story.chapter.title,
        }));
        setMessages(initialMessages);
      })
      .catch((error) => {
        console.error("초기 스토리 불러오기 오류:", error);
      });
  }, []);


  // 6. NextMessage 핸들링
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
        fetchSave(nextStoryId, accessToken)

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
            const formatId = data.data[0].story.formatId;
            if (formatId === 3) {
              window.location.href = '/item';
            }
            if (formatId === 4) {
              window.location.href = '/mission';
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
              backgroundImage: message.story.backgroundImage,
              title: message.story.chapter.title,
            }));
            if (formatId === 1) {
                window.location.href='dialogue';
            }
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
              width: "7%",
              height: "8%",
              top: "20px",
              left: "0px",
              backgroundColor: "#242424",
              color: "#FFF",
              border: "1px solid #FFF",
              cursor: "pointer",
              borderTop: "5px solid #3D3D3D",
              borderLeft: "5px solid #3D3D3D",
              borderBottom: "none",
              borderRight: "none",
            }}
          >
            <img
              style={{
                width: "35px",
                height: "35px",
                float: "right",
              }}
              src={back}
              alt="뒤로 가기"
            />
          </button>

          <Box
            className={`shake ${isShaking ? "animate" : ""}`}
            style={{
              backgroundImage: `url(${messages[messageIndex].backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              animation: isShaking ? "shake 3s ease" : "none",
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            }}
          >
            <Container maxWidth="xl" style={{ textAlign: 'center' }}>
              
                {messages.length > 0 && (
                      <img
                      src={messages[messageIndex].title}
                      alt="Title Image"
                      style={{
                        width: "450px",
                        height: "100px",
                        marginTop: "10%",
                      }}
                    />
                    )}
                
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

                <div 
                  style={{ 
                    display: 'flex' ,
                  }}>

                  <Box
                    style = {{
                      width: '650px',
                      marginTop: "5%",
                      marginRight: '200px',
                    }}  
                  >
                    
                    <TextField
                      label="여기에 코드를 입력해주세요."
                      style={{
                        width: "650px",
                        marginTop: "2%",
                        marginBottom: "5%",
                      }}
                      InputProps={{
                        style:{
                          backgroundImage: `url(${codemirrorBackground})`,
                          backgroundSize: '100% 100%', 
                          height: "800px",
                        }
                      }}
                      defaultValue="print()"
                    />

                  </Box>
                  
                  {messages.length > 0 ? (
                    <img
                      src={messages[messageIndex].characterImage}
                      alt="Character Image"
                      style={{
                        width: "600px",
                        height: "1000px",
                        marginTop: "2%",
                        marginBottom: "5%",
                        opacity: isImageVisible ? 1 : 0.3,
                        transition: "opacity 2s",
                      }}
                    />
                  ) : null}

                </div>

                {messages.length > 0 && messages[messageIndex].formatId !==5 && (
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
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.62) 8.67%, #000 89.06%)",
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
                        fontSize: "40px",
                        fontFamily: "LINE Seed Sans KR",
                        marginTop: "1%",
                      }}
                    >
                      {messages[messageIndex].speaker}
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
                                      color: "red",
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
                  </div>
                )}
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
              </Grid>
            </Container>
          </Box>
        </div>
      ) : null}
    </div>
  );
}
