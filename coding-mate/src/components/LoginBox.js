import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function LoginBox() {
  const navigate = useNavigate();

  const [memberId, setmemberId] = useState("");
  const [password, setpassword] = useState("");
  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 memberId 값을 읽어옵니다.
    const storedMemberId = localStorage.getItem("memberId");
    console.log(storedMemberId);
    if (storedMemberId) {
      setmemberId(storedMemberId);
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Enter 키가 눌렸을 때 로그인 로직을 호출
      handleLogin(event);
    }
  };

  const handleLogin = (event) => {
    // 로그인 로직을 여기에 구현
    // 이 함수 내에서 ID와 PW를 가져와 로그인을 수행하면 됩니다.
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      memberId: memberId,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://3.37.164.99/api/member/login", requestOptions)
      .then((response) => {
        const authHeader = response.headers.get("Authorization");
        if (authHeader) {
          const accessToken = authHeader.replace("Bearer ", "");

          // JSON 데이터를 파싱하고 "data" 프로퍼티의 값을 localStorage에 저장
          return response.json().then((data) => {
            console.log(data);
            localStorage.setItem("nextStoryId", data.data.storyId);
            localStorage.setItem(
              "hasTemporaryPassword",
              data.data.hasTemporaryPassword
            );
            localStorage.setItem("name", data.data.name);
            return accessToken;
          });
        } else {
          throw new Error("access token을 받지 못했습니다.");
        }
      })
      .then((accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("password", password);
        window.alert("로그인에 성공하였습니다.");
        const TemporaryPassword = localStorage.getItem("hasTemporaryPassword");
        console.log(TemporaryPassword);
        if (localStorage.getItem("hasTemporaryPassword") == "true") {
          window.location.href = "/pwchange";
        } else {
          window.location.href = "/main";
        }
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        window.alert("회원이 없거나 비밀번호가 틀렸습니다.");
      });
  };

  const handleForgetPassword = () => {
    navigate("/forgetpw");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h3"
        color="#FFFFFF"
        fontSize="40px"
        fontWeight="400"
        fontFamily="D2Coding"
        textAlign="center"
      >
        Hello world!
        <br />
        welcome to ‘AI-escape’
      </Typography>

      <Box
        sx={{
          background: "#EEE",
          width: "38%",
          height: "31%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between", // 버튼을 하단에 고정
          padding: "16px",
          mt: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <InputLabel
            sx={{
              color: "#0A84FF",
              fontFamily: "D2Coding",
              fontSize: "35px",
              marginRight: "1%",
            }}
          >
            ID &gt;
          </InputLabel>
          <TextField
            margin="normal"
            required
            name="memberId"
            id="memberId"
            autoComplete="memberId"
            value={memberId} // memberId 상태를 value로 설정하여 디폴트 값으로 사용
            onChange={(e) => setmemberId(e.target.value)}
            variant="standard"
            sx={{
              mt: 1,
              border: "1px solid #FFF",
              "& input": {
                color: "#FFF",
              },
              background: "#000", // 배경색을 #000으로 변경
              width: "85%", // 너비를 늘립니다.
            }}
            onKeyPress={handleKeyPress} // Enter 키 이벤트 처리
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            marginBottom: "1rem",
          }}
        >
          <InputLabel
            sx={{
              color: "#0A84FF",
              fontFamily: "D2Coding",
              fontSize: "35px",
              marginRight: "1%",
            }}
          >
            PW &gt;
          </InputLabel>
          <TextField
            margin="normal"
            type="password"
            required
            name="password"
            id="password"
            autoComplete="current-password"
            placeholder="4자리 이상 입력하세요" // 이 부분을 추가하여 가이드 라인을 설정
            onChange={(e) => setpassword(e.target.value)}
            variant="standard"
            sx={{
              mt: 1,
              border: "1px solid #FFF",
              "& input": {
                color: "#FFF",
              },
              background: "#000", // 배경색을 #000으로 변경
              width: "85%", // 너비를 늘립니다.
            }}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#A9A9A9", // 배경색을 #A9A9A9로 변경
              color: "#FFF",
              flex: "1",
              "&:hover": {
                backgroundColor: "#A9A9A9",
              },
            }}
            onClick={handleForgetPassword}
          >
            비밀번호 찾기
          </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#0A84FF", // 배경색을 #0A84FF로 변경
              color: "#FFF",
              flex: "1",
              marginLeft: "0.5rem",
              "&:hover": {
                backgroundColor: "#0A84FF",
              },
            }}
            onClick={handleLogin}
          >
            로그인
          </Button>
        </div>
      </Box>
    </Box>
  );
}
