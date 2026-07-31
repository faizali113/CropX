/**
 * Extract a user-friendly error message from an Axios error response.
 * @param {unknown} error
 * @param {string} fallback
 */
export function parseApiError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response?.data) return fallback;
  const data = error.response.data;

  // DRF non-field error
  if (typeof data.detail === 'string') return data.detail;

  // DRF field-level errors – return first message found
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val) && val.length > 0) return val[0];
    if (typeof val === 'string') return val;
  }

  return fallback;
}
