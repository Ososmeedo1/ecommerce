import React, { useContext, useEffect, useRef, useState } from 'react'
import style from './ProductDetails.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'
import Slider from 'react-slick'
import { CartContext } from '../../context/CartContext'
import { WishListContext } from '../../context/WishListContext'
import toast from 'react-hot-toast'
import { UserContext } from '../../context/UserContext.jsx'
import { extractApiMessage, getFriendlyActionErrorMessage, isSuccessResponse, isUnauthorizedError } from '../../utils/api.js'
import { trackEvent } from '../../utils/analytics.js'
import { handleImageFallback } from '../../utils/images.js'
import { setPageMeta } from '../../utils/seo.js'
import { shouldRequireLogin } from '../../utils/routes.js'
import { fetchProductDetails, fetchProductReviews, fetchReviews } from '../../services/storeApi.js'

export default function ProductDetails() {

  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [detailsError, setDetailsError] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [addingCart, setAddingCart] = useState(false)
  const [addingWish, setAddingWish] = useState(false)
  const [isInWishList, setIsInWishList] = useState(false)
  const actionLocksRef = useRef(new Set())

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  }

  let { addToCart } = useContext(CartContext);
  let { addToWishList, deleteWishListItems, getWishListItems } = useContext(WishListContext);
  const { userToken } = useContext(UserContext)

  function requireLogin() {
    setShowLoginPrompt(true)
  }

  function closeLoginPrompt() {
    setShowLoginPrompt(false)
  }

  function goToLogin() {
    setShowLoginPrompt(false)
    const redirectTarget = `/productdetails/${id}${location.search || ''}`
    navigate(`/login?redirect=${encodeURIComponent(redirectTarget)}`)
  }

  async function getProductDetails(id) {
    setLoading(true)
    setDetailsError('')
    const response = await fetchProductDetails(id)
    if (!response?.data?.data) {
      setDetailsError(extractApiMessage(response, 'Unable to load product details. Please try again.'))
      setLoading(false)
      return
    }

    const { data } = response
    setDetails(data.data)
    setPageMeta({
      title: `${data.data.title} | Fresh Cart`,
      description: data.data.description,
      image: data.data.imageCover
    })
    setLoading(false);
  }

  async function withProtectedAction({ productId, actionKey, pendingSetter, actionFn, actionLabel, successEvent, onSuccess }) {
    if (shouldRequireLogin(userToken)) {
      requireLogin()
      return
    }

    if (actionLocksRef.current.has(actionKey)) {
      return
    }

    actionLocksRef.current.add(actionKey)
    pendingSetter(true)

    const response = await actionFn()
    if (isSuccessResponse(response)) {
      toast.success(response.data.message)
      if (successEvent) {
        trackEvent(successEvent, { productId, source: 'product_details' })
      }
      if (onSuccess) {
        onSuccess()
      }
      actionLocksRef.current.delete(actionKey)
      pendingSetter(false)
      return
    }

    if (isUnauthorizedError(response)) {
      requireLogin()
    }

    toast.error(getFriendlyActionErrorMessage(response, actionLabel))
    actionLocksRef.current.delete(actionKey)
    pendingSetter(false)
  }

  async function getProductReviews(productId) {
    setReviewsLoading(true)
    setReviewsError('')

    const primaryResponse = await fetchProductReviews(productId)

    if (primaryResponse?.data?.data) {
      setReviews(primaryResponse.data.data)
      setReviewsLoading(false)
      return
    }

    const fallbackResponse = await fetchReviews({ product: productId })
    if (fallbackResponse?.data?.data) {
      setReviews(fallbackResponse.data.data)
      setReviewsLoading(false)
      return
    }

    setReviews([])
    setReviewsError(extractApiMessage(primaryResponse, 'Reviews are currently unavailable.'))
    setReviewsLoading(false)
  }

  async function postToCart(id) {
    await withProtectedAction({
      productId: id,
      actionKey: `cart:${id}`,
      pendingSetter: setAddingCart,
      actionFn: () => addToCart(id),
      actionLabel: 'add this product to cart',
      successEvent: 'add_to_cart_success'
    })
  }

  async function postToWishList(id) {
    if (shouldRequireLogin(userToken)) {
      requireLogin()
      return
    }

    if (isInWishList) {
      await withProtectedAction({
        productId: id,
        actionKey: `wish:remove:${id}`,
        pendingSetter: setAddingWish,
        actionFn: () => deleteWishListItems(id),
        actionLabel: 'remove this product from wishlist',
        successEvent: 'remove_from_wishlist_success',
        onSuccess: () => setIsInWishList(false)
      })
      return
    }

    await withProtectedAction({
      productId: id,
      actionKey: `wish:add:${id}`,
      pendingSetter: setAddingWish,
      actionFn: () => addToWishList(id),
      actionLabel: 'add this product to wishlist',
      successEvent: 'add_to_wishlist_success',
      onSuccess: () => setIsInWishList(true)
    })
  }

  async function syncWishListState() {
    if (shouldRequireLogin(userToken)) {
      setIsInWishList(false)
      return
    }

    const response = await getWishListItems()
    if (!response?.data?.data) {
      setIsInWishList(false)
      return
    }
    const wishListItems = response?.data?.data || []
    const existsInWishList = wishListItems.some((item) => item?._id === id)
    setIsInWishList(existsInWishList)
  }

  useEffect(() => {
    getProductDetails(id)
    getProductReviews(id)
    syncWishListState()
  }, [id, userToken])

  return <>

    {showLoginPrompt ?
      <div className={style.promptOverlay}>
        <div className={style.promptCard}>
          <h3 className='fw-bold mb-3'>Login Required</h3>
          <p className='mb-4'>Please login first to continue with cart or wishlist actions.</p>
          <div className='d-flex gap-3 justify-content-center'>
            <button className='btn btn-success px-4' onClick={goToLogin}>Login</button>
            <button className='btn btn-outline-secondary px-4' onClick={closeLoginPrompt}>Stay here</button>
          </div>
        </div>
      </div>
      : null}

    {loading ? <div className="loading">
      <PulseLoader color="#63AF18" size={15} />
    </div> : detailsError ? <div className={`container mt-5 ${style.errorState}`}>
      <h3 className='h5 fw-semibold mb-2'>Could not load product details</h3>
      <p className='mb-3'>{detailsError}</p>
      <button className='btn btn-success' onClick={() => getProductDetails(id)}>Retry</button>
    </div> :
      <main className="main container px-4 mx-auto overflow-hidden">
        <div className="px-4 py-5 mt-5">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="slider-imgs">
                <Slider {...settings}>
                  {(details.images || []).map((image, imageIndex) => <img src={image} alt={details.title} className='w-100' key={`${details.id}-${imageIndex}`} loading='lazy' onError={handleImageFallback} />)}
                </Slider>
              </div>
            </div>
            <div className="col-md-8">
              <div className="details py-5 ps-5 fs-3">
                <h3 className='mainFont fw-semibold'>{details.title}</h3>
                <p className='py-3 fs-5'>{details.description}</p>
                <span className='font-sm text-main'>{details.category?.name}</span>
                <div className="d-flex py-3 justify-content-between align-items-center">
                  <span className='font-sm fw-bold'>{details.price} EGP</span>
                  <span className='font-sm fw-bold'>
                    <i className='fas fa-star rating-color me-1'></i>
                    {details.ratingsAverage}
                  </span>
                  <span>
                    <button
                      type='button'
                      className='btn p-0 border-0 bg-transparent cursor-pointer'
                      onClick={() => { postToWishList(id) }}
                      disabled={addingWish || addingCart}
                      aria-busy={addingWish}
                      aria-label={isInWishList ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <i className={`${addingWish ? 'fas fa-spinner fa-spin' : `${isInWishList ? 'fas' : 'far'} fa-heart`} text-danger fs-4`}></i>
                    </button>
                  </span>
                </div>
                <div className="test d-flex justify-content-center align-items-center">
                  <button className='siteBtn btn text-light w-100' onClick={() => { postToCart(id) }} disabled={addingCart || addingWish} aria-busy={addingCart}>{addingCart ? 'Adding...' : 'Add to cart'}</button>
                </div>
              </div>
            </div>
          </div>

          <section className={style.reviewsSection}>
            <h3 className='h4 secondary-font fw-semibold mb-3'>Customer Reviews</h3>

            {reviewsLoading ? <div className='py-2'>
              <PulseLoader color="#63AF18" size={10} />
            </div> : reviewsError ? <div className={style.reviewsState}>
              <p className='mb-0'>{reviewsError}</p>
            </div> : reviews.length === 0 ? <div className={style.reviewsState}>
              <p className='mb-0'>No reviews yet for this product.</p>
            </div> : <div className='row g-3'>
              {reviews.slice(0, 6).map((review) => <div className='col-md-6' key={review?._id || `${review?.user?.name}-${review?.createdAt}`}>
                <article className={style.reviewCard}>
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h4 className='h6 fw-semibold mb-0'>{review?.user?.name || 'Customer'}</h4>
                    <span className={style.reviewRating}>
                      <i className='fas fa-star rating-color me-1'></i>
                      {review?.ratings ?? 0}
                    </span>
                  </div>
                  <p className='mb-0'>{review?.title || 'No review text provided.'}</p>
                </article>
              </div>)}
            </div>}
          </section>
        </div>
      </main>
    }
  </>
}

// onClick={() => postToWishList(details.id)}
//  onClick={() => postToCart(details.id)}
