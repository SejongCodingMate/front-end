import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../../assets/fonts/Font.css";
import ChapterButton from "../../assets/image/ChapterStone.png";
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
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const chapterButtons = [
    {
      position: "chapter1",
      label: "Chapter 1",
      chapterId: 1,
      imgPosition: { top: "55%", left: "12%" },
    },
    {
      position: "chapter2",
      label: "Chapter 2",
      chapterId: 2,
      imgPosition: { top: "62%", left: "43%" },
    },
    {
      position: "chapter3",
      label: "Chapter 3",
      chapterId: 3,
      imgPosition: { top: "40%", left: "83%" },
    },
    {
      position: "chapter4",
      label: "Chapter 4",
      chapterId: 4,
      imgPosition: { top: "28%", left: "53%" },
    },
  ];

  const accessToken = localStorage.getItem("accessToken");
  const userChapterId = localStorage.getItem("chapterId");

  useEffect(() => {
    // window.onload 이벤트 리스너 등록
    const audio = new Audio("/backgroundMusic.mp3");
    audio.volume = 0.2;
    audio.play();
  }, []);

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
        const animationDuration = 3000;
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
            ctx.drawImage(image, leftInPixels, topInPixels, 100, 100);
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
          if (res === 4) {
            window.location.href = "/mission";
          }
          if (res === 1 || res === 2 || res === 3) {
            window.location.href = "/dialogue";
          }
        })
        .catch((error) => {
          console.error("스토리 불러오기 오류:", error);
          throw error;
        });
    }
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
          left: "2%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "20vw",
            height: "13vh",
            borderRadius: "20px",
            background: "transparent", // 배경색을 투명으로 설정
            backgroundImage: `url("https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/background/%EC%A0%9C%EB%AA%A9.png")`,
            backgroundSize: "100% 100%", // 배경 이미지 크기 설정  padding: "20px",
            backgroundPosition: "1px 1px", // 가로로 10px, 세로로 20px 이동
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          }}
        ></Box>
      </div>
      <img
        src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/background/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B0%B0%EA%B2%BD_%ED%99%94%EC%A7%88%EC%97%85.png"
        alt="Map Background"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "3%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "30vw",
            height: "12vh",
            borderRadius: "20px",
            backgroundImage: `url(${chapterTitle})`, // chapterTitle은 이미지의 URL
            backgroundSize: "102% 110%", // 배경 이미지 크기 설정  padding: "20px",
            backgroundPosition: "-4px -17px", // 가로로 10px, 세로로 20px 이동
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          }}
        ></Box>
      </div>
      {chapterButtons.map((chapter, index) => {
        let topPosition, leftPosition;
        if (chapter.position === "chapter1") {
          topPosition = "75%";
          leftPosition = "11%";
        } else if (chapter.position === "chapter2") {
          topPosition = "67%";
          leftPosition = "40%";
        } else if (chapter.position === "chapter3") {
          topPosition = "46%";
          leftPosition = "80%";
        } else {
          topPosition = "34%";
          leftPosition = "50%";
        }
        const buttonStyles = {
          width: "30vw",
          height: "15vh",
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
        return (
          <React.Fragment key={`fragment-${index}`}>
            <div
              key={index}
              style={{
                ...buttonStyles,
                width: "5%",
              }}
            >
              <button
                onClick={() => handleChapterButtonClick(chapter)}
                disabled={parseInt(userChapterId) !== chapter.chapterId}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <img src={ChapterButton} alt="chapter Button" />
              </button>
            </div>
            <div key={`img-${index}`} style={imgStyles}>
              {imagePosition === chapter.position && (
                <img
                  src={chapterUrl}
                  alt=""
                  //alt={`chapter ${chapter.position} Character`}
                  style={{
                    width: "153px",
                    height: "257px",
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
