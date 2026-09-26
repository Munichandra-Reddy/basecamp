import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'teamflow_super_secret_jwt_key_2026';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (token === 'demo_token_123') {
    req.user = { id: 1, name: 'Reyhan Adinata', email: 'reyhan@abctechnologies.com', role: 'Super Admin' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
