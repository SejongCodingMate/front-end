import React, { useState } from "react";
import Modal from "react-modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Navbar from "../Navbar";

// Modal.setAppElement(document.getElementById('studentAuth'));

function PasswordChange() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const studentId = localStorage.getItem("studentId");

  const handleChangePassword = (event) => {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id: studentId,
      pw: confirmPassword,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://3.37.164.99/api/member/password", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        return result;
      })
      .then((result) => {
        if (result["message"] == "비밀번호가 변경되었습니다.") {
          localStorage.setItem("password", confirmPassword);
          window.alert(result["message"]);

          window.location.href = "/login";
        } else {
          window.alert("사용자가 존재하지 않습니다.");
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <Navbar></Navbar>
      <Container maxWidth="xl">
        <Box
          sx={{ background: "#f5f5f5", padding: "16px", textAlign: "center" }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "red" }}
          >
            비밀번호 변경하기
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "black" }}>
            보안을 위해 비밀번호를 변경해주세요.
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid black",
            borderRadius: "4px",
            padding: "30px",
            marginTop: "150px",
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
              <TextField
                margin="normal"
                label="새로운 비밀번호"
                type="password"
                required
                fullWidth
                name="newPassword"
                id="newPassword"
                autoComplete="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                label="새로운 비밀번호 확인"
                type="password"
                required
                fullWidth
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleChangePassword}
              >
                변경하기
              </Button>
            </Box>
          </Container>
        </Box>
      </Container>
    </div>
  );
}

export default PasswordChange;
