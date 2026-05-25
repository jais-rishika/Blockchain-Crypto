export const SuccessResponseDto = ({ data, message = 'success' }) => ({
  type: 'success',
  message,
  data
});

export const ErrorResponseDto = ({ message = 'error', details = null }) => ({
  type: 'error',
  message,
  details
});