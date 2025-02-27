
/**
 * Middleware for handling errors in the backend side.
 *
 * 1️. **Not Found Middleware:**  
 *    - If a request is made to an unknown route (e.g., `http://localhost:3000/abc`),  
 *      Express will normally return an unclear HTML error page (`Cannot GET /abc`).  
 *    - This middleware catches such cases and returns a JSON response with a clear message:
 *      `{ message: "The Requested Route /abc Not Found!" }`
 *
 * 2️. **General Error Handler:**  
 *    - If another type of error occurs (e.g., invalid JSON is sent in a request),  
 *      the server might crash or return an unclear error.  
 *    - This middleware catches such errors and responds with a structured JSON object  
 *      containing the error message and stack trace (only in development mode).
 */


//not found page error middleware
const notFound = (req,res,next)=>{
    const error = new Error(`The Requested Route ${req.originalUrl} Not Found!`);
    res.status(404);
    next(error);
}

//error handle middleware 
const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message:err.message,
        stack:process.env.NODE_ENV === "development" ? err.stack : null,
    });
}

module.exports = {
    notFound,
    errorHandler,
}