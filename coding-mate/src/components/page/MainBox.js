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
  useEffect(() => {
    const storedStoryId = localStorage.getItem("nextStoryId");
    if (storedStoryId) {
      setNextStoryId(storedStoryId);
    }
  }, []);

  const handleChapterButtonClick = () => {
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
          setFirstId(data.data.firstStoryId);
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
          bottom: "5%",
          left: "3%",
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
        };

        const imgStyles = {
          position: "absolute",
          width: "100px",
          height: "100px",
          zIndex: 1,
          top: chapter.imgPosition.top,
          left: chapter.imgPosition.left,
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
              {imagePosition === chapter.position && (
                <img
                  src={chapterUrl}
                  alt={`chapter ${chapter.position} Character`}
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
    </Box>
  );
}
