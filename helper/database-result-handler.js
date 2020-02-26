class DatabaseResultHandler {
  constructor(error, value) {
    this.error = error;
    this.value = value;
  }
}

const handleDatabaseError = (err) => {
  return new DatabaseResultHandler(true, err.code)
}

module.exports ={
  DatabaseResultHandler, handleDatabaseError}
