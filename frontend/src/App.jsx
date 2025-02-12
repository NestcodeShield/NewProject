import { useState } from 'react'
import './App.css'
import Home from "./pages/Home";
import Announcement from './pages/Announcement';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs'; // Импортируем компонент хлебных крошек


function App() {


  return (
        
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/announcement" element={<Announcement />} />
          </Routes>
        </Router>

  )
}

export default App
