import React, { useEffect, useState } from 'react'
import style from './Categories.module.css'
import { PulseLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { buildProductsCategoryQuery } from '../../utils/routes.js';
import { trackEvent } from '../../utils/analytics.js';
import { handleImageFallback } from '../../utils/images.js';
import { setPageMeta } from '../../utils/seo.js';
import { fetchCategories } from '../../services/storeApi.js';

export default function Categories() {

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  function handleCategorySelect(category) {
    trackEvent('category_selected', { categoryId: category._id, categoryName: category.name })
    navigate(buildProductsCategoryQuery(category))
  }

  async function getCategories() {
    const response = await fetchCategories()
    if (response?.data?.data) {
      setCategories(response.data.data)
    }
    setLoading(false);
  }

  useEffect(() => {
    getCategories();
    setPageMeta({
      title: 'Categories | Fresh Cart',
      description: 'Browse all product categories and jump directly to category products.'
    })
  }, []);

  const excludedCategories = ["Baby & Toys", "Mobiles", "Music"];

  const filteredCategories = categories.filter(category =>
    !excludedCategories.includes(category.name)
  );

  return <>

    {loading ?
      <div className="loading">
        <PulseLoader color="#63AF18" size={15} />
      </div> :
      <main className='container pt-5'>
        <div className="row g-4">
          {filteredCategories.map(category => <div key={category._id} className='col-md-3'>
            <div className={`${style.categoryCard} category d-flex flex-column justify-content-between shadow h-100 rounded-2`} role='button' onClick={() => handleCategorySelect(category)}>
              <div className="image">
                <img src={category.image} className={`${style.categoryImg} rounded-2`} alt={category.name} loading='lazy' onError={handleImageFallback} />
              </div>
              <div className="title d-flex justify-content-center py-4">
                <h3 className={`${style.categoryTitle} mx-auto secondary-font fw-semibold`}>{category.name}</h3>
              </div>
              <div className='px-3 pb-3'>
                <button
                  type='button'
                  className='btn btn-outline-success w-100'
                  onClick={(event) => {
                    event.stopPropagation()
                    handleCategorySelect(category)
                  }}
                >
                  View Products
                </button>
              </div>
            </div>
          </div>)}
        </div>
      </main>
    }

  </>
}
