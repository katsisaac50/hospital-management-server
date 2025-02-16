const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            console.log(req.user)
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log(req.user.role)
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Denied" });
      }
      next();
    };
  };

module.exports = { protect, authorizeRoles };