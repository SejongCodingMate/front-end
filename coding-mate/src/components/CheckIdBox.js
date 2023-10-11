import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CheckIdBox() {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Enter 키가 눌렸을 때 로그인 로직을 호출
      handleLogin(event);
    }
  };

  const apiUrl = `http://3.37.164.99/api/member/${email}`;

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      window.alert('올바른 이메일 주소가 아닙니다.');
      window.location.reload();
      return;
      // 이메일이 유효하면 memberId를 업데이트
    }

      fetch(apiUrl, 
        {method: 'GET',
         headers: {
          'Content-Type': 'application/json',
         }} )
         .then(response => response.json())
         .then(data => {
           const responseData = data.data; // data.data를 변수에 저장
           console.log(responseData);      // true
           localStorage.setItem('memberId', email);
           if (responseData) {
            navigate("/login");
          } else {
            navigate("/signin");
          }
         })
        .catch((error) => {
          console.error("오류:", error);
        });
  };

  const handleForgetPassword = () => {
    if (!validateEmail(email)) {
      window.alert('올바른 이메일 주소가 아닙니다.');
      window.location.reload();
      return;
      // 이메일이 유효하면 memberId를 업데이트
    }
    localStorage.setItem('memberId', email);
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
        Hello world!<br />welcome to ‘AI-escape’
      </Typography>

      <Box
        sx={{
          background: "#EEE",
          width: "38%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            ID 
          </InputLabel>
          <TextField
            margin="normal"
            required
            name="memberId"
            id="memberId"
            autoComplete="memberId"
            onChange={(e) => setEmail(e.target.value)}
            variant="standard"
            sx={{
              mt: 1,
              border: "1px solid #FFF",
              "& input": {
                color: "#FFF",
              },
              background: "#000", // 배경색을 #000으로 변경
              width: "70%", // 너비를 늘립니다.
            }}
            onKeyPress={handleKeyPress} // Enter 키 이벤트 처리
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