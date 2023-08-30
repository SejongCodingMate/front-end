import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const linkStyle = {
  textDecoration: "none", // Remove underline
};

const imageStyle = {
  width: "80px", // Adjust image width
  height: "80px", // Adjust image height
  marginBottom: "10px", // Adjust margin
};

export default function BoxSx() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        backgroundColor: "#F8F8F8",
      }}
    >
      <Link to="/selectpage" style={linkStyle}>
        <Box
          sx={{
            width: 350,
            height: 451,
            backgroundColor: "#F8F8F8",
            border: "1px solid #B9B9B9",
            "&:hover": {
              backgroundColor: "#F8F8F8",
              opacity: [0.9, 0.8, 0.7],
              border: "6px solid #BC0E26",
              cursor: "pointer",
            },
            marginRight: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="../assets/circle.png" // 경로를 적절히 수정해주세요
            alt="과목 선택"
            style={imageStyle}
          />
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "#BC0E26",
              fontSize: "40px",
              fontFamily: "Abhaya Libre SemiBold",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            과목 선택
          </Typography>
          {/* 추가한 텍스트 */}
          <Typography
            variant="body1"
            sx={{
              color: "#333333",
              fontSize: "15px",
              fontFamily: "Almarai",
              fontWeight: 400,
            }}
          >
            가이드라인을 제공하는 페이지
          </Typography>
        </Box>
      </Link>

      <Link to="/posting" style={linkStyle}>
        <Box
          sx={{
            width: 320,
            height: 451,
            backgroundColor: "#F8F8F8",
            border: "1px solid #B9B9B9",
            "&:hover": {
              backgroundColor: "#F8F8F8",
              opacity: [0.9, 0.8, 0.7],
              border: "6px solid #BC0E26",
              cursor: "pointer",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="path_to_your_image.png" // Replace with your image path
            alt="왁자지껄"
            style={imageStyle}
          />
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "#BC0E26",
              fontSize: "40px",
              fontFamily: "Abhaya Libre SemiBold",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            왁자지껄
          </Typography>
          {/* 추가한 텍스트 */}
          <Typography
            variant="body1"
            sx={{
              color: "#333333",
              fontSize: "15px",
              fontFamily: "Almarai",
              fontWeight: 400,
            }}
          >
            질문 + 함께하기 게시판
          </Typography>
        </Box>
      </Link>
    </div>
  );
}
