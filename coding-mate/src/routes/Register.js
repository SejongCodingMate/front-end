import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";

export default function Register() {
  const handleSubmit = (event) => {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id: memberId,
      pw: password,
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
          // console.log(result['data']['studentId']);
          localStorage.setItem("studentId", result["data"]["studentId"]);
          window.location.href = "/studentauth";
        } else if (result["message"] == "이미 존재하는 회원입니다.") {
          window.alert(result["message"]);
        } else {
          window.alert(result["message"]);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const [memberId, setmemberId] = useState("");
  const [password, setpassword] = useState("");

  return (
    <div>
      <Navbar />
      <Container maxWidth="xl">
        <Box
          sx={{ background: "#f5f5f5", padding: "16px", textAlign: "center" }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "red" }}
          >
            이용약관 동의
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "black" }}>
            아래 내용을 모두 읽고 약관에 동의해주세요
          </Typography>
        </Box>
        <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          이용약관
        </Typography>
        <Box
          sx={{
            border: "1px solid black",
            borderRadius: "4px",
            padding: "200px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          이용약관 내용이 여기에 표시됩니다.
        </Box>
        <Box
          sx={{
            border: "1px solid black",
            borderRadius: "4px",
            padding: "30px",
            marginTop: "16px",
            marginBottom: "16px",
            alignItems: "center",
          }}
        >
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                회원 가입
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "black" }}>
                회원가입을 위한 학번과 학사정보 시스템 비밀번호를 입력해주세요.
              </Typography>
              <TextField
                margin="normal"
                label="학번"
                required
                fullWidth
                name="studentId"
                id="studentId"
                autoComplete="studentId"
                // onChange={(e) => setstudentId(e.target.value)}
              />
              <TextField
                margin="normal"
                label="PW"
                type="password"
                required
                fullWidth
                name="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setpassword(e.target.value)}
              />

              <Button
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(event) => handleSubmit(event)}
                // component={Link} to="/pwchange"
              >
                회원가입하기
              </Button>
            </Box>
          </Container>
        </Box>
      </Container>
    </div>
  );
}
