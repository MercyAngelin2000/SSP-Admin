import React from 'react'
import Defaultlayout from './layout/DefaultLayout';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './views/Login';
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Defaultlayout />}>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;