import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../../assets/fonts/Font.css";

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
  const title = "AI : ESCAPE";
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const chapterButtons = [
    {
      position: "chapter1",
      label: "Chapter 1",
      chapterId: 1,
      imgPosition: { top: "56%", left: "2%" },
    },
    {
      position: "chapter2",
      label: "Chapter 2",
      chapterId: 2,
      imgPosition: { top: "42%", left: "55%" },
    },
    {
      position: "chapter3",
      label: "Chapter 3",
      chapterId: 3,
      imgPosition: { top: "30%", left: "62%" },
    },
  ];

  const accessToken = localStorage.getItem("accessToken");
  const userChapterId = localStorage.getItem("chapterId");

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
    const chapterId = parseInt(userChapterId-1);
    const nextStoryId = localStorage.getItem("nextStoryId");
    const browserWidth = window.innerWidth;
    const browserHeight = window.innerHeight;

    if ((chapterId > 0 && chapterId < 3) && parseInt(nextStoryId) === 0) {
      const fromImagePositions = chapterButtons.map(() => ({
        top: parseInt(chapterButtons[chapterId - 1].imgPosition.top, 10) * browserHeight / 100,
        left: parseInt(chapterButtons[chapterId - 1].imgPosition.left, 10) * browserWidth / 100
      }));
  
      const toImagePositions = chapterButtons.map(() => ({
        top: parseInt(chapterButtons[chapterId].imgPosition.top, 10) * browserHeight / 100,
        left: parseInt(chapterButtons[chapterId].imgPosition.left, 10) * browserWidth / 100
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
            const deltaX = (toImagePositions[index].left - left) / animationDuration * currentTime;
            const deltaY = (toImagePositions[index].top - top) / animationDuration * currentTime;
            const leftInPixels = (left + deltaX);
            const topInPixels = (top + deltaY);
  
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
      };
    } 

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
          bottom: "5%",
          left: "3%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#000",
            color: "#FFF",
            padding: "10px",
            fontSize: "24px",
            width: "20vw",
            height: "10vh",
            textAlign: "center",
          }}
        >
          {title}
        </Box>
      </div>
      <img
        src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/background/map.jpg"
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
            backgroundColor: "#000",
            color: "#FFF",
            padding: "10px",
            fontSize: "18px",
            width: "40vw",
            height: "30vh",
            textAlign: "center",
          }}
        >
          {chapterTitle}
        </Box>
      </div>
      {chapterButtons.map((chapter, index) => {
        let topPosition, leftPosition;
        if (chapter.position === "chapter1") {
          topPosition = "50%";
          leftPosition = "10%";
        } else if (chapter.position === "chapter2") {
          topPosition = "42%";
          leftPosition = "40%";
        } else if (chapter.position === "chapter3") {
          topPosition = "25%";
          leftPosition = "47%";
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
          display: animationEnd ? 'block' : 'none'
        };
        return (
          <React.Fragment key={`fragment-${index}`}>
            <div key={index} style={buttonStyles}>
              <Button
                variant="contained"
                color="success"
                style={{ margin: "10%" }}
                onClick={() => handleChapterButtonClick(chapter)}
                disabled={parseInt(userChapterId) !== chapter.chapterId}
              >
                {chapter.label}
              </Button>
            </div>
            <div key={`img-${index}`} style={imgStyles}>
              {imagePosition === chapter.position &&(
                <img
                  src={chapterUrl}
                  alt = ""
                  //alt={`chapter ${chapter.position} Character`}
                  style={{
                    width: "100px",
                    height: "100px",
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

