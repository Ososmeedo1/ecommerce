import React, { useEffect  } from 'react'
import style from './Home.module.css'
import HomeProducts from '../HomeProducts/HomeProducts'
import MainSlider from '../MainSlider/MainSlider'
import CategoriesSlider from '../CategoriesSlider/CategoriesSlider'
// import axios from 'axios'
// import { UserContext } from '../../context/UserContext.jsx'
import { Helmet } from 'react-helmet'

export default function Home() {

  // let { verifyUserToken, setUserInfo } = useContext(UserContext)



  // async function getUserInfo() {
  //   const { data } = await verifyUserToken();
  //   if (data.message == "verified") {
  //     setUserInfo(data.decoded.name);
  //   }
  // }


  useEffect(() => {
    // getUserInfo();
  }, [])


  return <>

    <Helmet>
      <meta charSet="utf-8" />
      <title>Home</title>
    </Helmet>

    <header>
      <div className="container">
        <MainSlider />
        <CategoriesSlider />
        <HomeProducts />
      </div>
    </header>
  </>
}
