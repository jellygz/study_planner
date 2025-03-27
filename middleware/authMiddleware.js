const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.session.token || req.cookies.token; // support session or cookie storage
    console.log("Token in authMiddleware:", token); // Log the token
    
    if (!token) {
        console.log("No token, redirecting to login...");
        return res.redirect("/auth/login");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // add user info to req.user
        console.log("User decoded:", req.user); // Log the decoded user info
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.redirect("/login");
    }
};

module.exports = authMiddleware;
