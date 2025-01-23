// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Replace with your actual secret key

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
