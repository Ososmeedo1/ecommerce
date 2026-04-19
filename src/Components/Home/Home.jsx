import React, { useEffect } from 'react'
import style from './Home.module.css'
import HomeProducts from '../HomeProducts/HomeProducts'
import MainSlider from '../MainSlider/MainSlider'
import CategoriesSlider from '../CategoriesSlider/CategoriesSlider'
import { setPageMeta } from '../../utils/seo.js'

export default function Home() {

  useEffect(() => {
    setPageMeta({
      title: 'Fresh Cart | Home',
      description: 'Shop trending products, discover categories, and build your cart quickly on Fresh Cart.'
    })
  }, [])

  return <>

    <header>
      <div className="container">
        <MainSlider />
        <CategoriesSlider />
        <HomeProducts />
      </div>
    </header>
  </>
}
