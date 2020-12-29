const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

const AuthService = {
  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          reject()
        }
        resolve(decoded)
      })
    })
  },
  authenticateUser(req, res, next) {
    const token = req.get('authorization') || ''
    if (!token.toLowerCase().startsWith('bearer') || !token.split(' ')[1]) {
      return res.status(401).json({ message: 'Missing or malformed authorization header' })
    }
    AuthService.verifyToken(token.split(' ')[1])
      .then(user => { req.user = user; next() })
      .catch(() => res.status(401).json({ message: 'Invalid credentials' }))
  }
}

module.exports = AuthService