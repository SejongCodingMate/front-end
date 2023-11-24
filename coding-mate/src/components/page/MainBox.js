import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import "../../assets/fonts/Font.css";
import ChapterButton from "../../assets/image/ChapterStone.png";
import back from "../../assets/image/backButton.png";
import clearButton from "../../assets/image/clear_button.png";
import nextButton from "../../assets/image/next.png";
import arrow from "../../assets/image/Arrow.png";

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

const fetchStorySave = (nextStoryId, accessToken) => {
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

export default function MainBox() {
  const [imagePosition, setImagePosition] = useState("chapter1");
  const [firstId, setFirstId] = useState(0);
  const [lastId, setLastId] = useState(0);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterUrl, setChapterUrl] = useState("");
  const [animationUrl, setAnimationUrl] = useState("");
  const [animationEnd, setAnimationEnd] = useState(false);
  const [animatioIindex, setAnimatioIindex] = useState(3);
  const [isImageVisible, setImageVisible] = useState(true);
  const [isDialogueVisible, setDialogueVisible] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const firstChapterImageRef = useRef();
  const secondChapterImageRef = useRef();
  const thirdChapterImageRef = useRef();
  const finalChapterImageRef = useRef();

  const chapterButtons = [
    {
      position: "chapter1",
      label: "Chapter 1",
      chapterId: 1,
      imgPosition: { top: "42.5%", left: "6.8%" },
      imageUrl:
        "https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/main/1.png",
    },
    {
      position: "chapter2",
      label: "Chapter 2",
      chapterId: 2,
      imgPosition: { top: "30%", left: "27.5%" },
      imageUrl:
        "https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/main/2.png",
    },
    {
      position: "chapter3",
      label: "Chapter 3",
      chapterId: 3,
      imgPosition: { top: "20%", left: "48.2%" },
      imageUrl:
        "https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/main/3.png",
    },
    {
      position: "chapter4",
      label: "Chapter 4",
      chapterId: 4,
      imgPosition: { top: "24.2%", left: "69.2%" },
      imageUrl:
        "https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/main/4.png",
    },
  ];

  const accessToken = localStorage.getItem("accessToken");
  const userChapterId = localStorage.getItem("chapterId");

  // useEffect(() => {
  //   // window.onload 이벤트 리스너 등록
  //   const audio = new Audio("/backgroundMusic.mp3");
  //   audio.volume = 0.2;
  //   audio.play();
  // }, []);

  // 1. 챕터 조회 메서드
  useEffect(() => {
    if (accessToken && userChapterId) {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      fetch(`http://3.37.164.99/api/chapter/${userChapterId}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("챕터 데이터:", data);
          setFirstId(data.data.firstStoryId);
          setLastId(data.data.lastStoryId);
          setChapterTitle(data.data.title);
          setAnimationUrl(data.data.url);
        })
        .catch((error) => {
          console.error("챕터 데이터를 가져오는 중 오류 발생", error);
        });
    } else {
      window.alert("로그인 과정에서 오류가 발생했습니다. 다시 로그인 해주세요");
      navigate("/login");
    }
  }, [accessToken, userChapterId]);

  // 2. 애니메이션 메서드
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const chapterId = parseInt(userChapterId - 1);
    const nextStoryId = localStorage.getItem("nextStoryId");
    const browserWidth = window.innerWidth;
    const browserHeight = window.innerHeight;

    if (chapterId > 0 && chapterId < 3 && parseInt(nextStoryId) === 0) {
      const fromImagePositions = chapterButtons.map(() => ({
        top:
          (parseInt(chapterButtons[chapterId - 1].imgPosition.top, 10) *
            browserHeight) /
          100,
        left:
          (parseInt(chapterButtons[chapterId - 1].imgPosition.left, 10) *
            browserWidth) /
          100,
      }));

      const toImagePositions = chapterButtons.map(() => ({
        top:
          (parseInt(chapterButtons[chapterId].imgPosition.top, 10) *
            browserHeight) /
          100,
        left:
          (parseInt(chapterButtons[chapterId].imgPosition.left, 10) *
            browserWidth) /
          100,
      }));

      canvas.width = browserWidth;
      canvas.height = browserHeight;

      const image = new Image();
      image.src = animationUrl;

      image.onload = () => {
        const animationDuration = 4000;
        const startTime = Date.now();

        const animate = () => {
          // 현재 시간 계산
          const currentTime = Date.now() - startTime;

          // Canvas를 지우고 새로 그리기
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          chapterButtons.forEach((button, index) => {
            const { left, top } = fromImagePositions[index];
            // 이미지를 현재 위치로 그리기
            const deltaX =
              ((toImagePositions[index].left - left) / animationDuration) *
              currentTime;
            const deltaY =
              ((toImagePositions[index].top - top) / animationDuration) *
              currentTime;
            const leftInPixels = left + deltaX;
            const topInPixels = top + deltaY;

            // 이미지 그리기
            ctx.drawImage(image, leftInPixels, topInPixels, 153, 257);
          });

          // 애니메이션 종료 조건 설정
          if (currentTime < animationDuration) {
            requestAnimationFrame(animate);
          } else {
            setAnimatioIindex(1);
            setChapterUrl(animationUrl);
            setAnimationEnd(true);
          }
        };

        animate();
        localStorage.setItem("nextStoryId", firstId);
        fetchStorySave(firstId, accessToken);
      };
    } else {
      setAnimatioIindex(1);
      setChapterUrl(animationUrl);
      setAnimationEnd(true);
    }
  }, [animationUrl]);

  // 3. Button 활성화 메서드
  useEffect(() => {
    setImagePosition(`chapter${userChapterId}`);
  }, [userChapterId]);

  // 4. ChapterUrl useState 즉시 적용 메서드
  useEffect(() => {
    console.log(chapterUrl);
  }, [chapterUrl]);

  // 5. nextStoryId 확인 메서드
  const checkNextStoryId = (nextStoryId) => {
    if (parseInt(nextStoryId) < firstId) {
      localStorage.setItem("nextStoryId", firstId);

      fetchStorySave(firstId, accessToken);
      return firstId;
    } else if (parseInt(nextStoryId) > lastId) {
      localStorage.setItem("chapterId", parseInt(userChapterId) + 1);

      fetchChapterSave(parseInt(userChapterId) + 1, accessToken);

      window.alert("스토리 진행에 오류가 발생했습니다.");
      window.location.href = "/main";
    }
    return nextStoryId;
  };

  // 6. 스토리 조회 메서드
  const handleChapterButtonClick = () => {
    var nextStoryId = localStorage.getItem("nextStoryId");
    console.log(nextStoryId);

    if (nextStoryId !== null) {
      nextStoryId = checkNextStoryId(nextStoryId);

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
          if (res === 4 || res === 5 || res === 6) {
            window.location.href = "/mission";
          }
          if (res === 3) {
            window.location.href = "/Item";
          }
          if (res === 1 || res === 2) {
            window.location.href = "/dialogue";
          }
        })
        .catch((error) => {
          console.error("스토리 불러오기 오류:", error);
          throw error;
        });
    }
  };

  const handleBackButtonClick = () => {
    navigate("/login");
  };

  const fadeInRightKeyframes = `
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(-100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
  const fadeInRightAnimation = {
    animation: "fadeInRight 1.5s ease-out",
    animationName: "fadeInRight", // 필요한 경우, 키 프레임 이름을 지정
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFF",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3%",
          left: -6,
          zIndex: 9999,
        }}
      >
        <button
          onClick={handleBackButtonClick}
          style={{
            position: "absolute",
            width: "86px",
            height: "69px",
            top: "20px",
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

        <style>{fadeInRightKeyframes}</style>

        <img
          id="1"
          src={clearButton}
          ref={firstChapterImageRef}
          style={{
            position: "fixed",
            top: "27%",
            left: "23%",
            opacity: userChapterId === "1" ? 0 : 1,
            ...(userChapterId === "2"
              ? {
                  animation: "fadeInRight 1.5s ease-out",
                  animationName: "fadeInRight",
                }
              : {}),
          }}
        />

        <img
          id="2"
          src={clearButton}
          ref={secondChapterImageRef}
          style={{
            position: "fixed",
            top: "18%",
            left: "44%",
            opacity: userChapterId <= "2" ? 0 : 1,
            ...(userChapterId === "3"
              ? {
                  animation: "fadeInRight 1.5s ease-out",
                  animationName: "fadeInRight",
                }
              : {}),
          }}
        />

        <img
          id="3"
          src={clearButton}
          ref={thirdChapterImageRef}
          style={{
            position: "fixed",
            top: "23%",
            left: "65%",
            opacity: userChapterId <= "3" ? 0 : 1,
            ...(userChapterId === "4"
              ? {
                  animation: "fadeInRight 1.5s ease-out",
                  animationName: "fadeInRight",
                }
              : {}),
          }}
        />

        <img
          id="4"
          src={clearButton}
          ref={finalChapterImageRef}
          style={{
            position: "fixed",
            top: "33%",
            left: "90%",
            opacity: userChapterId <= "4" ? 0 : 1,
            ...(userChapterId === "5"
              ? {
                  animation: "fadeInRight 1.5s ease-out",
                  animationName: "fadeInRight",
                }
              : {}),
          }}
        />
      </div>
      <img
        src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/background/%E1%84%82%E1%85%B2%E1%84%87%E1%85%A2%E1%84%80%E1%85%A7%E1%86%BC.png"
        alt="Map Background"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {isDialogueVisible && (
        <div
          style={{
            opacity: isImageVisible ? 1 : 0.3,
            transition: "opacity 2s",
            width: "100%",
            height: "45%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "fixed",
            bottom: 0,
            zIndex: 9999,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.3) 15%, rgba(0, 0, 0, 0.6) 40%, #000 100%)", // 대사창 그라데이션
          }}
        >
          <Box
            sx={{
              width: "50%",
              height: "40%",
              backgroundImage:
                "url('https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/main/text1.png')",
              backgroundSize: "100% 100%",
              marginTop: "8%",
            }}
          ></Box>
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
              onClick={handleChapterButtonClick}
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
          </Grid>
        </div>
      )}
      {chapterButtons.map((chapter, index) => {
        let topPosition, leftPosition;
        if (chapter.position === "chapter1") {
          topPosition = "18%";
          leftPosition = "22%";
        } else if (chapter.position === "chapter2") {
          topPosition = "12%";
          leftPosition = "42%";
        } else if (chapter.position === "chapter3") {
          topPosition = "17%";
          leftPosition = "63%";
        } else {
          topPosition = "24%";
          leftPosition = "85.6%"; // 86px는 버튼의 너비에 따라 조절
        }
        const buttonStyles = {
          position: "absolute",
          top: topPosition,
          left: leftPosition,
          zIndex: 2,
        };

        const imgStyles = {
          position: "absolute",
          width: "100px",
          height: "100px",
          zIndex: 2,
          top: chapter.imgPosition.top,
          left: chapter.imgPosition.left,
          display: animationEnd ? "block" : "none",
        };

        // 현재 챕터가 사용자의 챕터와 일치하는 경우에만 밝게 표시
        const isCurrentChapterActive =
          parseInt(userChapterId) === chapter.chapterId;

        return (
          <React.Fragment key={`fragment-${index}`}>
            <div key={index} style={buttonStyles}>
              <button
                onClick={() => setDialogueVisible((prev) => !prev)}
                disabled={!isCurrentChapterActive}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  position: "relative", // 화살표 위치 조절을 위한 추가
                }}
              >
                <img
                  src={chapter.imageUrl}
                  alt={`chapter ${chapter.chapterId} Button`}
                  style={{
                    maxWidth: "265px",
                    maxHeight: "265px",
                    transition: "filter 0.3s",
                    filter: isCurrentChapterActive
                      ? "brightness(1.3)"
                      : "brightness(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (isCurrentChapterActive) {
                      e.target.style.filter = "brightness(1.3)";
                      e.target.style.transform = "scale(1.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isCurrentChapterActive) {
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                />
                {isCurrentChapterActive && (
                  <img
                    src={arrow}
                    alt="화살표"
                    style={{
                      position: "absolute",
                      top: "-25%", // 조절 가능한 값
                      left: "28%",
                      width: "98px",
                      height: "auto",
                      zIndex: 3,
                    }}
                  />
                )}
              </button>
            </div>
            <div key={`img-${index}`} style={imgStyles}>
              {imagePosition === chapter.position && (
                <img
                  src={chapterUrl}
                  alt=""
                  style={{
                    width: "111px",
                    height: "187px",
                  }}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}
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
      />
    </Box>
  );
}
