const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findOne({ _id: decoded._id });

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).send({ message: 'Access denied' });
      }

      req.user = user;
      next();
    } catch (e) {
      res.status(401).send({ message: 'Please authenticate' });
    }
  };
};

module.exports = checkRole;





// const bcrypt = require('bcryptjs');

// const hashPassword = async (password) => {
//     // const salt = await bcrypt.genSalt(10);
//     // const hashedPassword = await bcrypt.hash(password, salt);
//     // return hashedPassword;
//     return new Promise((resolve, reject) => {
//         bcrypt.genSalt(10, (err, salt) => {
//             if (err) {
//                 reject(err);
//             }
//             bcrypt.hash(password, salt, (err, hash) => {
//                 if (err) {
//                     reject(err);
//                 }
//                 resolve(hash);
//             });
            
//         })
//     });
// };

// const comparePassword = async (password, hash) => {
//     return new Promise((resolve, reject) => {
//         bcrypt.compare(password, hash, (err, result) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(result);
//         });
//     });
// };

// module.exports = {
//     hashPassword,
//     comparePassword
// };

// const checkLabTechnician = (req, res, next) => {
//     const { role } = req.user; // assuming the user's role is in the JWT token
  
//     if (role !== "labTechnician") {
//       return res.status(403).json({ message: "Forbidden: You do not have the required access" });
//     }
  
//     next(); // Continue to the next middleware or route handler
//   };

//   module.exports = {
//     checkLabTechnician
//   }