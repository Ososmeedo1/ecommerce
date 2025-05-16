import axios from "axios";
import { createContext, useState } from "react";

export let WishListContext = createContext();



export default function WishListContextProvider(props) {

  // let headers = {
  //   token: localStorage.getItem('userToken')
  // }

  function headersToken() {
    return {
      token: localStorage.getItem('userToken')
    };
  }
  

  const [wishListCount, setWishListCount] = useState(null)

  function addToWishList(productId) {
    return axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      productId
    }, {
      headers: headersToken()
    })
      .then((response) => response)
      .catch((err) => err)
  }

  function deleteWishListItems(productId) {
    return axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      headers: headersToken()
    })
      .then((response) => response)
      .catch((err) => err)
  }

  function getWishListItems() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      headers: headersToken()
    })
      .then((response) => {
        setWishListCount(response.data.count);
        return response;
        
      })
      .catch((err) => err)
  }


  return <WishListContext.Provider value={{ addToWishList, deleteWishListItems, getWishListItems, setWishListCount, wishListCount }}>
    {props.children}
  </WishListContext.Provider>
}