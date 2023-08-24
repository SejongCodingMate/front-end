import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

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
      <Link to="/selectpage">
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
          <Typography variant="h6" gutterBottom sx={{ color: "#BC0E26" }}>
            과목 선택
          </Typography>
        </Box>
      </Link>

      <Link to="/posting">
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
          <Typography variant="h6" gutterBottom sx={{ color: "#BC0E26" }}>
            {/* "왁자지껄" 텍스트의 색을 변경합니다 */}
            왁자지껄
          </Typography>
        </Box>
      </Link>
    </div>
  );
}
