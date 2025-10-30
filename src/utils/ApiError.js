class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false; // success code nhi jayega kyuki yaha Api Error ko handle kr rhe h.. Api Response ko handle nhi kr rhe h
    this.errors = errors;

    // stack trace ko set krna hai
    // stack ka mtlb hai error kaha pr hua hai
    // condition lagaya hai ki agar stack pass hua hai to use krna hai
    // agar stack pass nhi hua hai to default stack trace ko capture krna hai
    // stack trace mtlb error kaha pr hua hai uska pura path
    // ye debugging me help krta hai
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };