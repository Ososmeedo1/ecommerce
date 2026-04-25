import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CartContext } from '../../context/CartContext.jsx'
import { WishListContext } from '../../context/WishListContext.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import style from './Products.module.css'
import { extractApiMessage, getFriendlyActionErrorMessage, isSuccessResponse, isUnauthorizedError } from '../../utils/api.js'
import { trackEvent } from '../../utils/analytics.js'
import { handleImageFallback } from '../../utils/images.js'
import { setPageMeta } from '../../utils/seo.js'
import { shouldRequireLogin } from '../../utils/routes.js'
import { fetchProducts } from '../../services/storeApi.js'

export default function Products() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [pendingCartId, setPendingCartId] = useState(null)
  const [pendingWishId, setPendingWishId] = useState(null)
  const pendingActionKeysRef = useRef(new Set())
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
    setProductsError('')

    const params = categoryId ? { 'category[in]': categoryId } : undefined
    const response = await fetchProducts(params)

    if (response?.data?.data) {
      setProducts(response.data.data)
    } else {
      setProducts([])
      setProductsError(extractApiMessage(response, 'Unable to load products right now. Please try again.'))
    }

    setLoading(false)
  }

  async function runProtectedAction({ id, actionFn, setPendingId, actionLabel, successEvent }) {
    if (shouldRequireLogin(userToken)) {
      requireLogin()
      return
    }

    const actionKey = `${actionLabel}:${id}`
    if (pendingActionKeysRef.current.has(actionKey)) {
      return
    }

    pendingActionKeysRef.current.add(actionKey)
    setPendingId(id)

    const response = await actionFn(id)
    const isSuccess = isSuccessResponse(response)

    if (isSuccess) {
      toast.success(response.data.message)
      trackEvent(successEvent, { productId: id, source: 'products_page' })
      pendingActionKeysRef.current.delete(actionKey)
      setPendingId(null)
      return
    }

    const message = getFriendlyActionErrorMessage(response, actionLabel)
    if (isUnauthorizedError(response)) {
      requireLogin()
    }

    toast.error(message)
    trackEvent('product_action_failed', { productId: id, action: actionLabel })
    pendingActionKeysRef.current.delete(actionKey)
    setPendingId(null)
  }

  async function postToCart(id) {
    await runProtectedAction({
      id,
      actionFn: addToCart,
      setPendingId: setPendingCartId,
      actionLabel: 'add this product to cart',
      successEvent: 'add_to_cart_success'
    })
  }

  async function postToWishList(id) {
    await runProtectedAction({
      id,
      actionFn: addToWishList,
      setPendingId: setPendingWishId,
      actionLabel: 'add this product to wishlist',
      successEvent: 'add_to_wishlist_success'
    })
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

  const heading = selectedCategoryName ? `${selectedCategoryName} Products` : 'All Products'


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
      <div className={style.productsHeader}>
        <h2 className='fw-bold my-2 secondary-font'>{heading}</h2>
        {!loading && !productsError ? <p className={style.productsMeta}>{filteredProducts.length} products available</p> : null}
      </div>

      {loading ?
        <div className="row gy-4">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className='col-md-3'>
            <div className={style.skeletonCard}></div>
          </div>)}
        </div> : productsError ?
          <div className={style.errorState} role='alert'>
            <h3 className='h5 fw-semibold mb-2'>Could not load products</h3>
            <p className='mb-3'>{productsError}</p>
            <button className='btn btn-success px-4' onClick={() => getProducts(selectedCategoryId)}>Retry</button>
          </div>
          : filteredProducts.length === 0 ?
            <div className={style.emptyState}>
              <h3 className='h5 fw-semibold mb-2'>No products found</h3>
              <p className='mb-0'>Try another category or check back again later.</p>
            </div>
            :
            <div className="row gy-4">
              {filteredProducts.map(product => <div key={product.id} className='col-md-3'>
                <div className={`product p-2 rounded-2 shadow-sm ${style.productCard}`}>
                  <Link to={`/productdetails/${product.id}`} onClick={() => trackEvent('product_opened', { productId: product.id, source: 'products_page' })}>
                    <img src={product.imageCover} className={`w-100 rounded-2 ${style.productImage}`} alt={product.title} loading='lazy' onError={handleImageFallback} />
                    <span className={`font-sm text-main ${style.categoryBadge}`}>{product.category.name}</span>
                    <h3 className='h5'>{product.title.split(' ').splice(0, 2).join(' ')}</h3>
                    <div className={`d-flex py-3 justify-content-between align-items-center ${style.productInfoRow}`}>
                      <span className="font-sm">{product.price} EGP</span>
                      <span className={`font-sm ${style.ratingChip}`}>
                        <i className='fas fa-star rating-color me-1'></i>
                        {product.ratingsAverage}
                      </span>
                    </div>
                  </Link>

                  <div className="product-footer d-flex flex-column justify-content-between align-items-center">
                    <button className='btn addToCart w-100' onClick={() => postToCart(product.id)} disabled={pendingCartId === product.id || pendingWishId === product.id} aria-busy={pendingCartId === product.id}>
                      {pendingCartId === product.id ? 'Adding...' : 'Add to cart'}
                    </button>
                    <button className='btn addToWishList w-100 mt-3' onClick={() => { postToWishList(product.id) }} disabled={pendingCartId === product.id || pendingWishId === product.id} aria-busy={pendingWishId === product.id}>
                      {pendingWishId === product.id ? 'Adding...' : 'Add to wishlist'}
                    </button>
                  </div>
                </div>
              </div>)}
            </div>
      }
    </header>
  </>
}
