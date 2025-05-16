class ApiError extends Error {
  constructor(statusCode, message, success, errors = []) {
    super(message);
    (this.code = statusCode),
      (this.data = null),
      (this.message = message),
      (this.success = false),
      (this.error = errors);
  }
}
export default ApiError;
