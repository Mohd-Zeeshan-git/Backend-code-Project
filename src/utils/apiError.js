class ApiErroer extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        error = {},
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        // this.stack = stack;
        this.data = null;
        this.success = false;
     
        
        if(stck) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiErroer };
