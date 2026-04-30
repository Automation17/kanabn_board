const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    try {
        let token;

        if (
            req.headers.authorization && // check if the header exists
            req.headers.authorization.startsWith("Bearer") // check if the header starts with "Bearer"
        ) {
            // get the token from the header
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token has expired" });
        }
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = { authMiddleware };