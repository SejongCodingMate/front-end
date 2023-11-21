import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "../../assets/animation/Shaking.css";
import "../../assets/animation/Zoom.css";
import "../../assets/animation/Blur.css";
import "../../assets/fonts/QuestionFont.css";
import hardLevelModalStyle from "../../assets/animation/HardLevelModalStyle";
import easyLevelModalStyle from "../../assets/animation/EasyLevelModalStyle";
import middleLevelModalStyle from "../../assets/animation/MiddleLevelModalStyle";
import back from "../../assets/image/backButton.png";
import exampleCodeBackground from "../../assets/image/exampleCodeBackground.png";
import nextButton from "../../assets/image/next.png";
import codebox from "../../assets/image/code_box.png";
import runButton from "../../assets/image/run_button.png";
import easyButton from "../../assets/image/easy_button.png";
import middleButton from "../../assets/image/middle_button.png";
import hardButton from "../../assets/image/hard_button.png";
import hintButton from "../../assets/image/hint_button.png";
import {
  Container,
  Paper,
  Typography,
  Button,
  Switch,
  Fade,
  Input,
  TextField,
} from "@mui/material";
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
  const [message, setMessage] = useState("");
  const [isAnimating, setAnimating] = useState(false);
  const [code, setCode] = useState(null);
  const [showCodeAnimation, setShowCodeAnimation] = useState("");
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const canvasRef = useRef(null);
  const [animatioIindex, setAnimatioIindex] = useState(-1);
  const [modalLevelOpen, setModalLevelOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

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

  // 4. 애니메이션 UseEFfect
  useEffect(() => {
    if (messages[messageIndex]) {
      setMessage("");
      setAnimating(true);
      if (messages[messageIndex].text) {
        showTextSequentially(
          messages[messageIndex].text,
          setMessage,
          35,
          () => {
            setAnimating(false);
          }
        );
      }
    }
  }, [messageIndex]);

  useEffect(() => {
    if (messages[messageIndex]) {
      if (
        messages[messageIndex].speaker === "USER" ||
        messages[messageIndex].text === "(예제 실행)"
      ) {
        const getCodeFromLocalStorage = () => {
          const localStorageCode = localStorage.getItem("code");
          setCode(localStorageCode);
          setShowCodeAnimation("");
          showTextSequentially(
            localStorageCode,
            setShowCodeAnimation,
            35,
            () => {}
          );
        };

        getCodeFromLocalStorage();
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
        const formatId = data.data[0].story.formatId;
        if (formatId === 5) {
          const newMessages = data.data.map((message) => ({
            currentStoryId: message.story.id,
            nextStoryId: message.story.nextId,
            formatId: message.story.formatId,
            characterImage: message.characterImage,
            backgroundImage: message.story.backgroundImage,
            code: message.code,
            hint: message.hint,
            itemImage: message.itemImage,
            input: message.input,
            text: message.text,
          }));
          localStorage.setItem("codeGuide", newMessages[0].code);
          setMessages([...messages, ...newMessages]);
        } else {
          if (formatId == 6) {
            localStorage.setItem("easyId", data.data[0].easyId);
            localStorage.setItem("mediumId", data.data[0].mediumId);
            localStorage.setItem("hardId", data.data[0].hardId);

            const message = data.data[1];
            const initialMessages = [
              {
                formatId: message.story.formatId,
                speaker: message.speaker,
                text: message.text,
                currentStoryId: message.story.id,
                nextStoryId: message.story.nextId,
                characterImage: message.characterImage,
                backgroundImage: message.story.backgroundImage,
              },
            ];

            setMessages(initialMessages);
            setMessageIndex(1);
            openLevelModal();
          }
          const initialMessages = data.data.map((message) => ({
            formatId: message.story.formatId,
            speaker: message.speaker,
            text: message.text,
            currentStoryId: message.story.id,
            nextStoryId: message.story.nextId,
            characterImage: message.characterImage,
            backgroundImage: message.story.backgroundImage,
            title: message.story.chapter.title,
            code: message.code,
          }));
          setMessages(initialMessages);
        }
      })
      .catch((error) => {
        console.error("초기 스토리 불러오기 오류:", error);
      });
  }, []);

  const openLevelModal = () => {
    setModalLevelOpen(true);
  };

  // 7. NextMessage 핸들링
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
        fetchSave(nextStoryId, accessToken);

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
            localStorage.setItem("forematId", formatId);
            if (formatId === 1) {
              window.location.href = "/dialogue";
            } else if (formatId === 3) {
              window.location.href = "/item";
            } else if (formatId === 4) {
              localStorage.setItem("code", data.data[0].code);
              localStorage.setItem("itemImage", data.data[0].itemImage);

              setMessageIndex(messageIndex + 1);
              const newMessages = data.data.slice(1).map((message) => ({
                speaker: message.speaker,
                text: message.text,
                currentStoryId: message.story.id,
                nextStoryId: message.story.nextId,
                formatId: message.story.formatId,
                characterImage: message.characterImage,
                backgroundImage: message.story.backgroundImage,
                title: message.story.chapter.title,
              }));
              localStorage.setItem("nextStoryId", newMessages[0].nextStoryId);
              setMessages([...messages, ...newMessages]);
            } else if (formatId === 5) {
              const newMessages = data.data.map((message) => ({
                currentStoryId: message.story.id,
                nextStoryId: message.story.nextId,
                formatId: message.story.formatId,
                characterImage: message.characterImage,
                backgroundImage: message.story.backgroundImage,
                code: message.code,
                hint: message.hint,
                itemImage: message.itemImage,
                input: message.input,
                text: message.text,
              }));
              localStorage.setItem("codeGuide", newMessages[0].code);
              setMessages([...messages, ...newMessages]);
            }
          })
          .catch((error) => {
            console.error("다음 스토리 불러오기 오류:", error);
          });
      }
    }
  };

  // 8. 코드창 엔터키 인식 함수
  const handleInputEnter = (e) => {
    const inputValue = e.target.value;
    const formattedCode = inputValue.replace(/\n/g, "\\n");
    setUserInput(formattedCode);
  };

  // 9. 코드 실행 함수
  const handleCodeExecute = () => {
    const accessToken = localStorage.getItem("accessToken");
    const storyId = localStorage.getItem("nextStoryId");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      code: userInput,
      input: "",
      storyId: storyId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://3.37.164.99/api/code/execute`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] == "정답입니다.") {
          setAnimatioIindex(10);
          setIsCorrect(true);
        } else {
          window.alert("코드를 다시 입력해주세요.");
        }
      })
      .catch((error) => {
        console.error("스토리 불러오기 오류:", error);
        throw error;
      });
    setAnimatioIindex(-1);
    setIsCorrect(false);
  };

  // 10. 난이도 선택 시 문제를 보여주는 함수
  const handleModalCode = (level) => {
    setModalLevelOpen(false);

    const audio = new Audio("/hover.mp3");
    audio.play();

    localStorage.setItem("choice", level);

    const token = localStorage.getItem("accessToken");
    const nextStoryId = localStorage.getItem(localStorage.getItem("choice"));

    if (!token) {
      console.error("AccessToken이 없습니다.");
      return;
    }
    setAccessToken(token);

    fetchStory(nextStoryId, token).then((data) => {
      const formatId = data.data[0].story.formatId;

      if (formatId == 4) {
        localStorage.setItem("code", data.data[0].code);
        localStorage.setItem("itemImage", data.data[0].itemImage);

        setMessageIndex(messageIndex + 1);
        const newMessages = data.data.slice(1).map((message) => ({
          speaker: message.speaker,
          text: message.text,
          currentStoryId: message.story.id,
          nextStoryId: message.story.nextId,
          formatId: message.story.formatId,
          characterImage: message.characterImage,
          backgroundImage: message.story.backgroundImage,
          title: message.story.chapter.title,
          code: message.code,
        }));
        localStorage.setItem("speaker", newMessages[0].speaker);
        localStorage.setItem("nextStoryId", newMessages[0].nextStoryId);
        setMessages([...messages, ...newMessages]);
      }
    });
  };

  // 11. 정답일 때 애니메이션 실행 함수
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && isCorrect) {
      const ctx = canvas.getContext("2d");
      const browserWidth = window.innerWidth;
      const browserHeight = window.innerHeight;

      const imageAlt = "Character Image";
      const imageList = document.querySelectorAll("img");

      let target = null;
      imageList.forEach((image) => {
        if (image.alt === imageAlt) {
          target = image;
        }
      });

      const imageRect = target.getBoundingClientRect();
      const bottom30PercentY = imageRect.bottom - imageRect.height * 0.35;
      const leftpxX = imageRect.left + 50;
      const rightpxX = leftpxX + 100;

      console.log(leftpxX);
      console.log(rightpxX);

      canvas.width = browserWidth;
      canvas.height = browserHeight;

      const image = new Image();
      image.src = messages[messageIndex].itemImage;

      image.onload = () => {
        const animationDuration = 1500;
        const totalAnimations = 3;
        let animationCount = 0;

        const animate = () => {
          const currentTime = Date.now() - startTime;
          //console.log(currentTime);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let deltaX;
          // 시간이 animationDuration의 절반보다 작으면 증가, 그렇지 않으면 감소
          if (currentTime < animationDuration / 2) {
            deltaX =
              leftpxX +
              ((rightpxX - leftpxX) / (animationDuration / 2)) * currentTime;
          } else {
            deltaX =
              rightpxX -
              ((rightpxX - leftpxX) / (animationDuration / 2)) *
                (currentTime - animationDuration / 2);
          }

          ctx.drawImage(image, deltaX, bottom30PercentY, 438, 302);

          if (currentTime < animationDuration) {
            requestAnimationFrame(animate);
          } else {
            animationCount++;
            if (animationCount < totalAnimations) {
              // 다음 반복을 위해 애니메이션 재시작
              startTime = Date.now();
              animate();
            } else {
              handleNextMessage();
            }
          }
        };

        let startTime = Date.now();
        animate();
      };
    }
  }, [isCorrect]);

  // 12. 힌트 공개 여부에 대한 함수
  const handleHintOpen = () => {
    if (hintOpen == false) {
      setHintOpen(true);
    } else {
      setHintOpen(false);
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

          {messages.length > 0 && (
            <Box
              className={`shake ${isShaking ? "animate" : ""}`}
              sx={{
                position: "relative",
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
              {/* 배경 이미지를 위한 박스 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${messages[messageIndex].backgroundImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  filter: modalLevelOpen ? "brightness(70%)" : "none",
                  zIndex: "-1",
                }}
              ></div>
              <Container
                maxWidth="xl"
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100vh",
                }}
              >
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
                      position: "relative",
                    }}
                  >
                    <Box
                      style={{
                        width: "650px",
                        marginTop: "5%",
                        marginRight: "200px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {messages.length > 0 &&
                        messages[messageIndex].formatId === 4 &&
                        messages[messageIndex].text === "(예제 실행)" && (
                          <TextField
                            onChange={(e) => setUserInput(e.target.value)}
                            style={{
                              width: "650px",
                              marginTop: "2%",
                              marginBottom: "5%",
                            }}
                            InputProps={{
                              style: {
                                backgroundImage: `url(${exampleCodeBackground})`,
                                backgroundSize: "100% 100%",
                                height: "1000px",
                                fontSize: "30px",
                                fontFamily: "Jeongnimsaji-R",
                              },
                            }}
                            value={showCodeAnimation}
                            multiline
                          />
                        )}
                      {messages.length > 0 &&
                        messages[messageIndex].formatId === 5 &&
                        isCorrect === false && (
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
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100vh",
                                position: "fixed",
                                top: "3%",
                              }}
                            >
                              <Box
                                style={{
                                  backgroundImage: `url(${codebox})`,
                                  backgroundRepeat: "no-repeat",
                                  height: "1000px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  {localStorage.getItem("choice") ===
                                    "mediumId" && (
                                    <img
                                      onClick={() => handleModalCode("easyId")}
                                      style={{
                                        backgroundImage: `url(${easyButton})`,
                                        marginTop: "30px",
                                        right: "70px",
                                        bottom: 0,
                                        width: "175px",
                                        height: "50px",
                                        backgroundRepeat: "no-repeat",
                                        marginLeft: "2%",
                                        outline: "none",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}

                                  {localStorage.getItem("choice") ===
                                    "mediumId" && (
                                    <img
                                      onClick={() => handleModalCode("hardId")}
                                      style={{
                                        backgroundImage: `url(${hardButton})`,
                                        marginTop: "30px",
                                        right: "70px",
                                        bottom: 0,
                                        width: "175px",
                                        height: "50px",
                                        backgroundRepeat: "no-repeat",
                                        marginLeft: "10px",
                                        outline: "none",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}

                                  {localStorage.getItem("choice") ===
                                    "easyId" && (
                                    <img
                                      onClick={() =>
                                        handleModalCode("mediumId")
                                      }
                                      style={{
                                        backgroundImage: `url(${middleButton})`,
                                        marginTop: "30px",
                                        right: "70px",
                                        bottom: 0,
                                        width: "175px",
                                        height: "50px",
                                        backgroundRepeat: "no-repeat",
                                        marginLeft: "40px",
                                        outline: "none",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}

                                  {localStorage.getItem("choice") ===
                                    "easyId" && (
                                    <img
                                      onClick={() => handleModalCode("hardId")}
                                      style={{
                                        backgroundImage: `url(${hardButton})`,
                                        marginTop: "30px",
                                        right: "70px",
                                        bottom: 0,
                                        width: "175px",
                                        height: "50px",
                                        backgroundRepeat: "no-repeat",
                                        marginLeft: "10px",
                                        outline: "none",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}

                                  {localStorage.getItem("choice") ===
                                    "hardId" && (
                                    <img
                                      onClick={() => handleModalCode("easyId")}
                                      style={{
                                        backgroundImage: `url(${easyButton})`,
                                        marginTop: "30px",
                                        right: "70px",
                                        bottom: 0,
                                        width: "175px",
                                        height: "50px",
                                        backgroundRepeat: "no-repeat",
                                        marginLeft: "40px",
                                        outline: "none",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}

                                  {localStorage.getItem("choice") ===
                                    "hardId" && (
                                    <img
                                      onClick={() =>
                                        handleModalCode("mediumId")
                                      }
                                      style={{
                                        backgroundImage: `url(${middleButton})`,
                                        marginTop: "30px",
                                        right: "70px",
                                        bottom: 0,
                                        width: "175px",
                                        height: "50px",
                                        backgroundRepeat: "no-repeat",
                                        marginLeft: "10px",
                                        outline: "none",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}

                                  <img
                                    onClick={handleHintOpen}
                                    style={{
                                      backgroundImage: `url(${hintButton})`,
                                      marginTop: "30px",
                                      right: "70px",
                                      bottom: 0,
                                      width: "120px",
                                      height: "50px",
                                      backgroundRepeat: "no-repeat",
                                      marginLeft: "10px",
                                      outline: "none",
                                      cursor: "pointer",
                                    }}
                                  />

                                  <img
                                    onClick={handleCodeExecute}
                                    style={{
                                      backgroundImage: `url(${runButton})`,
                                      float: "right",
                                      marginTop: "30px",
                                      marginRight: "1%",
                                      bottom: 0,
                                      width: "100px",
                                      height: "50px",
                                      backgroundRepeat: "no-repeat",
                                      marginLeft: "10px",
                                      outline: "none",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>

                                <Box
                                  style={{
                                    width: "700px",
                                    height: "120px",
                                    textAlign: "center",
                                    backgroundSize: "100% 100%",
                                    color: "black",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    style={{
                                      whiteSpace: "pre-line", // 줄 바꿈을 허용하는 스타일
                                      fontSize: "30px",
                                      fontFamily: "Jeongnimsaji-R",
                                      fontWeight: 700,
                                      textAlign: "center",
                                      position: "fixed",
                                      left: 0,
                                      right: 0,
                                    }}
                                  >
                                    {messages[messageIndex].text}
                                  </Typography>
                                </Box>

                                <textarea
                                  onChange={handleInputEnter}
                                  style={{
                                    position: "fixed",
                                    width: "auto",
                                    height: "800px",
                                    marginTop: "10%",
                                    marginBottom: "5%",
                                    left: "5%",
                                    right: "5%",
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    fontFamily: "Jeongnimsaji-R",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "25px",
                                    overflow: "hidden",
                                  }}
                                  defaultValue={localStorage.getItem(
                                    "codeGuide"
                                  )}
                                />
                              </Box>
                            </div>
                          </Grid>
                        )}
                    </Box>

                    {messages.length > 0 &&
                      ((messages[messageIndex].formatId === 4 &&
                        messages[messageIndex].text !== "(예제 실행)") ||
                        (messages[messageIndex].formatId === 5 &&
                          isCorrect)) && (
                        <img
                          src={messages[messageIndex].characterImage}
                          alt="Character Image"
                          style={{
                            width: "700px",
                            height: "800px",
                            marginTop: "2%",
                            marginBottom: "5%",
                            opacity: isImageVisible ? 1 : 0.3,
                            transition: "opacity 2s",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      )}

                    {modalLevelOpen && (
                      <div
                        className="modal-container"
                        style={{
                          justifyContent: "space-between",
                          zIndex: 9998,
                        }}
                      >
                        <div
                          className="modal hard"
                          style={hardLevelModalStyle}
                          onClick={() => handleModalCode("hardId")}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)"; 
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)"; 
                          }}
                        >
                          <div
                            className="modal-content"
                            style={{ marginTop: "15%" }}
                          >
                            <h1 style={{ color: "white" }}>어려운 방법</h1>
                          </div>
                        </div>

                        <div
                          className="modal medium"
                          style={middleLevelModalStyle}
                          onClick={() => handleModalCode("mediumId")}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)"; 
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)"; 
                          }}
                        >
                          <div
                            className="modal-content"
                            style={{ marginTop: "15%" }}
                          >
                            <h1 style={{ color: "white" }}>중간 방법</h1>
                          </div>
                        </div>

                        <div
                          className="modal easy"
                          style={easyLevelModalStyle}
                          onClick={() => handleModalCode("easyId")}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)"; 
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)"; 
                          }}
                        >
                          <div
                            className="modal-content"
                            style={{ marginTop: "15%" }}
                          >
                            <h1 style={{ color: "white" }}>쉬운 방법</h1>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {hintOpen && (
                    <div
                      style={{
                        opacity: isImageVisible ? 1 : 0.3,
                        transition: "opacity 2s",
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
                          marginTop: "5%",
                        }}
                      >
                        {localStorage.getItem("speaker")}
                      </Typography>

                      <Typography
                        variant="h3"
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontSize: "30px",
                          fontFamily: "LINE Seed Sans KR",
                          marginTop: "3%",
                        }}
                      >
                        {messages[messageIndex].hint}
                      </Typography>
                    </div>
                  )}

                  {messages.length > 0 &&
                    messages[messageIndex].formatId !== 5 && (
                      <div
                        style={{
                          opacity: isImageVisible ? 1 : 0.3,
                          transition: "opacity 2s",
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
                        {messages[messageIndex].speaker !== "USER" &&
                        messages[messageIndex].text !== "(예제 실행)" ? (
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
                        ) : null}

                        {messages[messageIndex].text !== "(예제 실행)" &&
                        messages[messageIndex].speaker !== "USER" ? (
                          <Typography
                            variant="h4"
                            style={{
                              textAlign: "center",
                              color: "white",
                              transform:
                                messages[messageIndex].speaker === "USER"
                                  ? "skewX(-20deg)"
                                  : "skewX(0deg)",
                              marginTop: "3%",
                              fontSize: "30px",
                              fontFamily: "LINE Seed Sans KR",
                            }}
                          >
                            {isAnimating
                              ? message
                                  .replace(/undefined/g, "")
                                  .replace(/\*/g, "")
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
                        ) : null}

                        <Grid
                          container
                          justifyContent="flex-end"
                          style={{
                            position: "fixed",
                            bottom: "50px",
                            right: "100px",
                          }}
                        >
                          {messages[messageIndex].formatId !== 6 &&
                          messages[messageIndex].formatId !== 5 ? (
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
                                transition: "transform 0.3s ease", // transform 속성을 통해 크기 변경을 부드럽게
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
                          ) : null}
                        </Grid>
                      </div>
                    )}
                </Grid>
              </Container>
            </Box>
          )}

          <canvas
            ref={canvasRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
              zIndex: animatioIindex,
            }}
          ></canvas>
        </div>
      ) : null}
    </div>
  );
}
