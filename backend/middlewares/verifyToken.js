
const jwt = require("jsonwebtoken");

//verify the token 
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization; //get the bearer token string from header
    if (authToken) {
        const token = authToken.split(" ")[1]; //token sended by string like this: "bearer $(token)" then we split by space " " and get the element 1 witch is the token without bearer word        

        try {
            //verify token
            const decoded_token_payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded_token_payload;
            next(); //every thing fine (token exist + legal + not expired + include subject + secret key correct) then move to next function/req
        } catch (err) {
            return res.status(401).json({ message: "Invalid Token, Access denied!" })
        }
    } else {
        return res.status(401).json({ message: "no token provided, access denied" });
    }
}

//verify the token & is user Admin ? 
function verifyTokenIsAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "admin") {
            next();
        }
        else { //in case not really admin
            return res.status(403).json({ message: "Not Allowed, Only Admin Can Access!" })
        }
    })
}

//verify the token & is user himself 
function verifyTokenIsUserHimself(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "Not Allowed, Only User Himself!" });
        }
    })
}

//verify the token & is user himself or admin 
function verifyTokenUserOrAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Not Allowed, Only User Himself Or Admin!" });
        }
    })
}

//exports 
module.exports = {
    verifyToken,
    verifyTokenIsAdmin,
    verifyTokenIsUserHimself,
    verifyTokenUserOrAdmin,
}
