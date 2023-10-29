import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "./Shaking.css";
import "./Zoom.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Fade,
} from "@mui/material";
import airobot from "../assets/Character.png";
import React, { useState, useEffect } from "react";
import "./Font.css";

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

export default function StoryBox() {
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const [name, setName] = useState("");
  const [isImageVisible, setImageVisible] = useState(false);
  const [isShaking, setShaking] = useState(false);

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
          speaker: message.speaker,
          text: message.text,
          currentStoryId: message.story.id,
          nextStoryId: message.story.nextId,
          screenEffect: message.screenEffect,
          soundEffect: message.soundEffect,
        }));

        setMessages(initialMessages);
      })
      .catch((error) => {
        console.error("초기 스토리 불러오기 오류:", error);
      });
  }, []);

  const handleNextMessage = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex(messageIndex + 1);
    } else {
      const currentStoryId = messages[messageIndex]?.currentStoryId;
      const nextStoryId = messages[messageIndex]?.nextStoryId;
      localStorage.setItem("nextStoryId", nextStoryId);

      if (currentStoryId && nextStoryId) {
        fetchSave(nextStoryId, accessToken).then((data) => {
          var saveMessages = data.message;
          saveMessages = "자동저장 되었습니다.";
          window.alert(saveMessages);
        });

        fetchStory(nextStoryId, accessToken)
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

            const newMessages = data.data.map((message) => ({
              speaker: message.speaker,
              text: message.text,
              currentStoryId: message.story.id,
              nextStoryId: message.story.nextId,
              formatId: message.story.formatId,
              screenEffect: message.screenEffect,
              soundEffect: message.soundEffect,
            }));

            newMessages.forEach((message) => {
              if (message.screenEffect === 6) { // fade-in
                setImageVisible(true);
              } else if (message.screenEffect === 7) { // fade-out
                setImageVisible(false); 
              } else if (message.screenEffect === 1) { // 화면 흔들리는 효과
                setShaking(true);
              } else if (message.screenEffect === 2) { // 단어 zoom in
                
              } else if (message.screenEffect === 2) { // 화면 zoom in
                
              } 
            });

            
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
      onClick={handleNextMessage}
    >

      <Box
        className={`shake ${isShaking ? 'animate' : ''}`}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          animation: isShaking ? 'shake 3s ease' : 'none',
          width: '100%',
          height: '100%',
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
          <Fade in={isImageVisible} timeout={2000} >
          <img
            src={airobot}
            alt="AI Robot"
            style={{
              width: "300px",
              height: "300px",
              marginTop: "2%",
              marginBottom: "5%",
            }}
          />
          </Fade>

          {messages.length > 0 && (
            <div
              style={{
                width: "100%",
                height: "20%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                position: "fixed" /* 요소를 고정시킴 */,
                bottom: 0 /* 하단에 고정 */,
                background: `
                  linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.12) 100%, #000 89.06%),
                  rgba(102, 102, 102, 0.3)
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
                    messages[messageIndex].speaker === "AI" ? "white" : "white",
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
