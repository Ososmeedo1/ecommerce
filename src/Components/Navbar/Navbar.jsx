import React, { useContext, useEffect, useRef, useState } from 'react';
import style from './Navbar.module.css';
import logo from './../../assets/freshcart-logo.svg';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { CartContext } from '../../context/CartContext';
import { WishListContext } from '../../context/WishListContext';

export default function Navbar() {



  const [isOpen, setIsOpen] = useState(false);
  let { userToken, setUserToken } = useContext(UserContext);
  let { cartCount } = useContext(CartContext);
  let { wishListCount } = useContext(WishListContext);
  let navigate = useNavigate();



  function logOut() {
    localStorage.removeItem('userToken');
    // localStorage.removeItem('userInfo');
    setUserToken(null);
    navigate('/login');
  }

  function clickProfile(isOpen) {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }

  const profileRef = useRef();
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);



  return <>


    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Fresh Cart"/>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-center">
            {userToken != null ? <>
              <li className="nav-item">
                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} aria-current="page" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/products">Products</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/categories">Categories</NavLink>
              </li>
            </> : ''}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-center">

            {userToken != null ? <>

              <li className='position-relative me-3'>
                <Link className='far fa-heart fs-3 text-color' to={'wishlist'}><i></i></Link>
                <div className={`${wishListCount ? style.count : ''}`}>
                  <span>{wishListCount ? wishListCount : ''}</span>
                </div>
              </li>
              <li className='position-relative me-3'>
                <Link className='fas fa-cart-shopping fs-3 text-color' to={'cart'}><i></i></Link>
                <div className={`${cartCount ? style.count : ''}`}>
                  <span>{cartCount ? cartCount : ''}</span>
                </div>
              </li>
              <li>

              </li>

              <li>
                <div className={`cursor-pointer position-relative d-flex justify-content-center me-2`} onClick={() => clickProfile(isOpen)}>
                  <div className={`${style.profile}`}>
                    <span className='fw-bold text-light text-uppercase'><i className='fas fa-user'></i></span>
                  </div>
                  <div className={`${style.profileDropList} ${isOpen ? style.profileDropListActive : ''}`}>
                    <div className="info w-100 border-2 border-bottom border-success">
                      {/* <p className='text-color'>{userInfo}</p> */}
                    </div>
                    <div className={`${style.signOut} signout pt-3`} ref={profileRef} onClick={(e) => { e.stopPropagation(), logOut() }}>
                      <p>Sign out</p>
                    </div>
                  </div>
                </div>
              </li>
            </> : <>
              <li className="nav-item">
                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/register">Register</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/login">Login</NavLink>
              </li>
            </>}


          </ul>
        </div>
      </div>
    </nav>
  </>

}
