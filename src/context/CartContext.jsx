import { createContext, useState } from "react";
import {
  addProductToCart,
  applyCouponToCart,
  clearCart,
  createCashOrder,
  createCheckoutSession,
  fetchCart,
  removeCartItem,
  updateCartItemCount
} from '../services/storeApi.js';

export let CartContext = createContext();



export default function CartContextProvider(props) {

  const [cartCount, setCartCount] = useState(null);

  function checkOutSession(cartid, shippingAddress) {
    const returnUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return createCheckoutSession(cartid, shippingAddress, returnUrl);
  }

  function checkOutCash(cartid, shippingAddress) {
    return createCashOrder(cartid, shippingAddress);
  }

  function addToCart(productId) {
    return addProductToCart(productId);
  }

  function getCartItems() {
    return fetchCart()
      .then((response) => {
        const itemsCount = response?.data?.numOfCartItems
          ?? response?.data?.data?.products?.length
          ?? response?.data?.cart?.products?.length

        if (itemsCount !== undefined) {
          setCartCount(itemsCount);
        }
        return response;
      })
  }

  function deleteCartItems(productId) {
    return removeCartItem(productId);
  }

  function updateCartItems(productId, count) {
    return updateCartItemCount(productId, count);
  }

  function clearAllCartItems() {
    return clearCart();
  }

  function applyCoupon(couponName) {
    return applyCouponToCart(couponName);
  }


  return <CartContext.Provider value={{ addToCart, getCartItems, deleteCartItems, updateCartItems, checkOutSession, checkOutCash, clearAllCartItems, applyCoupon, setCartCount, cartCount }}>
    {props.children}
  </CartContext.Provider>
}