import React, { useContext, useEffect, useState } from 'react'
import style from './HomeProducts.module.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'
import { CartContext } from '../../context/CartContext.jsx'
import toast from 'react-hot-toast'
import { WishListContext } from '../../context/WishListContext.jsx'

export default function HomeProducts() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  let { addToCart } = useContext(CartContext)
  let { addToWishList } = useContext(WishListContext)
  async function getProducts() {
    await axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
      .catch(error => console.log(error))
      .then((res) => {
        setLoading(false);
        setProducts(res.data.data);
      })
  }

  async function postToCart(id) {
    let { data } = await addToCart(id)
    if (data.status == 'success') {
      toast.success(data.message);
    }
  }

  async function postToWishList(id) {

    let { data } = await addToWishList(id)
    if (data.status == 'success') {
      toast.success(data.message);
    }
  }





  useEffect(() => {
    getProducts();
  }, [])

  const excludedTitles = ["Logo T-Shirt", "Woman Karma", "Victus 16-D1016Ne"];

  const filteredProducts = products.filter(product =>
    !excludedTitles.includes(product.title.split(" ").splice(0, 2).join(" "))
  );


  return <>
    <header>
      <h2 className='fw-bold my-3 secondary-font'>Home Products</h2>
      {loading ?
        <div className='loading'>
          <PulseLoader color="#63AF18" size={15} />
        </div> :
        <div className="row gy-4 mb-3">
          {filteredProducts.map(product => <div key={product.id} className='col-md-3'>
            <div className="product p-2 rounded-2 shadow">
              <Link to={`/productdetails/${product.id}`}>
                <img src={product.imageCover} className='w-100 rounded-2' alt={product.title} />
                <span className='font-sm text-main'>{product.category.name}</span>
                <h3 className='h5'>{product.title.split(' ').splice(0, 2).join(' ')}</h3>
                <div className="d-flex py-3 justify-content-between align-items-center">
                  <span className="font-sm fw-semibold">{product.price} EGP</span>
                  <span className='font-sm'>
                    <i className='fas fa-star rating-color me-1'></i>
                    {product.ratingsAverage}
                  </span>
                </div>
              </Link>

              <div className="product-footer flex-column d-flex justify-content-between align-items-center">
                <button className='addToCart w-100' onClick={() => {postToCart(product.id)}}>Add to cart</button>
                <button className='addToWishList  mt-2 w-100' onClick={() => {postToWishList(product.id)}}>Add to WishList</button>
              </div>
            </div>
          </div>)}
        </div>
      }
    </header>
  </>
}
