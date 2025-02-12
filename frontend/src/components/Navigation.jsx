import { useState } from 'react'
import './Navigation.css'

function Navigation() {


  return (
    <>
      <div className="Navigation">
        <nav>
          <img></img>
          <button>Категории</button>
          <label>
            <input type="search" placeholder='Поиск по названию'></input>
            <button>Найти</button>
          </label>
        </nav>
      </div>
    </>
  )
}

export default Navigation