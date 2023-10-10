import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel'; // InputLabel 추가
import { Button } from "@mui/material";
import { BrowserRouter as Router, Link } from 'react-router-dom';

export default function LoginBox() {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
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
          return accessToken;
        } else {
          throw new Error("access token을 받지 못했습니다.");
        }
      })
      .then((accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("password", password);
        window.alert("로그인에 성공하였습니다.");
        window.location.href = "/main";
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        window.alert("회원이 없거나 비밀번호가 틀렸습니다.");
      });
  };

  const handleRegister = (event) => {
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

    fetch("http://3.37.164.99/api/member/sign-up", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        return result;
      })
      .then((result) => {
        if (
          result["message"] ==
          "회원 가입에 성공했습니다."
        ) {
          window.alert(result["message"]);
          localStorage.setItem("memberId", result["data"]["memberId"]);
        } else if (result["message"] == "이미 존재하는 회원입니다.") {
          window.alert(result["message"]);
        } else {
          window.alert(result["message"]);
        }
      })
      .catch((error) => console.log("error", error));
  }

  
  const [memberId, setmemberId] = useState("");
  const [password, setpassword] = useState("");

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography 
        variant='h3'
        color="#FFFFFF" 
        fontSize='40px'
        fontWeight="400"
        fontFamily="D2Coding"
        textAlign="center"
      >
        Hello world!<br />welcome to ‘AI-escape’
      </Typography>

      {/* ID 입력 필드 */}
      <InputLabel htmlFor="studentId" sx={{ color: '#FFD60A', width: '20vw' }}>
        ID
      </InputLabel>
      <TextField
        margin="normal"
        required
        name="studentId"
        id="studentId"
        autoComplete="studentId"
        onChange={(e) => setmemberId(e.target.value)}
        variant="standard"
        sx={{ 
          mt: 1,
          border: "1px solid #FFF",
          width: '20vw',
          height: '6vh',
          '& input': {
            color: '#FFF', // 입력 텍스트 색상 변경
          },
         }}
         onKeyPress={handleKeyPress} // Enter 키 이벤트 처리
      />

      {/* PW 입력 필드 */}
      <InputLabel htmlFor="password" sx={{ color: '#FFD60A', width: '20vw', mt: 1 }}>
        PW
      </InputLabel>
      <TextField
        margin="normal"
        type="password"
        required
        name="password"
        id="password"
        autoComplete="current-password"
        onChange={(e) => setpassword(e.target.value)}
        variant="standard"
        sx={{ 
          mt: 1,
          border: "1px solid #FFF",
          width: '20vw',
          height: '6vh',
          '& input': {
            color: '#FFF', 
          },
        }}
        onKeyPress={handleKeyPress}
      />
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '1rem', gap: 50 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#000',
            color: '#FF9F0A',
            marginRight: '16%',
            '&:hover': {
              backgroundColor: '#000', 
            },
          }}
          onClick={(event) => handleRegister(event)}
        >
          회원가입
        </Button>
        <Link to="/studentauth" style={{ textDecoration: 'none', color: '#FF9F0A' }}>
          ID/PW 찾기
        </Link>
      </div>
    </Box>
  );
}