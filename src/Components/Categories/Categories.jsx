import React, { useEffect, useState } from 'react'
import style from './Categories.module.css'
import { PulseLoader } from 'react-spinners';
import axios from 'axios';
import { Helmet } from 'react-helmet';

export default function Categories() {

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  async function getCategories() {
    const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
      .catch(error => console.log(error));
    setCategories(data.data);
    setLoading(false);
  }

  useEffect(() => {
    getCategories();
  }, []);

  const excludedCategories = ["Baby & Toys", "Mobiles", "Music"];

  const filteredCategories = categories.filter(category =>
    !excludedCategories.includes(category.name)
  );

  return <>

    <Helmet>
      <meta charSet="utf-8" />
      <title>Categories</title>
    </Helmet>

    {loading ?
      <div className="loading">
        <PulseLoader color="#63AF18" size={15} />
      </div> :
      <main className='container pt-5'>
        <div className="row g-4">
          {filteredCategories.map(category => <div key={category._id} className='col-md-3'>
            <div className="category d-flex flex-column justify-content-between shadow h-100 rounded-2">
              <div className="image">
                <img src={category.image} className={`${style.categoryImg} rounded-2`} alt={category.name} />
              </div>
              <div className="title d-flex justify-content-center py-4">
                <h3 className={`${style.categoryTitle} mx-auto secondary-font fw-semibold`}>{category.name}</h3>
              </div>
            </div>
          </div>)}
        </div>
      </main>
    }

  </>
}
