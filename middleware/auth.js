function isAuthenticated(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  }
  next();
}

module.exports = { isAuthenticated };
