import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './routes/Login';
import Categories from './Categories';
import Register from './routes/Register';
import StudentAuth from './routes/StudentAuth';
import PwChange from './routes/PwChange';
import Select from './routes/Select';
import Main from "./routes/Main";
import SelectPage from "./routes/SelectPage";
import Posting from "./routes/Posting";
import Guide from "./routes/Guide";

export default function App() {

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login  />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="studentauth" element={<StudentAuth />} />
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
