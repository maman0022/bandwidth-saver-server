const express = require('express')
const bcrypt = require('bcryptjs')
const xss = require('xss')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { JWT_SECRET, RECAPTCHA_SECRET } = require('../config')
const DatabaseService = require('../services/DatabaseService')

const RegisterUser = express.Router()

function sanitizeUser(user) {
  return {
    id: user.id,
    first_name: xss(user.first_name),
    identifier: xss(user.email)
  }
}

RegisterUser
  .route('/')
  .post(async (req, res, next) => {
    try {
      const requiredFields = { 'First Name': 'fname', 'Last Name': 'lname', 'Email': 'email', 'Password': 'password', 'CAPTCHA Token': 'captchaToken' }
      for (const field in requiredFields) {
        if (!req.body[requiredFields[field]]) {
          return res.status(400).json({ message: `${field} is required` })
        }
      }
      const { fname: first_name, lname: last_name, email, password, captchaToken } = req.body
      const query = `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`
      const captchaCheck = await axios.post(`https://www.google.com/recaptcha/api/siteverify?${query}`)
      const { data } = captchaCheck
      if (!data) {
        return res.status(400).json({ message: 'Unable to verify CAPTCHA' })
      }
      if (!data.success) {
        return res.status(400).json({ message: 'Incorrect or expired CAPTCHA. Please Refresh & Try Again.' })
      }
      const isPwGood = (password.length >= 6 && password.length <= 72)
      if (!isPwGood) {
        return res.status(400).json({ message: 'Password must be between 6 and 72 characters' })
      }
      const user = await DatabaseService.getUser(req.app.get('db'), email)
      if (user) {
        return res.status(400).json({ message: 'User already exists' })
      }
      const pw = await bcrypt.hash(password, 10)
      const userData = {
        first_name,
        last_name,
        email,
        pw
      }
      const fingerprintData = {
        identifier: email,
        max_per_hour: 5,
        current_usage: 0,
        next_reset: Date.now() + 3600000
      }
      const registeredUser = await DatabaseService.addUser(req.app.get('db'), userData)
      await DatabaseService.addFingerprint(req.app.get('db'), fingerprintData)
      jwt.sign(sanitizeUser(registeredUser), JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
        if (err) {
          throw new Error(err)
        }
        res.status(201).json({ token })
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = RegisterUser