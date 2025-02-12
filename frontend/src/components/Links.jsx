import { useState } from 'react'
import './Links.css'
import { Link } from 'react-router-dom';

function Links() {


  return (
    <>
      <div className="Links">
        <div className='container'>
          <ul className="information">
            <li>Пункт 1</li>
            <li>Пункт 2</li>
            <li>Пункт 3</li>
          </ul>
          <div className='buttons'>
            <button className='log'>Вход | Регистрация</button>
            <button className='announcement'>
            <Link to="/announcement">Создать объявление</Link></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Links