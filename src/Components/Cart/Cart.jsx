import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import style from './Cart.module.css'
import { CartContext } from '../../context/CartContext';
import { PulseLoader } from 'react-spinners';
import { Helmet } from 'react-helmet';

export default function Cart() {
  let { getCartItems, deleteCartItems, updateCartItems, clearAllCartItems } = useContext(CartContext);
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  async function getItems() {
    let { data } = await getCartItems()
    if (data.numOfCartItems == 0) {
      setCart(null);
      setLoading(false);
    }
    else {
      setCart(data);
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    let { data } = await deleteCartItems(id)
    await getItems()
    setLoading(false);
  }

  async function updateItem(id, count) {
    setLoading(true);
    if (count < 1) {
      await deleteItem(id);
    } else {
      let { data } = await updateCartItems(id, count);
      setCart(data);
    }
    setLoading(false);
  }

  async function clearCart() {
  setLoading(true);
  await clearAllCartItems();
  setCart(null);
  setLoading(false);
}


  useEffect(() => {
    getItems();

  }, [])


  return <>


    <Helmet>
      <meta charSet="utf-8" />
      <title>Cart</title>
    </Helmet>


    <div className={`${style.cartColor} p-2 mt-5`}>

      {cart ?
        <div className="cartInfo container">
          <div className="title d-flex justify-content-between">
            <h2 className='secondary-font fw-semibold'>Cart</h2>
            <button className={`${style.clearBtn} btn btn-danger`} onClick={clearCart}>Clear All</button>
          </div>
            <div className="numbers d-flex justify-content-between py-4 fw-semibold fs-4 text-secondary">
              <p>Total Price: <span className='text-color'>{cart.data.totalCartPrice} EGP</span></p>
              <p>Total Number: <span className='text-color'>{cart.numOfCartItems}</span></p>
          </div>
        </div>
        : ''}



      {loading ? <div className='loading'>
        <PulseLoader color="#63AF18" size={15} />
      </div> : cart ? <main className='container'>
        {cart.data.products.map(product => <div key={product.product.id} className="row shadow-sm align-items-center p-2 py-3 border-1 border-bottom m-0">
          <div className="col-md-1">
            <div className="img">
              <img src={product.product.imageCover} className='w-100' alt={product.product.title} />
            </div>
          </div>
          <div className="col-md-9">
            <div className="item">
              <h3 className='h5 fw-bold'>{product.product.title.split(' ').splice(0, 4).join(' ')}</h3>
              <p className='text-main fw-bold'>Price : {product.price} EGP</p>
              <button className='btn' onClick={() => deleteItem(product.product.id)}><i className='fas fa-trash-can text-danger me-2'></i>Remove</button>
            </div>
          </div>
          <div className="col-md-2">
            <div className="count">
              <button className={`${style.count} btn brdr px-3`} onClick={() => updateItem(product.product.id, product.count + 1)}>+</button>
              <span className='mx-2'>{product.count}</span>
              <button className={`${style.count} btn brdr px-3`} onClick={() => updateItem(product.product.id, product.count - 1)}>-</button>
            </div>
          </div>
        </div>)}
      {cart ? <Link to={`/shippingaddress/${cart.data._id}`} className='bg-color btn siteBtn text-light mt-3 w-100 fw-semibold'>Checkout</Link> : ''}
      </main> : <h2 className='container fw-bold'>Cart is Empty ...</h2>}
    </div>
  </>
}
