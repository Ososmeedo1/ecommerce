
import style from './WishList.module.css'
import { PulseLoader } from 'react-spinners'
import React, { useContext, useEffect, useState } from 'react'
import { WishListContext } from '../../context/WishListContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import toast from 'react-hot-toast';
import { extractApiMessage, getFriendlyActionErrorMessage, isSuccessResponse } from '../../utils/api.js';

export default function WishList() {


  let { getWishListItems, deleteWishListItems } = useContext(WishListContext);
  let { addToCart } = useContext(CartContext);
  const [wishList, setWishList] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishListError, setWishListError] = useState('')
  const [pendingCartId, setPendingCartId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  async function getItems() {
    setLoading(true)
    setWishListError('')
    const response = await getWishListItems()

    if (response?.data?.data) {
      setWishList(response.data.data)
      setLoading(false)
      return
    }

    setWishList([])
    setWishListError(extractApiMessage(response, 'Unable to load wishlist items right now.'))
    setLoading(false)


  }

  async function postToCart(id) {
    setPendingCartId(id)

    const response = await addToCart(id)

    if (isSuccessResponse(response)) {
      toast.success(response.data.message)
      await deleteItem(id);
      setPendingCartId(null)
      return
    }

    toast.error(getFriendlyActionErrorMessage(response, 'add this product to cart'))
    setPendingCartId(null)
  }

  async function deleteItem(id) {
    setPendingDeleteId(id)
    const response = await deleteWishListItems(id)

    if (!isSuccessResponse(response)) {
      toast.error(getFriendlyActionErrorMessage(response, 'remove this product from wishlist'))
      setPendingDeleteId(null)
      return
    }

    toast.success(response.data.message)
    await getItems();
    setPendingDeleteId(null)
  }



  useEffect(() => {
    getItems();
  }, [])


  return <>


    <div className={`${style.wishListColor} p-2 mt-5`}>
      <h2 className='container secondary-font fw-semibold'>Wishlist</h2>

      {loading ? <div className='loading'>
        <PulseLoader color="#63AF18" size={15} />
      </div> : wishListError ? <div className={`container ${style.errorState}`}>
        <h3 className='h5 fw-semibold mb-2'>Could not load wishlist</h3>
        <p className='mb-3'>{wishListError}</p>
        <button className='btn btn-success' onClick={getItems}>Retry</button>
      </div> : wishList.length > 0 ? wishList.map(product => <div key={product._id} className="row shadow-sm align-items-center p-2 container mx-auto py-3 border-1 border-bottom m-0">
        <div className="col-md-1">
          <div className="img">
            <img src={product.imageCover} className='w-100' alt={product.title} />
          </div>
        </div>
        <div className="col-md-9">
          <div className="item">
            <h3 className='h5 fw-bold'>{product.title}</h3>
            <button className={`btn ${style.removeBtn}`} onClick={() => deleteItem(product._id)} disabled={pendingDeleteId === product._id || pendingCartId === product._id} aria-busy={pendingDeleteId === product._id}><i className='fas fa-trash-can me-2'></i>{pendingDeleteId === product._id ? 'Removing...' : 'Remove'}</button>
          </div>
        </div>
        <div className="col-md-2">
          <div className="addToCart">
            <button className='siteBtn' onClick={() => { postToCart(product._id) }} disabled={pendingDeleteId === product._id || pendingCartId === product._id} aria-busy={pendingCartId === product._id}>{pendingCartId === product._id ? 'Adding...' : 'Add to cart'}</button>
          </div>
        </div>
      </div>)
        : <div className={`container ${style.emptyState}`}>
          <h2 className='h4 fw-bold mb-2'>Wishlist is empty</h2>
          <p className='mb-0'>Save products you love here for quick access later.</p>
        </div>}
    </div>
  </>
}
