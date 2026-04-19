export function extractApiMessage(response, fallback = 'Something went wrong. Please try again.') {
  return response?.response?.data?.message || response?.data?.message || fallback;
}

export function isSuccessResponse(response) {
  return response?.data?.status === 'success';
}

export function isUnauthorizedError(response) {
  return response?.response?.status === 401;
}

export function getFriendlyAuthErrorMessage(response) {
  const message = extractApiMessage(response, 'Login failed. Please check your email and password.');

  if (isUnauthorizedError(response)) {
    return 'Your session is invalid or expired. Please login again.';
  }

  if (message.toLowerCase().includes('incorrect email or password')) {
    return 'Email or password is incorrect. Please try again.';
  }

  return message;
}

export function getFriendlyActionErrorMessage(response, actionLabel) {
  if (isUnauthorizedError(response)) {
    return 'Please login first to continue.';
  }

  return extractApiMessage(response, `Unable to ${actionLabel} right now.`);
}
