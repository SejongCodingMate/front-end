import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import PwChange from "./routes/PwChange";
import Main from "./routes/Main";
import SelectPage from "./routes/SelectPage";
import Posting from "./routes/Posting";
import Guide from "./routes/Guide";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="pwchange" element={<PwChange />} />
          <Route path="/main" element={<Main />} />
          <Route path="/selectpage" element={<SelectPage />} />
          <Route path="/posting" element={<Posting />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
