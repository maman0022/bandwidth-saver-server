const express = require('express')
const bcrypt = require('bcryptjs')
const xss = require('xss')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { JWT_SECRET, RECAPTCHA_SECRET } = require('../config')
const DatabaseService = require('../services/DatabaseService')

const LoginUser = express.Router()

function sanitizeUser(user) {
  return {
    id: user.id,
    first_name: xss(user.first_name),
    identifier: xss(user.email)
  }
}

LoginUser
  .route('/')
  .post(async (req, res, next) => {
    try {
      const requiredFields = { 'Email': 'email', 'Password': 'password', 'CAPTCHA Token': 'captchaToken' }
      for (const field in requiredFields) {
        if (!req.body[requiredFields[field]]) {
          return res.status(400).json({ message: `${field} is required` })
        }
      }
      const { email, password, captchaToken } = req.body
      const query = `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`
      const captchaCheck = await axios.post(`https://www.google.com/recaptcha/api/siteverify?${query}`)
      const { data } = captchaCheck
      if (!data) {
        return res.status(400).json({ message: 'Unable to verify CAPTCHA' })
      }
      if (!data.success) {
        return res.status(400).json({ message: 'Incorrect or expired CAPTCHA. Please Refresh & Try Again.' })
      }
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