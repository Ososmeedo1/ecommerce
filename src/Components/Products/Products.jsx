import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CartContext } from '../../context/CartContext.jsx'
import { WishListContext } from '../../context/WishListContext.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import style from './Products.module.css'
import { getFriendlyActionErrorMessage, isSuccessResponse, isUnauthorizedError } from '../../utils/api.js'
import { trackEvent } from '../../utils/analytics.js'
import { handleImageFallback } from '../../utils/images.js'
import { setPageMeta } from '../../utils/seo.js'
import { shouldRequireLogin } from '../../utils/routes.js'
import { fetchProducts } from '../../services/storeApi.js'

export default function Products() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [pendingCartId, setPendingCartId] = useState(null)
  const [pendingWishId, setPendingWishId] = useState(null)
  let { addToCart } = useContext(CartContext)
  let { addToWishList } = useContext(WishListContext)
  const { userToken } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const selectedCategoryId = searchParams.get('category')
  const selectedCategoryName = searchParams.get('categoryName')

  function requireLogin() {
    setShowLoginPrompt(true)
    return false
  }

  function closeLoginPrompt() {
    setShowLoginPrompt(false)
  }

  function goToLogin() {
    setShowLoginPrompt(false)
    const redirectTarget = `/products${location.search || ''}`
    navigate(`/login?redirect=${encodeURIComponent(redirectTarget)}`)
  }

  async function getProducts(categoryId) {
    setLoading(true)

    const params = categoryId ? { 'category[in]': categoryId } : undefined
    const response = await fetchProducts(params)

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
      trackEvent('add_to_cart_success', { productId: id, source: 'products_page' })
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
      trackEvent('add_to_wishlist_success', { productId: id, source: 'products_page' })
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
    getProducts(selectedCategoryId)
  }, [selectedCategoryId])

  useEffect(() => {
    const title = selectedCategoryName ? `${selectedCategoryName} Products | Fresh Cart` : 'All Products | Fresh Cart'
    const description = selectedCategoryName
      ? `Browse ${selectedCategoryName} products and add your favorites to cart or wishlist.`
      : 'Browse all Fresh Cart products and discover your next purchase.'

    setPageMeta({ title, description })
  }, [selectedCategoryName])

  const excludedTitles = ["Logo T-Shirt", "Woman Karma", "Victus 16-D1016Ne", "Essentials Embroidered", "Adicolor Classics", "Slim Fit", "Relaxed Fit", "ESS Big", "Sportswear Club", "Court Tennis", "Crew Neck", "Standard Pattern", "Polo Collar"];

  const filteredProducts = selectedCategoryId
    ? products
    : products.filter(product =>
      !excludedTitles.includes(product.title.split(" ").splice(0, 2).join(" "))
    )


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

    <header className='container pt-4'>
      <h2 className='fw-bold my-3 secondary-font'>{selectedCategoryName ? `${selectedCategoryName} Products` : 'All Products'}</h2>
      {loading ?
        <div className="row gy-4">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className='col-md-3'>
            <div className={style.skeletonCard}></div>
          </div>)}
        </div> :
        filteredProducts.length === 0 ?
          <div className='alert alert-warning'>No products found for this category.</div>
          :
          <div className="row gy-4">
            {filteredProducts.map(product => <div key={product.id} className='col-md-3'>
              <div className="product p-2 rounded-2 shadow">
                <Link to={`/productdetails/${product.id}`} onClick={() => trackEvent('product_opened', { productId: product.id, source: 'products_page' })}>
                  <img src={product.imageCover} className='w-100 rounded-2' alt={product.title} loading='lazy' onError={handleImageFallback} />
                  <span className='font-sm text-main'>{product.category.name}</span>
                  <h3 className='h5'>{product.title.split(' ').splice(0, 2).join(' ')}</h3>
                  <div className="d-flex py-3 justify-content-between align-items-center">
                    <span className="font-sm">{product.price} EGP</span>
                    <span className='font-sm'>
                      <i className='fas fa-star rating-color me-1'></i>
                      {product.ratingsAverage}
                    </span>
                  </div>
                </Link>

                <div className="product-footer d-flex flex-column justify-content-between align-items-center">
                  <button className='btn addToCart w-100' onClick={() => postToCart(product.id)} disabled={pendingCartId === product.id || pendingWishId === product.id}>
                    {pendingCartId === product.id ? 'Adding...' : 'Add to cart'}
                  </button>
                  <button className='btn addToWishList w-100 mt-3' onClick={() => { postToWishList(product.id) }} disabled={pendingCartId === product.id || pendingWishId === product.id}>
                    {pendingWishId === product.id ? 'Adding...' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>)}
          </div>
      }
    </header>
  </>
}
