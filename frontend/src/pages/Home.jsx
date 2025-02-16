import { useState } from 'react'
import './Home.css'
import Header from "../components/Header";

function Home() {

  return (
    <>
      <div className="Home">
        <Header />
        <AdsList />
      </div>
    </>
  )
}

export default Home