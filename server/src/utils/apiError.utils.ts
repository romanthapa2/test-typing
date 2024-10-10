
class ApiError extends Error {
    statusCode: number;
    success: boolean = false;
  
    constructor(statusCode: number, message: string = "Something went wrong") {
      super(message);
      this.statusCode = statusCode;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }


  
  export {ApiError};