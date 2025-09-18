const protect = require('./protect');

const adminProtect = (req, res, next) => {
  protect(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access only' });
    }
  });
};

module.exports = adminProtect;
