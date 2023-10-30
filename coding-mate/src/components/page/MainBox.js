import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../../assets/fonts/Font.css";

export default function MainBox() {
  const [imagePosition, setImagePosition] = useState("chapter1");
  const [firstId, setFirstId] = useState(0);
  const [lastId, setLastId] = useState(0);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterUrl, setChapterUrl] = useState("");
  const [title, setTitle] = useState("AI: escape");
  const [nextStoryId, setNextStoryId] = useState(0);
  const [formatId, setFormatId] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const chapterButtons = [
    { position: "chapter1", label: "Chapter 1", chapterId: 1 },
    { position: "chapter2", label: "Chapter 2", chapterId: 2 },
    { position: "chapter3", label: "Chapter 3", chapterId: 3 },
    { position: "chapter4", label: "Chapter 4", chapterId: 4 },
  ];

  const accessToken = localStorage.getItem("accessToken");
  const userChapterId = localStorage.getItem("chapterId");

  // const handleChapterButtonClick = (chapter) => {
  //   localStorage.setItem("chapterId", chapter.chapterId);
  //   navigate("/dialog");
  // };
  useEffect(() => {
    const storedStoryId = localStorage.getItem("nextStoryId");
    if (storedStoryId) {
      setNextStoryId(storedStoryId);
    }
  }, []);

  const handleChapterButtonClick = () => {
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
        setFormatId(localStorage.getItem("formatId"));
        console.log(res);
        if (res === 4) {
          window.location.href = "/mission";
        }
        if (res === 1 || res === 2 || res === 3) {
          window.location.href = "/dialog";
        }
      })
      .catch((error) => {
        console.error("스토리 불러오기 오류:", error);
        throw error;
      });
  };

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

          // data.data를 localStorage에 저장 (배열을 JSON 문자열로 변환)
          localStorage.setItem("Data", JSON.stringify(data.data));

          setFirstId({
            ...firstId,
            firstId: data.data.firstStoryId,
          });
          setLastId(data.data.lastStoryId);
          setChapterTitle(data.data.title);
          setChapterUrl(data.data.url);
        })
        .catch((error) => {
          console.error("챕터 데이터를 가져오는 중 오류 발생", error);
        });
    } else {
      window.alert("로그인 과정에서 오류가 발생했습니다. 다시 로그인 해주세요");
      navigate("/login");
    }
  }, [accessToken, userChapterId]);

  useEffect(() => {
    setImagePosition(`chapter${userChapterId}`);
  }, [userChapterId]);

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
          top: "10px",
          left: "10px",
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
        src="https://sejongcodingmate.s3.ap-northeast-2.amazonaws.com/background/map.png"
        alt="Map Background"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
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

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {chapterButtons.map((chapter, index) => (
          <div
            key={index}
            style={{
              width: "30vw",
              height: "15vh",
            }}
          >
            <Button
              variant="contained"
              color="success"
              style={{ margin: "10%" }}
              onClick={() => handleChapterButtonClick(chapter)}
              disabled={parseInt(userChapterId) !== chapter.chapterId}
            >
              {chapter.label}
            </Button>
            {imagePosition === chapter.position && (
              <img
                src={chapterUrl}
                alt={`chapter ${chapter.position} Character`}
                style={{
                  position: "absolute",
                  width: "100px",
                  height: "100px",
                  zIndex: 1,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </Box>
  );
}
