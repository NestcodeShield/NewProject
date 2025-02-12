import { useState } from 'react'
import './Header.css'
import Navigation from "./Navigation";
import Links from "./Links";

function Header() {


  return (
    <>
      <div className="Header">
        <Links />
        <Navigation />
      </div>
    </>
  )
}

export default Header