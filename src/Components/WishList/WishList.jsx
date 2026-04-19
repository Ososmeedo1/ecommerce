
import style from './WishList.module.css'
import { PulseLoader } from 'react-spinners'
import React, { useContext, useEffect, useState } from 'react'
import { WishListContext } from '../../context/WishListContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import toast from 'react-hot-toast';
import { getFriendlyActionErrorMessage, isSuccessResponse } from '../../utils/api.js';

export default function WishList() {


  let { getWishListItems, deleteWishListItems } = useContext(WishListContext);
  let { addToCart } = useContext(CartContext);
  const [wishList, setWishList] = useState([])
  const [loading, setLoading] = useState(true)

  async function getItems() {
    setLoading(true)
    const response = await getWishListItems()

    if (response?.data?.data) {
      setWishList(response.data.data)
      setLoading(false)
      return
    }

    setWishList([])
    setLoading(false)


  }

  async function postToCart(id) {

    const response = await addToCart(id)

    if (isSuccessResponse(response)) {
      toast.success(response.data.message)
      await deleteItem(id);
      return
    }

    toast.error(getFriendlyActionErrorMessage(response, 'add this product to cart'))
  }

  async function deleteItem(id) {
    const response = await deleteWishListItems(id)

    if (!isSuccessResponse(response)) {
      toast.error(getFriendlyActionErrorMessage(response, 'remove this product from wishlist'))
      return
    }

    toast.success(response.data.message)
    await getItems();
  }



  useEffect(() => {
    getItems();
  }, [])


  return <>


    <div className={`${style.wishListColor} p-2 mt-5`}>
      <h2 className='container secondary-font fw-semibold'>WishList</h2>

      {loading ? <div className='loading'>
        <PulseLoader color="#63AF18" size={15} />
      </div> : wishList.length > 0 ? wishList.map(product => <div key={product._id} className="row shadow-sm align-items-center p-2 container mx-auto py-3 border-1 border-bottom m-0">
        <div className="col-md-1">
          <div className="img">
            <img src={product.imageCover} className='w-100' alt={product.title} />
          </div>
        </div>
        <div className="col-md-9">
          <div className="item">
            <h3 className='h5 fw-bold'>{product.title}</h3>
            <button className='btn' onClick={() => deleteItem(product._id)}><i className='fas fa-trash-can text-danger me-2'></i>Remove</button>
          </div>
        </div>
        <div className="col-md-2">
          <div className="addToCart">
            <button className='siteBtn' onClick={() => { postToCart(product._id) }}>Add To Cart</button>
          </div>
        </div>
      </div>)
        : <h2 className='container pt-5'>WishList is Empty ...</h2>}
    </div>
  </>
}
