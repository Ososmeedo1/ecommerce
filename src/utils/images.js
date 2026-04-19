export const FALLBACK_PRODUCT_IMAGE = 'https://via.placeholder.com/600x600?text=Product+Image';

export function handleImageFallback(event) {
  if (event?.currentTarget?.src !== FALLBACK_PRODUCT_IMAGE) {
    event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
  }
}
