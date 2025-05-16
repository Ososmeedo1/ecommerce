import axios from "axios";
import { createContext, useState } from "react";

export let CartContext = createContext();



export default function CartContextProvider(props) {

  function headersToken() {
    return {
      token: localStorage.getItem('userToken')
    };
  }

  const [cartCount, setCartCount] = useState(null);

  function checkOutSession(cartid, shippingAddress) {
    return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartid}?url=http://localhost:3000`, {
      shippingAddress
    }, {
      headers: headersToken()
    })
      .then((response) => response)
      .catch((err) => err)
  }

  function addToCart(productId) {
    return axios.post(`https://ecommerce.routemisr.com/api/v1/cart`, {
      productId
    }, {
      headers: headersToken()
    })
      .then((response) => response)
      .catch((err) => err)
  }

  function getCartItems() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/cart`, {
      headers: headersToken()
    })
      .then((response) => {
        setCartCount(response.data.numOfCartItems);
        return response;
      })
      .catch((err) => err)
  }

  function deleteCartItems(productId) {
    return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
      headers: headersToken()
    })
      .then((response) => response)
      .catch((err) => err)
  }

  function updateCartItems(productId, count) {
    return axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
      count
    }, {
      headers: headersToken()
    })
      .then((response) => response)
      .catch((err) => err)
  }

  function clearAllCartItems() {
    return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`, {
      headers: headersToken()
    })
    .then((response) => response)
    .catch((err) => err)
  }


  return <CartContext.Provider value={{ addToCart, getCartItems, deleteCartItems, updateCartItems , checkOutSession, clearAllCartItems, setCartCount, cartCount }}>
    {props.children}
  </CartContext.Provider>
}