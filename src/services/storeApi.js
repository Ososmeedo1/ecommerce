import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1'
});

const apiV2 = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v2'
});

function resolveToken(explicitToken) {
  if (explicitToken) {
    return explicitToken;
  }

  if (typeof window !== 'undefined') {
    return localStorage.getItem('userToken');
  }

  return null;
}

function withAuthConfig(token) {
  const resolvedToken = resolveToken(token);

  if (!resolvedToken) {
    return {};
  }

  return {
    headers: {
      token: resolvedToken
    }
  };
}

export function fetchProducts(params) {
  return api.get('/products', { params }).catch((error) => error);
}

export function fetchCategories() {
  return api.get('/categories').catch((error) => error);
}

export function fetchSubCategories() {
  return api.get('/subcategories').catch((error) => error);
}

export function fetchCategorySubCategories(categoryId) {
  return api.get(`/categories/${categoryId}/subcategories`).catch((error) => error);
}

export function fetchBrands() {
  return api.get('/brands').catch((error) => error);
}

export function fetchProductDetails(productId) {
  return api.get(`/products/${productId}`).catch((error) => error);
}

export function signIn(values) {
  return api.post('/auth/signin', values).catch((error) => error);
}

export function signUp(values) {
  return api.post('/auth/signup', values).catch((error) => error);
}

export function forgotPassword(values) {
  return api.post('/auth/forgotPasswords', values).catch((error) => error);
}

export function verifyResetCode(values) {
  return api.post('/auth/verifyResetCode', values).catch((error) => error);
}

export function resetPassword(values) {
  return api.put('/auth/resetPassword', values).catch((error) => error);
}

export function addProductToCart(productId, token) {
  return apiV2.post('/cart', { productId }, withAuthConfig(token)).catch((error) => error);
}

export function fetchCart(token) {
  return apiV2.get('/cart', withAuthConfig(token)).catch((error) => error);
}

export function removeCartItem(productId, token) {
  return apiV2.delete(`/cart/${productId}`, withAuthConfig(token)).catch((error) => error);
}

export function updateCartItemCount(productId, count, token) {
  return apiV2.put(`/cart/${productId}`, { count }, withAuthConfig(token)).catch((error) => error);
}

export function clearCart(token) {
  return apiV2.delete('/cart', withAuthConfig(token)).catch((error) => error);
}

export function applyCouponToCart(couponName, token) {
  return apiV2.put('/cart/applyCoupon', { couponName }, withAuthConfig(token)).catch((error) => error);
}

export function createCheckoutSession(cartId, shippingAddress, returnUrl, token) {
  return api.post(
    `/orders/checkout-session/${cartId}`,
    { shippingAddress },
    {
      ...withAuthConfig(token),
      params: {
        url: returnUrl
      }
    }
  ).catch((error) => error);
}

export function createCashOrder(cartId, shippingAddress, token) {
  return api.post(
    `/orders/${cartId}`,
    { shippingAddress },
    withAuthConfig(token)
  ).catch((error) => error);
}

export function fetchUserOrders(userId, token) {
  return api.get(`/orders/user/${userId}`, withAuthConfig(token)).catch((error) => error);
}

export function addProductToWishList(productId, token) {
  return api.post('/wishlist', { productId }, withAuthConfig(token)).catch((error) => error);
}

export function removeWishListItem(productId, token) {
  return api.delete(`/wishlist/${productId}`, withAuthConfig(token)).catch((error) => error);
}

export function fetchWishList(token) {
  return api.get('/wishlist', withAuthConfig(token)).catch((error) => error);
}

export function fetchProductReviews(productId, params) {
  return api.get(`/products/${productId}/reviews`, { params }).catch((error) => error);
}

export function fetchReviews(params) {
  return api.get('/reviews', { params }).catch((error) => error);
}

export function addProductReview(productId, reviewPayload, token) {
  return api.post(`/products/${productId}/reviews`, reviewPayload, withAuthConfig(token)).catch((error) => error);
}

export function updateReview(reviewId, reviewPayload, token) {
  return api.put(`/reviews/${reviewId}`, reviewPayload, withAuthConfig(token)).catch((error) => error);
}

export function deleteReview(reviewId, token) {
  return api.delete(`/reviews/${reviewId}`, withAuthConfig(token)).catch((error) => error);
}

export function fetchUserAddresses(token) {
  return api.get('/addresses', withAuthConfig(token)).catch((error) => error);
}

export function addUserAddress(addressPayload, token) {
  return api.post('/addresses', addressPayload, withAuthConfig(token)).catch((error) => error);
}

export function removeUserAddress(addressId, token) {
  return api.delete(`/addresses/${addressId}`, withAuthConfig(token)).catch((error) => error);
}
