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

export default function MissionBox() {
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

  function splitText(text) {
    return text.split("");
  }

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

  useEffect(() => {
    if (messages[messageIndex]) {
      setMessage("");
      setAnimating(true);
      showTextSequentially(messages[messageIndex].text, setMessage, 50, () => {
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
      })
      .catch((error) => {
        console.error("초기 스토리 불러오기 오류:", error);
      });
  }, []);

  // 5. NextMessage 핸들링
  const handleNextMessage = () => {};

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
                {messages.length > 0 ? (
                  <img
                    src={messages[messageIndex].characterImage}
                    alt="Character Image"
                    style={{
                      width: "300px",
                      height: "300px",
                      marginTop: "50%",
                      marginBottom: "5%",
                      marginRight: "80%",
                      opacity: isImageVisible ? 1 : 0.3,
                      transition: "opacity 2s",
                    }}
                  />
                ) : null}

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
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.62) 41.67%, #000 89.06%)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: "40px",
                        fontFamily: "LINE Seed Sans KR",
                        marginTop: "1%",
                        marginBottom: "2%",
                        fontWeight: "700",
                      }}
                    >
                      도로시
                    </Typography>
                    <Typography
                      variant="h4"
                      style={{
                        textAlign: "center",
                        color: "white",
                        transform: "skewX(0deg)",
                        marginBottom: "10%",
                        fontSize: "24px",
                        fontFamily: "LINE Seed Sans KR",
                      }}
                    >
                      {"톱을 출력해서 허수아비를 구해주자!"}
                    </Typography>
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
