import { useCallback, useMemo, useState } from "react";
import { CartContext } from './contexts.js';
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

export default function CartContextProvider(props) {

  const [cartCount, setCartCount] = useState(null);

  const checkOutSession = useCallback((cartid, shippingAddress) => {
    const returnUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return createCheckoutSession(cartid, shippingAddress, returnUrl);
  }, []);

  const checkOutCash = useCallback((cartid, shippingAddress) => {
    return createCashOrder(cartid, shippingAddress);
  }, []);

  const addToCart = useCallback((productId) => {
    return addProductToCart(productId);
  }, []);

  const getCartItems = useCallback(() => {
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
  }, []);

  const deleteCartItems = useCallback((productId) => {
    return removeCartItem(productId);
  }, []);

  const updateCartItems = useCallback((productId, count) => {
    return updateCartItemCount(productId, count);
  }, []);

  const clearAllCartItems = useCallback(() => {
    return clearCart();
  }, []);

  const applyCoupon = useCallback((couponName) => {
    return applyCouponToCart(couponName);
  }, []);

  const value = useMemo(() => ({
    addToCart,
    getCartItems,
    deleteCartItems,
    updateCartItems,
    checkOutSession,
    checkOutCash,
    clearAllCartItems,
    applyCoupon,
    setCartCount,
    cartCount
  }), [
    addToCart,
    getCartItems,
    deleteCartItems,
    updateCartItems,
    checkOutSession,
    checkOutCash,
    clearAllCartItems,
    applyCoupon,
    cartCount
  ]);

  return <CartContext.Provider value={value}>
    {props.children}
  </CartContext.Provider>
}