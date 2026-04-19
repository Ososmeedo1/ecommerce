import { describe, expect, it } from 'vitest';
import { buildProductsCategoryQuery, shouldRequireLogin } from '../routes.js';

function makeToken(expSecondsFromNow) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + expSecondsFromNow
  };

  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

describe('routing helpers', () => {
  it('builds products route with category query', () => {
    const route = buildProductsCategoryQuery({
      _id: '123',
      name: "Men's Fashion"
    });

    expect(route).toBe('/products?category=123&categoryName=Men\'s%20Fashion');
  });

  it('requires login when token is missing', () => {
    expect(shouldRequireLogin(null)).toBe(true);
    expect(shouldRequireLogin('')).toBe(true);
    expect(shouldRequireLogin('token-value')).toBe(true);
    expect(shouldRequireLogin(makeToken(-10))).toBe(true);
    expect(shouldRequireLogin(makeToken(3600))).toBe(false);
  });
});
