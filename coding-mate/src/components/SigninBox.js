import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SigninBox() {
  const [memberId, setmemberId] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Enter 키가 눌렸을 때 로그인 로직을 호출
      handleRegister(event);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 memberId 값을 읽어옵니다.
    const storedMemberId = localStorage.getItem("memberId");
    console.log(storedMemberId);
    if (storedMemberId) {
      setmemberId(storedMemberId);
    }
  }, []);

  const handleRegister = (event) => {
    event.preventDefault();
    if (password != confirmPassword) {
      window.alert("비밀번호가 일치하지 않습니다.");
      window.location.reload();
      return;
    }

    if (password.length < 4) {
      window.alert("비밀번호는 4자리 이상입니다.");
      window.location.reload();
      return;
    }
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
        console.log(result["message"]);
        if (result["message"] == "회원 가입에 성공했습니다.") {
          window.alert(result["message"]);
          navigate("/login");
        } else if (result["message"] == "이미 존재하는 회원입니다.") {
          window.alert(result["message"]);
          navigate("/login");
        } else {
          window.alert(result["message"]);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const GoBack = () => {
    navigate("/");
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
          height: "28%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
            placeholder="NEW PASSWORD" // 이 부분을 추가하여 가이드 라인을 설정
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
              color: "#EEE",
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
            placeholder="PASSWORD AGAIN" // 이 부분을 추가하여 가이드 라인을 설정
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            onClick={GoBack}
          >
            뒤로 가기
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
            onClick={handleRegister}
          >
            회원가입
          </Button>
        </div>
      </Box>
    </Box>
  );
}
