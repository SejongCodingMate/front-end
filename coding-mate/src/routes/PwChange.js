import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Nav from "../components/Nav";

export default function PwChange() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChanged, setPasswordChanged] = useState(false);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    navigate("/login");
    setPasswordChanged(true);
  };

  return (
    <div>
      <Nav />
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
                label="비밀번호 확인"
                type="password"
                required
                fullWidth
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {/* {isPasswordChanged ? (
                <Typography color="success">비밀번호가 변경되었습니다.</Typography>
              ) : ( */}
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

              {/* )} */}
            </Box>
          </Container>
        </Box>
      </Container>
    </div>
  );
}
