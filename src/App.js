import React from 'react'
import Defaultlayout from './layout/DefaultLayout';
import { Routes, Route ,Navigate, HashRouter} from "react-router-dom";
import Login from './views/login/Login';
function App() {
  return (
    <div>
      <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Defaultlayout />}>
        </Route>
      </Routes>
    </HashRouter>
    </div>
  );
}

export default App;