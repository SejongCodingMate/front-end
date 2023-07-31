import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Login from './Login';
import Categories from './Categories';
import Register from './Register';
import PwSearch from './PwSearch';

export default function App() {

  return (
    <main className="App">
      <Login />
      {/* <Register/> */}
      {/* <PwSearch/> */}
    </main>
  
  );
}
