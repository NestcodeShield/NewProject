import { useState } from 'react'
import './App.css'
import Home from "./pages/Home";
import Announcement from './pages/Announcement';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs'; // Импортируем компонент хлебных крошек
import AdsList from "./components/AdsList";
import AdDetails from "./pages/AdDetails";
import SearchResults from "./pages/SearchResults";
import Profile from './pages/Profile';


function App(

) {


  return (
        
        <Router>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/search" element={<SearchResults />} />
            <Route path="/ads" element={<AdsList />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/ad/:id" element={<AdDetails />} />
            <Route path="/profile" element={<Profile />} />
         </Routes>
      </Router>

  )
}

export default App
