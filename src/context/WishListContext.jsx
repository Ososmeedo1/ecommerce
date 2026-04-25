import { createContext, useState } from "react";
import { addProductToWishList, fetchWishList, removeWishListItem } from '../services/storeApi.js';

export let WishListContext = createContext();



export default function WishListContextProvider(props) {

  const [wishListCount, setWishListCount] = useState(null)

  function addToWishList(productId) {
    return addProductToWishList(productId)
  }

  function deleteWishListItems(productId) {
    return removeWishListItem(productId)
  }

  function getWishListItems() {
    return fetchWishList()
      .then((response) => {
        if (response?.data?.count !== undefined) {
          setWishListCount(response.data.count);
        }
        return response;
      })
  }


  return <WishListContext.Provider value={{ addToWishList, deleteWishListItems, getWishListItems, setWishListCount, wishListCount }}>
    {props.children}
  </WishListContext.Provider>
}