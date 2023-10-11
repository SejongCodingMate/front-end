import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Quiz from "./routes/Quiz";
import Story from "./routes/Story";
import Code from "./routes/Code";
import "./App.css";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="main" element={<Story />} />
          <Route path="/code" element={<Code />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}