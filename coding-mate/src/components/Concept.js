import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const linkStyle = {
  textDecoration: "none", // Remove underline
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
      {" "}
      <Box
        sx={{
          width: 1024,
          height: 540,
          backgroundColor: "#F8F8F8",
          border: "1px solid #B9B9B9",
          marginRight: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          개념
        </Typography>
      </Box>
    </div>
  );
}
