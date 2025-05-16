class ApiError extends Error {
  constructor(statusCode, message = "Some Went Wrong.", success, errors = []) {
    super(message);
    this.code = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = this.errors;
  }
}
export default ApiError;
