import { describe, expect, it } from 'vitest';
import { getFriendlyAuthErrorMessage } from '../api.js';

describe('auth message helper', () => {
  it('returns friendly message for invalid credentials', () => {
    const error = {
      response: {
        status: 400,
        data: { message: 'incorrect email or password' }
      }
    };

    expect(getFriendlyAuthErrorMessage(error)).toBe('Email or password is incorrect. Please try again.');
  });

  it('returns session-expired message for unauthorized', () => {
    const error = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
    };

    expect(getFriendlyAuthErrorMessage(error)).toBe('Your session is invalid or expired. Please login again.');
  });
});
