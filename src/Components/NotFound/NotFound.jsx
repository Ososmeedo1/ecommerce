import React from 'react'
import style from './NotFound.module.css'
import img from './../../assets/Animation - 1747417346926.json'
import Lottie from 'lottie-react'
import { Helmet } from 'react-helmet'

export default function NotFound() {
  return <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Not Found</title>
    </Helmet>

    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Lottie animationData={img} className='w-100' loop={true} />
        </div>
      </div>
    </div>
  </>
}
