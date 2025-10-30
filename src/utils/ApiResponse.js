class ApiResponse {
  constructor(statusCode, message = "Success", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400; // success code jayega kyuki yaha Api Response ko handle kr rhe h.. Api Error ko handle nhi kr rhe h
  }
}
