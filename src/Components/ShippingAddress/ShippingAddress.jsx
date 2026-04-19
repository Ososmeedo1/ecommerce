import React, { useContext, useState } from 'react'
import style from './ShippingAddress.module.css'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { trackEvent } from '../../utils/analytics.js'
import { getFriendlyActionErrorMessage } from '../../utils/api.js'
import toast from 'react-hot-toast'

export default function ShippingAddress() {
  let { cartId } = useParams()
  let { checkOutSession } = useContext(CartContext)
  const [submitting, setSubmitting] = useState(false)

  async function checkOut(values) {
    setSubmitting(true)
    trackEvent('checkout_started', { cartId })
    const response = await checkOutSession(cartId, values)

    if (response?.data?.status == 'success') {
      trackEvent('checkout_redirect_success', { cartId })
      setSubmitting(false)
      let { data } = response
      window.location.href = data.session.url;
      return
    }

    toast.error(getFriendlyActionErrorMessage(response, 'start checkout'))
    setSubmitting(false)
  }

  let formik = useFormik({
    initialValues: {
      details: '',
      phone: '',
      city: ''
    }, onSubmit: checkOut
  })

  return <>
    <main className='container pt-5'>
      <h2 className='fw-semibold'>Shipping Address</h2>
      <div className="w-75 mx-autuo py-3">
        <form onSubmit={formik.handleSubmit}>

          <label htmlFor="details">Details: </label>
          <input type="text" id='details' name='details' className='form-control mb-3' onChange={formik.handleChange} />

          <label htmlFor="phone">Phone: </label>
          <input type="tel" id='phone' name='phone' className='form-control mb-3' onChange={formik.handleChange} />

          <label htmlFor="city">City: </label>
          <input type="text" id='city' name='city' className='form-control mb-3' onChange={formik.handleChange} />

          <button className='btn bg-main text-light' type='submit' disabled={submitting}>{submitting ? 'Redirecting...' : 'Checkout'}</button>
        </form>
      </div>
    </main>
  </>
}
