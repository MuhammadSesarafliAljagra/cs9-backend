exports.success = (message, payload) => ({
  success: true,
  message,
  payload,
});

exports.error = (message) => ({
  success: false,
  message,
  payload: null,
});
