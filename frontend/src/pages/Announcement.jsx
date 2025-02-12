import { useState } from 'react'
import './Announcement.css'
import Header from "../components/Header";
import Breadcrumbs from '../components/Breadcrumbs';

function Announcement() {

  return (
    <>
      <div className="Announcement">
        <Breadcrumbs />
        <Header />
      </div>
    </>
  )
}

export default Announcement