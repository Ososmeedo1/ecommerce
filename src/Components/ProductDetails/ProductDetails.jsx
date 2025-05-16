import React, { useContext, useEffect, useState } from 'react'
import style from './ProductDetails.module.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import Slider from 'react-slick'
import { CartContext } from '../../context/CartContext'
import { WishListContext } from '../../context/WishListContext'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet'

export default function ProductDetails() {

  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)

  const { id } = useParams();

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  }

  let { addToCart } = useContext(CartContext);
  let { addToWishList } = useContext(WishListContext);

  async function getProductDetails(id) {
    let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .catch((error) => error)
    setDetails(data.data);
    setLoading(false);
  }

  async function postToCart(id) {
    let { data } = await addToCart(id);

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
    getProductDetails(id)
  }, [])

  return <>

    <Helmet>
      <meta charSet="utf-8" />
      <title>{details.title}</title>
    </Helmet>

    {loading ? <div className="loading">
      <PulseLoader color="#63AF18" size={15} />
    </div> :
      <main className="main container px-4 mx-auto overflow-hidden">
        <div className="px-4 py-5 mt-5">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="slider-imgs">
                <Slider {...settings}>
                  {details.images.map(image => <img src={image} alt={details.title} className='w-100' key={details.id} />)}
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
                    <svg onClick={() => { postToWishList(id) }} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-danger cursor-pointer" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg>
                  </span>
                </div>
                <div className="test d-flex justify-content-center align-items-center">
                  <button className='siteBtn btn text-light w-100' onClick={() => { postToCart(id) }}>Add To Cart</button>
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
