import React, { useContext, useEffect, useState } from 'react'
import style from './HomeProducts.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext.jsx'
import toast from 'react-hot-toast'
import { WishListContext } from '../../context/WishListContext.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import { getFriendlyActionErrorMessage, isSuccessResponse, isUnauthorizedError } from '../../utils/api.js'
import { trackEvent } from '../../utils/analytics.js'
import { handleImageFallback } from '../../utils/images.js'
import { shouldRequireLogin } from '../../utils/routes.js'
import { fetchProducts } from '../../services/storeApi.js'

export default function HomeProducts() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [pendingCartId, setPendingCartId] = useState(null)
  const [pendingWishId, setPendingWishId] = useState(null)
  let { addToCart } = useContext(CartContext)
  let { addToWishList } = useContext(WishListContext)
  const { userToken } = useContext(UserContext)
  const navigate = useNavigate()

  function requireLogin() {
    setShowLoginPrompt(true)
    return false
  }

  function closeLoginPrompt() {
    setShowLoginPrompt(false)
  }

  function goToLogin() {
    setShowLoginPrompt(false)
    navigate('/login?redirect=/')
  }

  async function getProducts() {
    const response = await fetchProducts()
    if (response?.data?.data) {
      setProducts(response.data.data)
    }
    setLoading(false)
  }

  async function postToCart(id) {
    if (shouldRequireLogin(userToken)) {
      requireLogin()
      return
    }

    setPendingCartId(id)

    const response = await addToCart(id)
    const isSuccess = isSuccessResponse(response)

    if (isSuccess) {
      toast.success(response.data.message)
      trackEvent('add_to_cart_success', { productId: id, source: 'home_products' })
      setPendingCartId(null)
      return
    }

    const message = getFriendlyActionErrorMessage(response, 'add this product to cart')
    if (isUnauthorizedError(response)) {
      requireLogin()
    }
    toast.error(message)
    setPendingCartId(null)
  }

  async function postToWishList(id) {
    if (shouldRequireLogin(userToken)) {
      requireLogin()
      return
    }

    setPendingWishId(id)

    const response = await addToWishList(id)
    const isSuccess = isSuccessResponse(response)

    if (isSuccess) {
      toast.success(response.data.message)
      trackEvent('add_to_wishlist_success', { productId: id, source: 'home_products' })
      setPendingWishId(null)
      return
    }

    const message = getFriendlyActionErrorMessage(response, 'add this product to wishlist')
    if (isUnauthorizedError(response)) {
      requireLogin()
    }
    toast.error(message)
    setPendingWishId(null)
  }





  useEffect(() => {
    getProducts();
  }, [])

  const excludedTitles = ["Logo T-Shirt", "Woman Karma", "Victus 16-D1016Ne", "Essentials Embroidered", "Adicolor Classics", "Slim Fit", "Relaxed Fit", "ESS Big", "Sportswear Club", "Court Tennis", "Crew Neck", "Standard Pattern", "Polo Collar"];

  const filteredProducts = products.filter(product =>
    !excludedTitles.includes(product.title.split(" ").splice(0, 2).join(" "))
  );


  return <>
    {showLoginPrompt ?
      <div className={style.promptOverlay}>
        <div className={style.promptCard}>
          <h3 className='fw-bold mb-3'>Login Required</h3>
          <p className='mb-4'>You must login first to add items to your cart or wishlist.</p>
          <div className='d-flex gap-3 justify-content-center'>
            <button className='btn btn-success px-4' onClick={goToLogin}>Login</button>
            <button className='btn btn-outline-secondary px-4' onClick={closeLoginPrompt}>Stay here</button>
          </div>
        </div>
      </div>
      : null}

    <header>
      <h2 className='fw-bold my-3 secondary-font'>Home Products</h2>
      {loading ?
        <div className="row gy-4 mb-3">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className='col-md-3'>
            <div className={style.skeletonCard}></div>
          </div>)}
        </div> :
        <div className="row gy-4 mb-3">
          {filteredProducts.map(product => <div key={product.id} className='col-md-3'>
            <div className="product p-2 rounded-2 shadow">
              <Link to={`/productdetails/${product.id}`} onClick={() => trackEvent('product_opened', { productId: product.id, source: 'home_products' })}>
                <img src={product.imageCover} className='w-100 rounded-2' alt={product.title} loading='lazy' onError={handleImageFallback} />
                <span className='font-sm text-main'>{product.category.name}</span>
                <h3 className='h5'>{product.title.split(' ').splice(0, 2).join(' ')}</h3>
                <div className="d-flex py-3 justify-content-between align-items-center">
                  <span className="font-sm fw-semibold">{product.price} EGP</span>
                  <span className='font-sm'>
                    <i className='fas fa-star rating-color me-1'></i>
                    {product.ratingsAverage}
                  </span>
                </div>
              </Link>

              <div className="product-footer flex-column d-flex justify-content-between align-items-center">
                <button className='addToCart w-100' onClick={() => { postToCart(product.id) }} disabled={pendingCartId === product.id || pendingWishId === product.id}>
                  {pendingCartId === product.id ? 'Adding...' : 'Add to cart'}
                </button>
                <button className='addToWishList  mt-2 w-100' onClick={() => { postToWishList(product.id) }} disabled={pendingCartId === product.id || pendingWishId === product.id}>
                  {pendingWishId === product.id ? 'Adding...' : 'Add to WishList'}
                </button>
              </div>
            </div>
          </div>)}
        </div>
      }
    </header>
  </>
}
