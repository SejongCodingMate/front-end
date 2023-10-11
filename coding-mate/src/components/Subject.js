import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom"; // react-router-dom에서 Link 컴포넌트를 임포트하세요

export default function BoxSx() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Link to="/guide">
        {" "}
        {/* 첫 번째 박스를 누르면 /guide/python 페이지로 이동 */}
        <Box
          sx={{
            width: 753,
            height: 82,
            backgroundColor: "#F8F8F8",
            border: "1px solid #B9B9B9",
            "&:hover": {
              backgroundColor: "#F8F8F8",
              opacity: [0.9, 0.8, 0.7],
              border: "6px solid #BC0E26",
              cursor: "pointer",
            },
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">파이썬 기초 가이드</Typography>
        </Box>
      </Link>

      <Link to="/guide/c-programming">
        {" "}
        {/* 두 번째 박스를 누르면 /guide/c-programming 페이지로 이동 */}
        <Box
          sx={{
            width: 753,
            height: 82,
            backgroundColor: "#F8F8F8",
            border: "1px solid #B9B9B9",
            "&:hover": {
              backgroundColor: "#F8F8F8",
              opacity: [0.9, 0.8, 0.7],
              border: "6px solid #BC0E26",
              cursor: "pointer",
            },
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">C프로그래밍 및 실습</Typography>
        </Box>
      </Link>

      <Link to="/guide/data-structures">
        {" "}
        {/* 세 번째 박스를 누르면 /guide/data-structures 페이지로 이동 */}
        <Box
          sx={{
            width: 753,
            height: 82,
            backgroundColor: "#F8F8F8",
            border: "1px solid #B9B9B9",
            "&:hover": {
              backgroundColor: "#F8F8F8",
              opacity: [0.9, 0.8, 0.7],
              border: "6px solid #BC0E26",
              cursor: "pointer",
            },
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">자료구조 및 실습</Typography>
        </Box>
      </Link>

      <Link to="/guide/algorithms">
        {" "}
        {/* 네 번째 박스를 누르면 /guide/algorithms 페이지로 이동 */}
        <Box
          sx={{
            width: 753,
            height: 82,
            backgroundColor: "#F8F8F8",
            border: "1px solid #B9B9B9",
            "&:hover": {
              backgroundColor: "#F8F8F8",
              opacity: [0.9, 0.8, 0.7],
              border: "6px solid #BC0E26",
              cursor: "pointer",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">알고리즘 및 실습</Typography>
        </Box>
      </Link>
    </div>
  );
}
