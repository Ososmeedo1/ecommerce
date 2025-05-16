import React, { useContext } from 'react'
import style from './ShippingAddress.module.css'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'

export default function ShippingAddress() {
  let { cartId } = useParams()
  let { checkOutSession } = useContext(CartContext)

  async function checkOut(values) {
    let { data } = await checkOutSession(cartId, values)
    if (data.status == 'success') {
      window.location.href = data.session.url;
    }
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

          <button className='btn bg-main text-light' type='submit'>Checkout</button>
        </form>
      </div>
    </main>
  </>
}
