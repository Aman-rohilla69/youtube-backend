const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export { asyncHandler };

// higher order function kya hote hai?
// higher order function wo hote hai jo ek function ko argument ke roop me lete hai
// ya phir ek function ko return karte hai
// ya phir vo function jo functions ko as a parameter lete hai ya return karte hai

// try catch fn use:-
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };
