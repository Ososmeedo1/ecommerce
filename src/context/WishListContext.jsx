import { useCallback, useMemo, useState } from "react";
import { WishListContext } from './contexts.js';
import { addProductToWishList, fetchWishList, removeWishListItem } from '../services/storeApi.js';

export default function WishListContextProvider(props) {

  const [wishListCount, setWishListCount] = useState(null)

  const addToWishList = useCallback((productId) => {
    return addProductToWishList(productId)
  }, [])

  const deleteWishListItems = useCallback((productId) => {
    return removeWishListItem(productId)
  }, [])

  const getWishListItems = useCallback(() => {
    return fetchWishList()
      .then((response) => {
        if (response?.data?.count !== undefined) {
          setWishListCount(response.data.count);
        }
        return response;
      })
  }, [])


  const value = useMemo(() => ({
    addToWishList,
    deleteWishListItems,
    getWishListItems,
    setWishListCount,
    wishListCount
  }), [addToWishList, deleteWishListItems, getWishListItems, wishListCount])

  return <WishListContext.Provider value={value}>
    {props.children}
  </WishListContext.Provider>
}