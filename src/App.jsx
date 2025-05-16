import React, { useContext, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import Home from './Components/Home/Home.jsx'
import Cart from './Components/Cart/Cart.jsx'
import Products from './Components/Products/Products.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import Brands from './Components/Brands/Brands.jsx'
import Categories from './Components/Categories/Categories.jsx'
import ProductDetails from './Components/ProductDetails/ProductDetails.jsx'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx'
import { Toaster } from 'react-hot-toast'
import WishList from './Components/WishList/WishList.jsx'
import { CartContext } from './context/CartContext.jsx'
import { WishListContext } from './context/WishListContext.jsx'
import ShippingAddress from './Components/ShippingAddress/ShippingAddress.jsx'
import { UserContext } from './context/UserContext.jsx'
import ForgotPassword from './Components/ForgotPassword/ForgotPassword.jsx'
import VerifyPassword from './Components/VerifyPassword/VerifyPassword.jsx'
import ResetPassword from './Components/ResetPassword/ResetPassword.jsx'
import NotFound from './Components/NotFound/NotFound.jsx'

export default function App() {

  let { getCartItems, setCartCount } = useContext(CartContext)
  let { getWishListItems, setWishListCount } = useContext(WishListContext)
  let { setUserToken } = useContext(UserContext);

  async function getCartCount() {
    const { data } = await getCartItems();
    setCartCount(data.numOfCartItems);
  }

  async function getWishListCount() {
    const { data } = await getWishListItems();
    setWishListCount(data.count);

  }



  const routers = createBrowserRouter([
    {
      path: '/', element: <Layout />, children: [
        { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'brands', element: <ProtectedRoute><Brands /></ProtectedRoute> },
        { path: 'categories', element: <ProtectedRoute><Categories /></ProtectedRoute> },
        { path: 'productdetails/:id', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
        { path: 'wishlist', element: <ProtectedRoute><WishList /></ProtectedRoute> },
        { path: 'forgotpassword', element: <ForgotPassword /> },
        { path: 'verifycode', element: <VerifyPassword /> },
        { path: 'resetpassword', element: <ResetPassword /> },
        { path: '*', element: <NotFound /> },
        { path: 'shippingaddress/:cartId', element: <ProtectedRoute><ShippingAddress /></ProtectedRoute> }
      ]
    }
  ])

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      setUserToken(localStorage.getItem('userToken'));
      // setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
      getCartCount();
      getWishListCount()
    }

  }, [])

  return <>
    <RouterProvider router={routers}></RouterProvider>
    <Toaster />
  </>
}
