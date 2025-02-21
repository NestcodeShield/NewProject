import { useState } from 'react'
import './App.css'
import Home from "./pages/Home";
import Announcement from './pages/Announcement';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs'; // Импортируем компонент хлебных крошек
import AdsList from "./components/AdsList";
import AdDetails from "./pages/AdDetails";


function App() {


  return (
        
        <Router>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/ads" element={<AdsList />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/ad/:id" element={<AdDetails />} />
         </Routes>
      </Router>

  )
}

export default App
