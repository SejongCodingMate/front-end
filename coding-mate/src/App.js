import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import PwChange from "./routes/PwChange";
import Main from "./routes/Main";
import Quiz from "./routes/Quiz";
import Posting from "./routes/Posting";
import Guide from "./routes/Guide";
import Story from "./routes/Story";
import Code from "./routes/Code";
import "./App.css";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="pwchange" element={<PwChange />} />
          <Route path="main" element={<Story />} />
          <Route path="/code" element={<Code />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/posting" element={<Posting />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
