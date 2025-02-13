import { useState } from 'react'
import './Announcement.css'
import Header from "../components/Header";
import Breadcrumbs from '../components/Breadcrumbs';
import DynamicForm from '../components/DynamicForm'

function Announcement() {

  return (
    <>
      <div className="Announcement">
        <Header />
        <Breadcrumbs />
        <DynamicForm />
      </div>
    </>
  )
}

export default Announcement