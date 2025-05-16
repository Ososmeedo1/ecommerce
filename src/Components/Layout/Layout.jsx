import React from 'react'
import style from './Layout.module.css'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { Offline } from 'react-detect-offline'

export default function Layout() {
  return <>
    <Navbar />
    <Offline><div className="loading"><h2 className='alert alert-danger fw-bold'>Offline !</h2></div></Offline>
    <Outlet></Outlet>
  </>
}
