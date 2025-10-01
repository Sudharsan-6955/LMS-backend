const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    // Accept if token has isAdmin: true or adminId
    if (decoded.isAdmin === true || decoded.adminId) {
      req.admin = decoded;
      return next();
    }
    return res.status(403).json({ message: 'Not authorized as admin' });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
