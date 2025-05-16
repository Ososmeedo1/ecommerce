import React, { useEffect, useState } from 'react'
import style from './CategoriesSlider.module.css'
import axios from 'axios';
import Slider from 'react-slick';

export default function CategoriesSlider() {

  const [categories, setCategories] = useState([])
  
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 2000,
    slidesToShow: 6,
    slidesToScroll: 3,
    arrows: false,
    autoplay: true
  };


  async function getCategories() {
    const {data} = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
    .catch(error => console.log(error));
    setCategories(data.data);
  }

  useEffect(() => {
    getCategories();
  }, []);

  const excludedCategories = ["Baby & Toys", "Mobiles", "Music"];

  const filteredCategories = categories.filter(category =>
    !excludedCategories.includes(category.name)
  );



  return <>
    <div className="row mb-5">
      <Slider {...settings}>
        {filteredCategories.map(category => <div key={category._id} className='col-md-2'>
          <div className="img">
            <img src={category.image} height={200} className='w-100' alt={category.name} />
            <div className="categoryName d-flex justify-content-center py-3">
            <p>{category.name}</p>
            </div>
          </div>
        </div>)}
      </Slider>
    </div>
  </>
}
