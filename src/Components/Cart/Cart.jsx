import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import style from './Cart.module.css'
import { CartContext } from '../../context/CartContext';
import { PulseLoader } from 'react-spinners';
import { setPageMeta } from '../../utils/seo.js';
import toast from 'react-hot-toast';
import { extractApiMessage, getFriendlyActionErrorMessage, isSuccessResponse } from '../../utils/api.js';

export default function Cart() {
  let { getCartItems, deleteCartItems, updateCartItems, clearAllCartItems, applyCoupon } = useContext(CartContext);
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartError, setCartError] = useState('')
  const [pendingProductId, setPendingProductId] = useState(null)
  const [clearingCart, setClearingCart] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  function normalizeCart(responseData) {
    const payload = responseData || {}
    const dataNode = payload?.data?.products ? payload.data : payload?.cart?.products ? payload.cart : payload
    const products = dataNode?.products || []

    return {
      id: dataNode?._id || payload?.cartId || payload?.data?._id || null,
      products,
      totalCartPrice: dataNode?.totalCartPrice || payload?.totalCartPrice || 0,
      numOfCartItems: payload?.numOfCartItems ?? products.length
    }
  }

  async function getItems() {
    setLoading(true)
    setCartError('')
    const response = await getCartItems()

    if (!isSuccessResponse(response) && !response?.data?.data && !response?.data?.cart) {
      setCart(null)
      setCartError(extractApiMessage(response, 'Unable to load your cart right now.'))
      setLoading(false)
      return
    }

    const normalizedCart = normalizeCart(response.data)
    if (normalizedCart.numOfCartItems === 0) {
      setCart(null);
      setLoading(false);
    }
    else {
      setCart(normalizedCart);
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    setPendingProductId(id)
    const response = await deleteCartItems(id)
    if (!isSuccessResponse(response)) {
      toast.error(getFriendlyActionErrorMessage(response, 'remove this product from cart'))
      setPendingProductId(null)
      return
    }

    toast.success(response.data.message)
    await getItems()
    setPendingProductId(null)
  }

  async function updateItem(id, count) {
    setPendingProductId(id)
    if (count < 1) {
      await deleteItem(id);
      setPendingProductId(null)
    } else {
      const response = await updateCartItems(id, count);
      if (!isSuccessResponse(response)) {
        toast.error(getFriendlyActionErrorMessage(response, 'update product quantity'))
        setPendingProductId(null)
        return
      }

      setCart(normalizeCart(response.data));
      setPendingProductId(null)
    }
  }

  async function clearCart() {
    setClearingCart(true)
    const response = await clearAllCartItems();

    if (!isSuccessResponse(response)) {
      toast.error(getFriendlyActionErrorMessage(response, 'clear your cart'))
      setClearingCart(false)
      return
    }

    toast.success(response.data.message)
    setCart(null);
    setClearingCart(false)
  }

  async function applyCouponCode() {
    const code = couponCode.trim()
    if (!code) {
      toast.error('Please enter a coupon code.')
      return
    }

    setApplyingCoupon(true)
    const response = await applyCoupon(code)

    if (!isSuccessResponse(response) && !response?.data?.data && !response?.data?.cart) {
      toast.error(getFriendlyActionErrorMessage(response, 'apply this coupon'))
      setApplyingCoupon(false)
      return
    }

    toast.success(response?.data?.message || 'Coupon applied successfully.')
    setCart(normalizeCart(response.data))
    setApplyingCoupon(false)
  }


  useEffect(() => {
    getItems();
    setPageMeta({
      title: 'Your Cart | Fresh Cart',
      description: 'Review your cart, update quantities, and continue to checkout.'
    })

  }, [])


  return <>


    <div className={`${style.cartColor} p-2 mt-5`}>

      {cart ?
        <div className="cartInfo container">
          <div className="title d-flex justify-content-between">
            <h2 className='secondary-font fw-semibold'>Cart</h2>
            <button className={`${style.clearBtn} btn btn-danger`} onClick={clearCart} disabled={clearingCart} aria-busy={clearingCart}>{clearingCart ? 'Clearing...' : 'Clear all'}</button>
          </div>
          <div className="numbers d-flex justify-content-between py-4 fw-semibold fs-4 text-secondary">
            <p>Total Price: <span className='text-color'>{cart.totalCartPrice} EGP</span></p>
            <p>Total Number: <span className='text-color'>{cart.numOfCartItems}</span></p>
          </div>

          <div className={`${style.couponRow} d-flex gap-2 align-items-center pb-3`}>
            <input
              type='text'
              className='form-control'
              placeholder='Enter coupon code'
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              disabled={applyingCoupon}
            />
            <button className='btn btn-outline-success' type='button' onClick={applyCouponCode} disabled={applyingCoupon || !couponCode.trim()}>
              {applyingCoupon ? 'Applying...' : 'Apply coupon'}
            </button>
          </div>
        </div>
        : ''}



      {loading ? <div className='loading'>
        <PulseLoader color="#63AF18" size={15} />
      </div> : cartError ? <div className={`container ${style.errorState}`}>
        <h3 className='h5 fw-semibold mb-2'>Could not load cart</h3>
        <p className='mb-3'>{cartError}</p>
        <button className='btn btn-success' onClick={getItems}>Retry</button>
      </div> : cart ? <main className='container'>
        {cart.products.map(product => <div key={product.product.id} className="row shadow-sm align-items-center p-2 py-3 border-1 border-bottom m-0">
          <div className="col-md-1">
            <div className="img">
              <img src={product.product.imageCover} className='w-100' alt={product.product.title} />
            </div>
          </div>
          <div className="col-md-9">
            <div className="item">
              <h3 className='h5 fw-bold'>{product.product.title.split(' ').splice(0, 4).join(' ')}</h3>
              <p className='text-main fw-bold'>Price : {product.price} EGP</p>
              <button className={`btn ${style.removeBtn}`} onClick={() => deleteItem(product.product.id)} disabled={pendingProductId === product.product.id} aria-busy={pendingProductId === product.product.id}><i className='fas fa-trash-can me-2'></i>{pendingProductId === product.product.id ? 'Removing...' : 'Remove'}</button>
            </div>
          </div>
          <div className="col-md-2">
            <div className={style.countControls}>
              <button className={`${style.qtyBtn} btn px-3`} onClick={() => updateItem(product.product.id, product.count + 1)} disabled={pendingProductId === product.product.id} aria-label='Increase quantity'>+</button>
              <span className={style.countValue}>{product.count}</span>
              <button className={`${style.qtyBtn} btn px-3`} onClick={() => updateItem(product.product.id, product.count - 1)} disabled={pendingProductId === product.product.id} aria-label='Decrease quantity'>-</button>
            </div>
          </div>
        </div>)}
        {cart ? <Link to={`/shippingaddress/${cart.id}`} className='bg-color btn siteBtn text-light mt-3 w-100 fw-semibold'>Checkout</Link> : ''}
      </main> : <div className={`container ${style.emptyState}`}>
        <h2 className='h4 fw-bold mb-2'>Cart is empty</h2>
        <p className='mb-0'>Add items to your cart to continue to checkout.</p>
      </div>}
    </div>
  </>
}
