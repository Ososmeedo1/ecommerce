import React from 'react'
import style from './Layout.module.css'
import Navbar from '../Navbar/Navbar'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { Offline } from 'react-detect-offline'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext.jsx'
import { CartContext } from '../../context/CartContext.jsx'

export default function Layout() {
  const { userToken } = useContext(UserContext)
  const { cartCount } = useContext(CartContext)
  const location = useLocation()

  const canShowStickyCart = userToken && location.pathname !== '/cart'

  return <>
    <Navbar />
    <Offline><div className="loading"><h2 className='alert alert-danger fw-bold'>Offline !</h2></div></Offline>
    <Outlet></Outlet>
    {canShowStickyCart ?
      <Link to='/cart' className={style.stickyCartBtn}>
        <span>Cart</span>
        <span className={style.stickyCount}>{cartCount || 0}</span>
      </Link>
      : null}
    <Footer />
  </>
}
