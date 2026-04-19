export function buildProductsCategoryQuery(category) {
  return `/products?category=${category._id}&categoryName=${encodeURIComponent(category.name)}`;
}

export function isTokenExpired(userToken) {
  if (!userToken) {
    return true;
  }

  try {
    const payloadPart = userToken.split('.')[1];
    if (!payloadPart) {
      return true;
    }

    const decodedPayload = JSON.parse(atob(payloadPart));
    if (!decodedPayload?.exp) {
      return false;
    }

    return decodedPayload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function shouldRequireLogin(userToken) {
  return isTokenExpired(userToken);
}
