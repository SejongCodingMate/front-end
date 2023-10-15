import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel"; // InputLabel 추가
import { BrowserRouter as Router, Link } from "react-router-dom";

export default function LoginBox() {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Enter 키가 눌렸을 때 로그인 로직을 호출
      handleLogin();
    }
  };

  const handleLogin = () => {
    // 로그인 로직을 여기에 구현
    // 이 함수 내에서 ID와 PW를 가져와 로그인을 수행하면 됩니다.
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

      {/* ID 입력 필드 */}
      <InputLabel htmlFor="studentId" sx={{ color: "#FFD60A", width: "20vw" }}>
        ID
      </InputLabel>
      <TextField
        margin="normal"
        required
        name="studentId"
        id="studentId"
        autoComplete="studentId"
        variant="standard"
        sx={{
          mt: 1,
          border: "1px solid #FFF",
          width: "20vw",
          height: "6vh",
          "& input": {
            color: "#FFF", // 입력 텍스트 색상 변경
          },
        }}
        onKeyPress={handleKeyPress} // Enter 키 이벤트 처리
      />

      {/* PW 입력 필드 */}
      <InputLabel
        htmlFor="password"
        sx={{ color: "#FFD60A", width: "20vw", mt: 1 }}
      >
        PW
      </InputLabel>
      <TextField
        margin="normal"
        type="password"
        required
        name="password"
        id="password"
        autoComplete="current-password"
        variant="standard"
        sx={{
          mt: 1,
          border: "1px solid #FFF",
          width: "20vw",
          height: "6vh",
          "& input": {
            color: "#FFF", // 입력 텍스트 색상 변경
          },
        }}
        onKeyPress={handleKeyPress} // Enter 키 이벤트 처리
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "1rem",
          gap: 50,
        }}
      >
        <Link
          to="/register"
          style={{
            textDecoration: "none",
            color: "#FF9F0A",
            marginRight: "1rem",
          }}
        >
          회원가입
        </Link>
        <Link
          to="/studentauth"
          style={{ textDecoration: "none", color: "#FF9F0A" }}
        >
          ID/PW 찾기
        </Link>
      </div>
    </Box>
  );
}
