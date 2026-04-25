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
import { shouldRequireLogin } from './utils/routes.js'
import { isUnauthorizedError } from './utils/api.js'

export default function App() {

  let { getCartItems, setCartCount } = useContext(CartContext)
  let { getWishListItems, setWishListCount } = useContext(WishListContext)
  let { setUserToken } = useContext(UserContext);

  async function getCartCount() {
    const response = await getCartItems()

    const itemsCount = response?.data?.numOfCartItems
      ?? response?.data?.data?.products?.length
      ?? response?.data?.cart?.products?.length

    if (itemsCount !== undefined) {
      setCartCount(itemsCount)
      return
    }

    if (isUnauthorizedError(response)) {
      localStorage.removeItem('userToken')
      setUserToken(null)
    }

    setCartCount(0)
  }

  async function getWishListCount() {
    const response = await getWishListItems()

    if (response?.data?.count !== undefined) {
      setWishListCount(response.data.count)
      return
    }

    if (isUnauthorizedError(response)) {
      localStorage.removeItem('userToken')
      setUserToken(null)
    }

    setWishListCount(0)

  }



  const routers = createBrowserRouter([
    {
      path: '/', element: <Layout />, children: [
        { index: true, element: <Home /> },
        { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: 'products', element: <Products /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'brands', element: <Brands /> },
        { path: 'categories', element: <Categories /> },
        { path: 'productdetails/:id', element: <ProductDetails /> },
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
    const storedToken = localStorage.getItem('userToken')

    if (storedToken && !shouldRequireLogin(storedToken)) {
      setUserToken(storedToken);
      // setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
      getCartCount()
      getWishListCount()
      return
    }

    localStorage.removeItem('userToken')
    setUserToken(null)

  }, [])

  return <>
    <RouterProvider router={routers}></RouterProvider>
    <Toaster />
  </>
}
