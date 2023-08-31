// @desc this class is responsible about operation errors (errors i can predict it)
class ApiError extends Error {
  constructor (message , statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "failed" : "Error";
    this.isOperitional = true
  }
}

module.exports = ApiError;