import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function PwBox() {
    const [memberId, setmemberId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 마운트될 때 localStorage에서 memberId 값을 읽어옵니다.
        const storedMemberId = localStorage.getItem("memberId");
        console.log(storedMemberId);
        if (storedMemberId) {
          setmemberId(storedMemberId);
        }
      }, []); 

    const handleSendMail = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
          memberId: memberId,
        });
    
        console.log(memberId);
        var requestOptions = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
    
        fetch("http://3.37.164.99/api/member/temporary", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result["message"] == '임시 비밀번호를 발급했습니다. 메일을 확인해주세요.') {
              window.alert(result["message"]);
              navigate('/login');
            } else {
                window.alert(result["message"]);
                return;
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
            variant="standard"
            value={memberId} // memberId 상태를 value로 설정하여 디폴트 값으로 사용
            sx={{
              mt: 1,
              border: "1px solid #FFF",
              "& input": {
                color: "#FFF",
              },
              background: "#000", // 배경색을 #000으로 변경
              width: "70%", // 너비를 늘립니다.
            }}
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
            onClick={handleSendMail}
          >
            메일 전송
          </Button>
        </div>
      </Box>
    </Box>
  );
}