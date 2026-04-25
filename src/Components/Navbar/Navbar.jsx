import React, { useContext, useEffect, useRef, useState } from 'react';
import style from './Navbar.module.css';
import logo from './../../assets/freshcart-logo.svg';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { CartContext } from '../../context/CartContext';
import { WishListContext } from '../../context/WishListContext';
import { ThemeContext } from '../../context/ThemeContext.jsx';

export default function Navbar() {



  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  let { userToken, setUserToken } = useContext(UserContext);
  let { cartCount } = useContext(CartContext);
  let { wishListCount } = useContext(WishListContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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

  function closeAllMenus() {
    setIsOpen(false)
    setMenuOpen(false)
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


    <nav className={style.navbarWrap}>
      <div className={`container ${style.navbarInner}`}>
        <Link className={style.brand} to="/" onClick={closeAllMenus}>
          <img src={logo} alt="Fresh Cart" />
        </Link>

        <button className={style.menuToggle} type='button' aria-label='Toggle menu' onClick={() => setMenuOpen((prev) => !prev)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`${style.navMenu} ${menuOpen ? style.navMenuOpen : ''}`}>
          <ul className={style.primaryLinks}>
            {userToken != null ? <>
              <li>
                <NavLink className={({ isActive }) => isActive ? `${style.navLink} ${style.navLinkActive}` : style.navLink} aria-current="page" to="/" onClick={closeAllMenus}>Home</NavLink>
              </li>
              <li>
                <NavLink className={({ isActive }) => isActive ? `${style.navLink} ${style.navLinkActive}` : style.navLink} to="/products" onClick={closeAllMenus}>Products</NavLink>
              </li>
              <li>
                <NavLink className={({ isActive }) => isActive ? `${style.navLink} ${style.navLinkActive}` : style.navLink} to="/categories" onClick={closeAllMenus}>Categories</NavLink>
              </li>
            </> : ''}
          </ul>

          <ul className={style.secondaryLinks}>

            <li className={style.iconItem}>
              <button
                type='button'
                className={`${style.iconLink} ${style.themeToggleBtn}`}
                onClick={toggleTheme}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Light mode' : 'Dark mode'}
              >
                <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
              </button>
            </li>

            {userToken != null ? <>

              <li className={style.iconItem}>
                <Link className={`${style.iconLink} far fa-heart text-color`} to={'wishlist'} onClick={closeAllMenus}><i></i></Link>
                <div className={`${wishListCount ? style.count : ''}`} aria-hidden={!wishListCount}>
                  <span>{wishListCount ? wishListCount : ''}</span>
                </div>
              </li>
              <li className={style.iconItem}>
                <Link className={`${style.iconLink} fas fa-cart-shopping text-color`} to={'cart'} onClick={closeAllMenus}><i></i></Link>
                <div className={`${cartCount ? style.count : ''}`} aria-hidden={!cartCount}>
                  <span>{cartCount ? cartCount : ''}</span>
                </div>
              </li>

              <li className={style.profileArea}>
                <div className='cursor-pointer position-relative d-flex justify-content-center' onClick={() => clickProfile(isOpen)} ref={profileRef}>
                  <div className={`${style.profile}`}>
                    <span className='fw-bold text-light text-uppercase'><i className='fas fa-user'></i></span>
                  </div>
                  <div className={`${style.profileDropList} ${isOpen ? style.profileDropListActive : ''}`}>
                    <div className={`${style.signOut}`} onClick={(e) => { e.stopPropagation(); logOut(); closeAllMenus(); }}>
                      <p>Sign out</p>
                    </div>
                  </div>
                </div>
              </li>
            </> : <>
              <li>
                <NavLink className={({ isActive }) => isActive ? `${style.navLink} ${style.navLinkActive}` : style.navLink} to="/register" onClick={closeAllMenus}>Register</NavLink>
              </li>
              <li>
                <NavLink className={({ isActive }) => isActive ? `${style.navLink} ${style.navLinkActive}` : style.navLink} to="/login" onClick={closeAllMenus}>Login</NavLink>
              </li>
            </>}


          </ul>
        </div>
      </div>
    </nav>
  </>

}
