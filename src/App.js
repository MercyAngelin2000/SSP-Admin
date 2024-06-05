import React from 'react'
import Defaultlayout from './layout/DefaultLayout';
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import Login from './views/login/Login';
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Defaultlayout />}>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;