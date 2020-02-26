class ErrorHandler extends Error {
  constructor(statusCode, messages) {
    super();
    this.statusCode = statusCode;
    this.messages = messages;
  }
}

const handleError = (err, res) => {
  const {
    statusCode,
    messages
  } = err;
  res.status(statusCode).json({
    messages: messages.join(", ")
  });
};

module.exports = {
  ErrorHandler,
  handleError
}
