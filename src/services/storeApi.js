import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1'
});

export function fetchProducts(params) {
  return api.get('/products', { params }).catch((error) => error);
}

export function fetchCategories() {
  return api.get('/categories').catch((error) => error);
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
