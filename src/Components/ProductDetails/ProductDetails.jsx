import React, { useContext, useEffect, useState } from 'react'
import style from './ProductDetails.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'
import Slider from 'react-slick'
import { CartContext } from '../../context/CartContext'
import { WishListContext } from '../../context/WishListContext'
import toast from 'react-hot-toast'
import { UserContext } from '../../context/UserContext.jsx'
import { getFriendlyActionErrorMessage, isSuccessResponse, isUnauthorizedError } from '../../utils/api.js'
import { trackEvent } from '../../utils/analytics.js'
import { handleImageFallback } from '../../utils/images.js'
import { setPageMeta } from '../../utils/seo.js'
import { shouldRequireLogin } from '../../utils/routes.js'
import { fetchProductDetails } from '../../services/storeApi.js'

export default function ProductDetails() {

  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [addingCart, setAddingCart] = useState(false)
  const [addingWish, setAddingWish] = useState(false)
  const [isInWishList, setIsInWishList] = useState(false)

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
    const response = await fetchProductDetails(id)
    if (!response?.data?.data) {
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

  async function postToCart(id) {
    if (shouldRequireLogin(userToken)) {
      requireLogin()
      return
    }

    setAddingCart(true)

    const response = await addToCart(id)
    const isSuccess = isSuccessResponse(response)

    if (isSuccess) {
      toast.success(response.data.message)
      trackEvent('add_to_cart_success', { productId: id, source: 'product_details' })
      setAddingCart(false)
      return
    }

    if (isUnauthorizedError(response)) {
      requireLogin()
    }

    toast.error(getFriendlyActionErrorMessage(response, 'add this product to cart'))
    setAddingCart(false)
  }

  async function postToWishList(id) {
    if (shouldRequireLogin(userToken)) {
      requireLogin()
      return
    }

    setAddingWish(true)
    if (isInWishList) {
      const response = await deleteWishListItems(id)

      if (isSuccessResponse(response)) {
        toast.success(response.data.message)
        trackEvent('remove_from_wishlist_success', { productId: id, source: 'product_details' })
        setIsInWishList(false)
        setAddingWish(false)
        return
      }

      if (isUnauthorizedError(response)) {
        requireLogin()
      }

      toast.error(getFriendlyActionErrorMessage(response, 'remove this product from wishlist'))
      setAddingWish(false)
      return
    }

    const response = await addToWishList(id)

    if (isSuccessResponse(response)) {
      toast.success(response.data.message)
      trackEvent('add_to_wishlist_success', { productId: id, source: 'product_details' })
      setIsInWishList(true)
      setAddingWish(false)
      return
    }

    if (isUnauthorizedError(response)) {
      requireLogin()
    }

    toast.error(getFriendlyActionErrorMessage(response, 'add this product to wishlist'))
    setAddingWish(false)
  }

  async function syncWishListState() {
    if (shouldRequireLogin(userToken)) {
      setIsInWishList(false)
      return
    }

    const response = await getWishListItems()
    const wishListItems = response?.data?.data || []
    const existsInWishList = wishListItems.some((item) => item?._id === id)
    setIsInWishList(existsInWishList)
  }

  useEffect(() => {
    getProductDetails(id)
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
    </div> :
      <main className="main container px-4 mx-auto overflow-hidden">
        <div className="px-4 py-5 mt-5">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="slider-imgs">
                <Slider {...settings}>
                  {details.images.map((image, imageIndex) => <img src={image} alt={details.title} className='w-100' key={`${details.id}-${imageIndex}`} loading='lazy' onError={handleImageFallback} />)}
                </Slider>
              </div>
            </div>
            <div className="col-md-8">
              <div className="details py-5 ps-5 fs-3">
                <h3 className='mainFont fw-semibold'>{details.title}</h3>
                <p className='py-3 fs-5'>{details.description}</p>
                <span className='font-sm text-main'>{details.category.name}</span>
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
                      aria-label={isInWishList ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <i className={`${addingWish ? 'fas fa-spinner fa-spin' : `${isInWishList ? 'fas' : 'far'} fa-heart`} text-danger fs-4`}></i>
                    </button>
                  </span>
                </div>
                <div className="test d-flex justify-content-center align-items-center">
                  <button className='siteBtn btn text-light w-100' onClick={() => { postToCart(id) }} disabled={addingCart || addingWish}>{addingCart ? 'Adding...' : 'Add To Cart'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    }
  </>
}

// onClick={() => postToWishList(details.id)}
//  onClick={() => postToCart(details.id)}
