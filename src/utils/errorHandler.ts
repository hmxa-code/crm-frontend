export function handleApiError(error: any) {
  console.error('🔴 API Error Handler - Full error:', error);

  if (!error) {
    return 'An unexpected error occurred';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error.response) {
    const { message, statusCode } = error.response.data || {};
    console.error(`[${statusCode || '??'}] ${message || 'Unknown error'}`);
    return message || 'An unknown server error occurred';
  } else if (error.status) {
    const statusCode = error.status;
    const message = error.message || `HTTP ${statusCode} Error`;
    console.error(`[${statusCode}] ${message}`);

    if (statusCode === 403) {
      return `Access Denied: ${message}. Check that your user account has the required role to perform this action.`;
    } else if (statusCode === 401) {
      return 'Your session has expired. Please log in again.';
    }
    return message;
  } else if (error.request) {
    console.error('No response from server');
    return 'Network error. Please check your connection.';
  } else {
    console.error('Error:', error.message || error);
    return error.message || 'An unexpected error occurred';
  }
}
