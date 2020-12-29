const express = require('express')
const bcrypt = require('bcryptjs')
const xss = require('xss')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const DatabaseService = require('../services/DatabaseService')

const LoginUser = express.Router()

function sanitizeUser(user) {
  return {
    id: user.id,
    first_name: xss(user.first_name)
  }
}

LoginUser
  .route('/')
  .post(async (req, res, next) => {
    try {
      const requiredFields = { 'Email': 'email', 'Password': 'password' }
      for (const field in requiredFields) {
        if (!req.body[requiredFields[field]]) {
          return res.status(400).json({ message: `${field} is required` })
        }
      }
      const { email, password } = req.body
      const user = await DatabaseService.getUser(req.app.get('db'), email)
      if (!user) {
        return res.status(401).json({ message: 'Username or password is incorrect' })
      }
      const isPwGood = await bcrypt.compare(password, user.pw)
      if (!isPwGood) {
        return res.status(401).json({ message: 'Username or password is incorrect' })
      }
      jwt.sign(sanitizeUser(user), JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
        if (err) {
          throw new Error(err)
        }
        res.status(200).json({ token })
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = LoginUser